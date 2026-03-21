"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle, Search, Send, Reply, Smile, Trash2, RotateCcw,
  Plus, Camera, Image as ImageIcon, FileText, X, Users, Info,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

type Channel = { id: string; name: string; studentCount: number; status?: string };
type Member  = { id: string; full_name: string; avatar_url?: string; role: "teacher" | "student" };
type Msg     = any;
type InfoTab = "members" | "search";

function Avatar({ url, name, size = 10 }: { url?: string; name?: string; size?: number }) {
  return url ? (
    <div className={`w-${size} h-${size} rounded-full shrink-0 overflow-hidden`}>
      <img src={url} className="w-full h-full object-cover" alt={name} />
    </div>
  ) : (
    <div className={`w-${size} h-${size} rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white`} style={{ background: "var(--accent)" }}>
      {name?.charAt(0) || "?"}
    </div>
  );
}

export default function TeacherMessagesPage() {
  const supabase = createClient();

  const [channels,      setChannels]      = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages,      setMessages]      = useState<Msg[]>([]);
  const [members,       setMembers]       = useState<Member[]>([]);
  const [currentUser,   setCurrentUser]   = useState<any>(null);
  const [loading,       setLoading]       = useState(true);
  const [newMessage,    setNewMessage]    = useState("");
  const [replyingTo,    setReplyingTo]    = useState<Msg | null>(null);
  const [hoveredMsg,    setHoveredMsg]    = useState<string | null>(null);
  const [reactingTo,    setReactingTo]    = useState<string | null>(null);
  const [showAttach,    setShowAttach]    = useState(false);
  const [isUploading,   setIsUploading]   = useState(false);
  const [showInfo,      setShowInfo]      = useState(false);
  const [infoTab,       setInfoTab]       = useState<InfoTab>("members");
  const [msgSearch,     setMsgSearch]     = useState("");
  const [chSearch,      setChSearch]      = useState("");

  const [confirmUnsend, setConfirmUnsend] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const searchInputRef  = useRef<HTMLInputElement>(null);
  const hoverTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHover = (id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredMsg(id);
  };
  const endHover = () => {
    hoverTimer.current = setTimeout(() => setHoveredMsg(null), 200);
  };
  const cancelEndHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const prevMsgCount = useRef(0);
  const prevChannel = useRef<string | null>(null);

  useEffect(() => {
    const h = () => { setReactingTo(null); setShowAttach(false); };
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);

  useEffect(() => {
    if (activeChannel?.id !== prevChannel.current || messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevChannel.current = activeChannel?.id || null;
    prevMsgCount.current = messages.length;
  }, [messages, activeChannel]);

  useEffect(() => {
    if (showInfo && infoTab === "search") setTimeout(() => searchInputRef.current?.focus(), 150);
  }, [showInfo, infoTab]);

  /* fetch channels */
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);
      const { data } = await supabase
        .from("courses")
        .select(`id,title,status,class_sessions(bookings(id))`)
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });
      if (data) {
        const list: Channel[] = data.map((c: any) => {
          let count = 0;
          c.class_sessions?.forEach((s: any) => { count += s.bookings?.length || 0; });
          return { id: c.id, name: c.title || "Khóa học Yoga", studentCount: count, status: c.status };
        });
        setChannels(list);
        if (list.length > 0) setActiveChannel(list[0]);
      }
      setLoading(false);
    })();
  }, []);

  /* realtime messages */
  useEffect(() => {
    if (!activeChannel) return;
    fetchMessages(activeChannel.id);
    const sub = supabase.channel(`teacher_msgs_${activeChannel.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages", filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const { data: author } = await supabase.from("users").select("id,full_name,avatar_url").eq("id", payload.new.user_id).single();
            setMessages(p => [...p, { ...payload.new, users: author }]);
          } else if (payload.eventType === "UPDATE") {
            setMessages(p => p.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
          } else if (payload.eventType === "DELETE") {
            setMessages(p => p.filter(m => m.id !== payload.old.id));
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [activeChannel]);

  useEffect(() => {
    if (showInfo && infoTab === "members" && activeChannel && members.length === 0)
      fetchMembers(activeChannel.id);
  }, [showInfo, infoTab, activeChannel]);

  useEffect(() => { setMembers([]); }, [activeChannel]);

  const fetchMessages = async (channelId: string) => {
    const { data } = await supabase.from("chat_messages").select("*, users(id,full_name,avatar_url)").eq("channel_id", channelId).order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  const fetchMembers = async (courseId: string) => {
    try {
      const { data: course } = await supabase.from("courses").select("teacher_id").eq("id", courseId).single();
      const { data: sessions } = await supabase.from("class_sessions").select("id").eq("course_id", courseId);
      const sids = sessions?.map((s: any) => s.id) || [];
      let studentIds: string[] = [];
      if (sids.length > 0) {
        const { data: bkgs } = await supabase.from("bookings").select("student_id").in("session_id", sids);
        studentIds = [...new Set(bkgs?.map((b: any) => b.student_id) || [])] as string[];
      }
      const allIds = [course?.teacher_id, ...studentIds].filter(Boolean) as string[];
      const { data: users } = await supabase.from("users").select("id,full_name,avatar_url").in("id", allIds);
      if (users) setMembers(users.map((u: any) => ({ ...u, role: u.id === course?.teacher_id ? "teacher" : "student" })));
    } catch (e) { console.error(e); }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChannel || !currentUser) return;
    const content = newMessage.trim();
    const replyId = replyingTo?.id || null;
    setNewMessage(""); setReplyingTo(null);
    const { error } = await supabase.from("chat_messages").insert({ channel_id: activeChannel.id, user_id: currentUser.id, content, reply_to_id: replyId });
    if (error) toast.error("Lỗi gửi tin nhắn!");
  };

  const unsend = async (id: string) => {
    // Optimistic: update local state immediately
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, is_deleted: true, content: "Tin nhắn đã bị thu hồi", attachment_url: null } : m
    ));
    setConfirmUnsend(null);
    setHoveredMsg(null);
    // Persist to Supabase
    const { error } = await supabase
      .from("chat_messages")
      .update({ is_deleted: true, content: "Tin nhắn đã bị thu hồi", attachment_url: null })
      .eq("id", id);
    if (error) {
      toast.error("Không thể thu hồi tin nhắn!");
      setMessages(prev => prev.map(m =>
        m.id === id ? { ...m, is_deleted: false } : m
      ));
    }
  };

  const deleteForMe = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    const upd = { ...(msg.reactions || {}) };
    const arr = upd._deleted_by || [];
    if (!arr.includes(currentUser.id)) upd._deleted_by = [...arr, currentUser.id];
    setMessages(prev => prev.map(m => m.id === id ? { ...m, reactions: upd } : m));
    setConfirmDelete(null);
    setHoveredMsg(null);
    await supabase.from("chat_messages").update({ reactions: upd }).eq("id", id);
  };

  const reactTo = async (msg: Msg, emoji: string) => {
    let r = { ...(msg.reactions || {}) };
    let arr: string[] = r[emoji] || [];
    arr = arr.includes(currentUser.id) ? arr.filter((u: string) => u !== currentUser.id) : [...arr, currentUser.id];
    if (arr.length === 0) delete r[emoji]; else r[emoji] = arr;
    await supabase.from("chat_messages").update({ reactions: r }).eq("id", msg.id);
    setReactingTo(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File quá lớn (max 5MB)!"); return; }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const isImage = file.type.startsWith("image/");
      await supabase.from("chat_messages").insert({ channel_id: activeChannel!.id, user_id: currentUser.id, content: isImage ? "Đã gửi một ảnh" : `Đã gửi file: ${file.name}`, attachment_url: ev.target?.result as string, attachment_type: isImage ? "image" : "file", reply_to_id: replyingTo?.id || null });
      setIsUploading(false); setReplyingTo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const doUpload = (type: string) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = type === "file" ? "*/*" : "image/*";
    if (type === "camera") fileInputRef.current.setAttribute("capture", "environment");
    else fileInputRef.current.removeAttribute("capture");
    fileInputRef.current.click();
    setShowAttach(false);
  };

  const filteredMessages = msgSearch.trim() ? messages.filter(m => m.content?.toLowerCase().includes(msgSearch.toLowerCase())) : messages;
  const filteredChannels = chSearch.trim() ? channels.filter(c => c.name.toLowerCase().includes(chSearch.toLowerCase())) : channels;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm max-w-7xl mx-auto">

      {/* LEFT */}
      <div className="w-72 shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--bg-base)]">
        <div className="px-4 pt-5 pb-3 border-b border-[var(--border)]">
          <h2 className="font-bold text-base mb-3">Lớp học của tôi</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
            <input value={chSearch} onChange={e => setChSearch(e.target.value)} placeholder="Tìm lớp học..." className="w-full h-9 pl-9 pr-3 rounded-full bg-white border border-[var(--border-medium)] text-sm outline-none focus:border-[var(--accent)] transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? [1,2,3].map(n => <div key={n} className="mx-3 my-1 h-[60px] bg-slate-100 rounded-xl animate-pulse" />) :
            filteredChannels.length > 0 ? filteredChannels.map(ch => {
              const active = activeChannel?.id === ch.id;
              return (
                <button key={ch.id} onClick={() => { setActiveChannel(ch); setShowInfo(false); setMsgSearch(""); setMembers([]); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${active ? "bg-[var(--accent-tint)]" : "hover:bg-slate-100"}`}>
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white`} style={{ background: "var(--accent)" }}>{ch.name.charAt(0)}</div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${active ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>{ch.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1"><Users className="w-3 h-3" /> {ch.studentCount} học viên</p>
                  </div>
                </button>
              );
            }) : <p className="text-center text-sm text-[var(--text-hint)] p-6">Không tìm thấy lớp học.</p>
          }
        </div>
      </div>

      {/* MIDDLE */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeChannel ? (
          <>
            {/* Header */}
            <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "var(--accent)" }}>{activeChannel.name.charAt(0)}</div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-none">{activeChannel.name}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{activeChannel.studentCount} học viên</p>
                </div>
              </div>
              <button onClick={() => setShowInfo(p => !p)} title="Thông tin cuộc trò chuyện"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showInfo ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "hover:bg-slate-100 text-[var(--text-secondary)]"}`}>
                <Info className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Messages + modal wrapper */}
            <div className="flex-1 relative min-h-0 overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto px-4 py-4 flex flex-col gap-1">
              {filteredMessages.length === 0 ? (
                <div className="m-auto text-center opacity-50">
                  <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-hint)]">{msgSearch ? "Không tìm thấy tin nhắn." : "Bắt đầu thảo luận với lớp học!"}</p>
                </div>
              ) : filteredMessages.map((msg: Msg) => {
                const isMe = msg.users?.id === currentUser?.id;
                const replied = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;
                const isHit = !!msgSearch && msg.content?.toLowerCase().includes(msgSearch.toLowerCase());
                
                if (msg.reactions?._deleted_by?.includes(currentUser?.id)) return null;

                return (
                  <div key={msg.id} id={`msg-${msg.id}`}
                    className={`flex gap-2 max-w-[75%] relative group ${isMe ? "self-end flex-row-reverse" : "self-start"} ${isHit ? "ring-2 ring-yellow-300 ring-offset-1 rounded-2xl" : ""}`}
                    onMouseEnter={() => startHover(msg.id)} onMouseLeave={endHover}>
                    {!isMe && <div className="mt-auto mb-1 shrink-0"><Avatar url={msg.users?.avatar_url} name={msg.users?.full_name} size={8} /></div>}
                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && <span className="text-[11px] text-[var(--text-hint)] ml-1 mb-0.5 font-medium">{msg.users?.full_name}</span>}
                      {replied && (
                        <div onClick={() => document.getElementById(`msg-${replied.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                          className={`mb-1 px-3 py-1.5 rounded-xl text-[11px] border-l-4 cursor-pointer hover:opacity-90 max-w-[240px] ${isMe ? "bg-blue-50 border-[var(--accent)] text-slate-700" : "bg-slate-100 border-slate-400 text-slate-700"}`}>
                          <b className="block truncate">{replied.users?.full_name}</b>
                          <span className="opacity-70 truncate">{replied.is_deleted ? "Tin nhắn đã thu hồi" : replied.content}</span>
                        </div>
                      )}
                      <div className={`px-4 py-2.5 text-sm leading-relaxed relative rounded-2xl max-w-full
                        ${msg.is_deleted ? "italic text-[var(--text-hint)] bg-slate-50 border border-dashed border-slate-200" : isMe ? "bg-[var(--accent)] text-white rounded-br-sm" : "bg-slate-100 text-[var(--text-primary)] rounded-bl-sm"}`}>
                        {msg.attachment_url && !msg.is_deleted && (
                          msg.attachment_type === "image"
                            ? <img src={msg.attachment_url} className="max-w-[240px] rounded-xl mb-2 cursor-pointer hover:opacity-90 block" onClick={() => window.open(msg.attachment_url, "_blank")} alt="img" />
                            : <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl mb-2 text-xs font-medium border border-white/20"><FileText className="w-4 h-4" /> Tệp đính kèm</a>
                        )}
                        {msg.content}
                        {!msg.is_deleted && msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className={`absolute -bottom-4 ${isMe ? "right-1" : "left-1"} flex gap-0.5 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow text-xs z-10`}>
                            {Object.entries(msg.reactions).map(([em, arr]: any) => em !== "_deleted_by" && arr.length > 0 && (
                              <span key={em} className="cursor-pointer hover:scale-110 transition-transform flex items-center gap-0.5" onClick={() => reactTo(msg, em)}>
                                {em}{arr.length > 1 && <span className="text-[9px] text-slate-500">{arr.length}</span>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover toolbar */}
                    {(hoveredMsg === msg.id || reactingTo === msg.id) && confirmUnsend !== msg.id && confirmDelete !== msg.id && (
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 ${isMe ? "right-full mr-2" : "left-full ml-2"} flex items-center gap-0.5 bg-white border border-slate-200 shadow-lg rounded-full px-2 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap`}
                        onClick={e => e.stopPropagation()}
                        onMouseEnter={cancelEndHover} onMouseLeave={endHover}
                      >
                        {!msg.is_deleted && (
                          <>
                            <div className="relative">
                              <button onClick={() => setReactingTo(reactingTo === msg.id ? null : msg.id)} className={`p-1.5 rounded-full ${reactingTo === msg.id ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "hover:bg-slate-100 text-[var(--text-secondary)]"}`}><Smile className="w-4 h-4" /></button>
                              {reactingTo === msg.id && (
                                <div className={`absolute bottom-10 ${isMe ? "right-0" : "left-0"} bg-white border border-slate-200 shadow-xl rounded-full px-2 py-1.5 flex gap-1.5 z-40`}>
                                  {EMOJI_OPTIONS.map(em => <button key={em} onClick={() => reactTo(msg, em)} className="text-lg hover:scale-125 transition-transform">{em}</button>)}
                                </div>
                              )}
                            </div>
                            <button onClick={() => { setReplyingTo(msg); setTimeout(() => inputRef.current?.focus(), 50); }} className="p-1.5 hover:bg-slate-100 rounded-full text-[var(--text-secondary)]"><Reply className="w-4 h-4" /></button>
                            {isMe && (
                              <button
                                onClick={() => setConfirmUnsend(msg.id)}
                                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                                title="Thu hồi tin nhắn"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => setConfirmDelete(msg.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-full text-rose-400 transition-colors flex-shrink-0"
                          title="Xóa tin nhắn ở phía tôi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {isUploading && <div className="self-end px-4 py-2.5 bg-[var(--accent-tint)] rounded-2xl text-sm text-[var(--accent)] animate-pulse">Đang tải lên...</div>}
              <div ref={messagesEndRef} />
              </div>{/* close inner scroll */}

            {/* ── Centered unsend confirm modal ── */}
            {confirmUnsend && (
              <div
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/5 animate-in fade-in duration-150"
                onClick={() => setConfirmUnsend(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-xl p-5 w-[260px] flex flex-col items-center gap-2.5 animate-in zoom-in-95 duration-150"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-[15px] text-[var(--text-primary)]">Thu hồi tin nhắn?</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] text-center leading-tight px-2">
                    Hành động này không thể hoàn tác với tất cả mọi người.
                  </p>
                  <div className="flex w-full gap-2 mt-2">
                    <button onClick={() => setConfirmUnsend(null)} className="flex-1 h-9 rounded-xl font-semibold text-[13px] bg-slate-100 hover:bg-slate-200 text-[var(--text-secondary)] transition-colors">Huỷ bỏ</button>
                    <button onClick={() => unsend(confirmUnsend)} className="flex-1 h-9 rounded-xl font-semibold text-[13px] bg-slate-800 hover:bg-slate-900 text-white transition-colors shadow-sm">Thu hồi</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Centered delete confirm modal ── */}
            {confirmDelete && (
              <div
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/5 animate-in fade-in duration-150"
                onClick={() => setConfirmDelete(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-xl p-5 w-[260px] flex flex-col items-center gap-2.5 animate-in zoom-in-95 duration-150"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="font-bold text-[15px] text-[var(--text-primary)]">Xóa ở phía bạn?</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] text-center leading-tight px-1">
                    Tin nhắn này sẽ được xóa khỏi phía bạn. Những người khác vẫn có thể tiếp tục xem.
                  </p>
                  <div className="flex w-full gap-2 mt-2">
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 h-9 rounded-xl font-semibold text-[13px] bg-slate-100 hover:bg-slate-200 text-[var(--text-secondary)] transition-colors">Huỷ bỏ</button>
                    <button onClick={() => deleteForMe(confirmDelete)} className="flex-1 h-9 rounded-xl font-semibold text-[13px] bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm">Gỡ bỏ</button>
                  </div>
                </div>
              </div>
            )}
            </div>{/* close outer relative wrapper */}

            {/* Input */}
            <div className="border-t border-[var(--border)] bg-white px-4 py-3 shrink-0">
              {replyingTo && (
                <div className="flex items-center justify-between bg-[var(--accent-tint)] rounded-xl px-3 py-2 mb-2 border-l-4 border-[var(--accent)]">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[var(--accent)] flex items-center gap-1"><Reply className="w-3 h-3" /> Đang trả lời {replyingTo.users?.full_name}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate max-w-[300px]">{replyingTo.content}</p>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 text-[var(--text-hint)] hover:text-rose-500 shrink-0"><X className="w-4 h-4" /></button>
                </div>
              )}
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                <div className="relative">
                  <button type="button" onClick={e => { e.stopPropagation(); setShowAttach(p => !p); setReactingTo(null); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${showAttach ? "bg-[var(--accent)] text-white rotate-45" : "bg-slate-100 hover:bg-slate-200 text-[var(--text-secondary)]"}`}>
                    <Plus className="w-5 h-5" />
                  </button>
                  {showAttach && (
                    <div className="absolute bottom-11 left-0 bg-white border border-[var(--border)] shadow-xl rounded-2xl p-1.5 w-44 flex flex-col gap-0.5 z-50 animate-in slide-in-from-bottom-2">
                      {[{ label: "Máy ảnh", icon: Camera, type: "camera" }, { label: "Thư viện ảnh", icon: ImageIcon, type: "image" }, { label: "Tệp tài liệu", icon: FileText, type: "file" }].map(({ label, icon: Icon, type }) => (
                        <button key={type} type="button" onClick={() => doUpload(type)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-slate-50 rounded-xl transition-colors text-left">
                          <Icon className="w-4 h-4 text-[var(--text-hint)]" /> {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input ref={inputRef} value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Nhắn tin tới ${activeChannel.name}...`} disabled={isUploading}
                  className="flex-1 h-10 px-4 rounded-full bg-slate-100 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-hint)] outline-none focus:bg-slate-50 transition-colors" />
                <button type="submit" disabled={!newMessage.trim() || isUploading}
                  className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 hover:opacity-90 disabled:opacity-40 active:scale-95 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-sm text-[var(--text-hint)]">Chọn một lớp học để bắt đầu</p>
          </div>
        )}
      </div>

      {/* RIGHT: Info Panel with tabs */}
      {showInfo && activeChannel && (
        <div className="w-72 shrink-0 border-l border-[var(--border)] flex flex-col bg-white animate-in slide-in-from-right-3 duration-200">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)] shrink-0">
            <span className="font-semibold text-sm">Thông tin</span>
            <button onClick={() => setShowInfo(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[var(--text-hint)]"><X className="w-4 h-4" /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] shrink-0">
            {(["members", "search"] as InfoTab[]).map(tab => (
              <button key={tab} onClick={() => setInfoTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${infoTab === tab ? "border-b-2 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                {tab === "members" ? <><Users className="w-3.5 h-3.5" /> Thành viên</> : <><Search className="w-3.5 h-3.5" /> Tìm kiếm</>}
              </button>
            ))}
          </div>

          {/* Tab: Members */}
          {infoTab === "members" && (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col items-center gap-2 py-6 px-4 border-b border-[var(--border)]">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: "var(--accent)" }}>{activeChannel.name.charAt(0)}</div>
                <p className="font-bold text-sm text-center">{activeChannel.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{activeChannel.studentCount} học viên</p>
                {members.length > 0 && <span className="mt-1 px-3 py-0.5 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold">{members.length} thành viên</span>}
              </div>
              {members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <Users className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs text-[var(--text-hint)]">Đang tải thành viên...</p>
                </div>
              ) : (
                <div className="p-3 space-y-0.5">
                  {[...members].sort(a => a.role === "teacher" ? -1 : 1).map(m => (
                    <div key={m.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="relative shrink-0">
                        <Avatar url={m.avatar_url} name={m.full_name} size={9} />
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.full_name} {m.id === currentUser?.id && <span className="text-[var(--text-hint)] font-normal">(Bạn)</span>}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${m.role === "teacher" ? "text-[var(--accent)]" : "text-[var(--text-hint)]"}`}>{m.role === "teacher" ? "Giảng viên" : "Học viên"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Search */}
          {infoTab === "search" && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="px-3 py-3 border-b border-[var(--border)]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
                  <input ref={searchInputRef} value={msgSearch} onChange={e => setMsgSearch(e.target.value)} placeholder="Tìm trong cuộc trò chuyện..."
                    className="w-full h-9 pl-9 pr-3 rounded-full bg-slate-100 text-sm outline-none focus:bg-slate-50 transition-colors" />
                  {msgSearch && <button onClick={() => setMsgSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-hint)] hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>}
                </div>
                {msgSearch && <p className="text-[11px] text-[var(--text-hint)] mt-1.5 px-1">{filteredMessages.length} kết quả</p>}
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {!msgSearch ? (
                  <p className="text-center text-xs text-[var(--text-hint)] mt-8">Nhập từ khóa để tìm kiếm.</p>
                ) : filteredMessages.length === 0 ? (
                  <p className="text-center text-xs text-[var(--text-hint)] mt-8">Không tìm thấy tin nhắn nào.</p>
                ) : filteredMessages.map((msg: Msg) => (
                  <button key={msg.id} onClick={() => document.getElementById(`msg-${msg.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="w-full text-left flex items-center gap-2.5 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                    <Avatar url={msg.users?.avatar_url} name={msg.users?.full_name} size={8} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{msg.users?.full_name}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{msg.content}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
