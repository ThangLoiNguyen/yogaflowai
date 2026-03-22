"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle, Search, Hash, Send, Reply, Smile, Trash2, RotateCcw,
  Plus, Camera, Image as ImageIcon, FileText, X, Users, Info, ArrowLeft
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

type Channel = { id: string; name: string; teacher: string; avatar?: string };
type Member = { id: string; full_name: string; avatar_url?: string; role: "teacher" | "student" };
type Msg = any;
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

export default function StudentMessagesPage() {
  const supabase = createClient();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Msg | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [reactingTo, setReactingTo] = useState<string | null>(null);
  const [showAttach, setShowAttach] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoTab, setInfoTab] = useState<InfoTab>("members");
  const [msgSearch, setMsgSearch] = useState("");
  const [chSearch, setChSearch] = useState("");

  const [confirmUnsend, setConfirmUnsend] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHover = (id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredMsg(id);
  };
  const endHover = () => {
    hoverTimer.current = setTimeout(() => {
      setHoveredMsg(null);
      setReactingTo(null);
    }, 300); // Increased delay
  };
  const cancelEndHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const prevMsgCount = useRef(0);
  const prevChannel = useRef<string | null>(null);

  /* close popovers on outside click */
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
        .from("bookings")
        .select(`class_sessions!inner(courses!inner(id,title,users!teacher_id(id,full_name,avatar_url)))`)
        .eq("student_id", user.id);

      const map = new Map<string, Channel>();
      data?.forEach((b: any) => {
        const c = b.class_sessions?.courses;
        if (c?.id && !map.has(c.id))
          map.set(c.id, { id: c.id, name: c.title || "Khóa học Yoga", teacher: c.users?.full_name || "Giảng viên", avatar: c.users?.avatar_url });
      });

      const list = Array.from(map.values());
      setChannels(list);
      if (list.length > 0) setActiveChannel(list[0]);
      setLoading(false);
    })();
  }, []);

  /* realtime messages */
  useEffect(() => {
    if (!activeChannel) return;
    fetchMessages(activeChannel.id);

    const sub = supabase
      .channel(`msgs_${activeChannel.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages", filter: `channel_id=eq.${activeChannel.id}` },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Check if we already have this message (optimistic reconciliation)
            setMessages(p => {
              const exists = p.find(m => m.id === payload.new.id || (m.isOptimistic && m.content === payload.new.content && m.user_id === payload.new.user_id));
              if (exists) {
                return p.map(m => (m === exists ? { ...payload.new, users: exists.users } : m));
              }
              // If truly new, fetch author and add
              (async () => {
                const { data: author } = await supabase.from("users").select("id,full_name,avatar_url").eq("id", payload.new.user_id).single();
                setMessages(prev => {
                  if (prev.find(m => m.id === payload.new.id)) return prev;
                  return [...prev, { ...payload.new, users: author }];
                });
              })();
              return p;
            });
          } else if (payload.eventType === "UPDATE") {
            setMessages(p => p.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
          } else if (payload.eventType === "DELETE") {
            setMessages(p => p.filter(m => m.id !== payload.old.id));
          }
        })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [activeChannel]);

  /* fetch members when info panel opens on members tab */
  useEffect(() => {
    if (showInfo && infoTab === "members" && activeChannel && members.length === 0)
      fetchMembers(activeChannel.id);
  }, [showInfo, infoTab, activeChannel]);

  /* reset members when channel changes */
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
    const tempId = "opt_" + Math.random().toString(36).substr(2, 9);

    // Optimistic Update
    const optMsg: Msg = {
      id: tempId,
      channel_id: activeChannel.id,
      user_id: currentUser.id,
      content,
      reply_to_id: replyId,
      created_at: new Date().toISOString(),
      isOptimistic: true,
      users: { id: currentUser.id, full_name: currentUser.user_metadata?.full_name || "Tôi", avatar_url: currentUser.user_metadata?.avatar_url }
    };
    setMessages(p => [...p, optMsg]);
    setNewMessage(""); setReplyingTo(null);

    const { data, error } = await supabase.from("chat_messages").insert({ channel_id: activeChannel.id, user_id: currentUser.id, content, reply_to_id: replyId }).select().single();
    if (error) {
      toast.error("Lỗi gửi tin nhắn!");
      setMessages(p => p.filter(m => m.id !== tempId));
    } else if (data) {
      // Replace optimistic message with real one
      setMessages(p => p.map(m => m.id === tempId ? { ...data, users: optMsg.users } : m));
    }
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

  const filteredMessages = msgSearch.trim()
    ? messages.filter(m => m.content?.toLowerCase().includes(msgSearch.toLowerCase()))
    : messages;

  const filteredChannels = chSearch.trim()
    ? channels.filter(c => c.name.toLowerCase().includes(chSearch.toLowerCase()) || c.teacher.toLowerCase().includes(chSearch.toLowerCase()))
    : channels;

  const openInfo = (tab: InfoTab) => {
    if (showInfo && infoTab === tab) { setShowInfo(false); }
    else { setShowInfo(true); setInfoTab(tab); }
  };

  /* ─────────── RENDER ─────────── */
  return (
    <div className="flex fixed inset-0 lg:static h-[100dvh] lg:h-[calc(100vh-10rem)] bg-white lg:rounded-2xl border-none lg:border lg:border-[var(--border)] overflow-hidden lg:shadow-sm max-w-[1600px] mx-auto z-[40] lg:z-auto">

      {/* ── LEFT: Channel list ── */}
      <div className={cn(
        "w-full lg:w-80 shrink-0 lg:border-r border-[var(--border)] flex flex-col bg-[var(--bg-base)] transition-all duration-300 pb-[76px] lg:pb-0",
        activeChannel ? "hidden lg:flex" : "flex"
      )}>
        <div className="px-4 pt-5 pb-3 border-b border-[var(--border)]">
          <h2 className="font-bold text-base mb-3">Thảo luận</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
            <input value={chSearch} onChange={e => setChSearch(e.target.value)} placeholder="Tìm đoạn chat..." className="w-full h-9 pl-9 pr-3 rounded-full bg-white border border-[var(--border-medium)] text-sm outline-none focus:border-[var(--accent)] transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading ? [1, 2, 3].map(n => <div key={n} className="mx-3 my-1 h-[60px] bg-slate-100 rounded-xl animate-pulse" />) :
            filteredChannels.length > 0 ? filteredChannels.map(ch => {
              const active = activeChannel?.id === ch.id;
              return (
                <button key={ch.id} onClick={() => { setActiveChannel(ch); setShowInfo(false); setMsgSearch(""); setMembers([]); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${active ? "bg-[var(--accent-tint)]" : "hover:bg-slate-100"}`}>
                  <div className="relative shrink-0">
                    <Avatar url={ch.avatar} name={ch.name} size={11} />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${active ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>{ch.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">GV. {ch.teacher}</p>
                  </div>
                </button>
              );
            }) : <p className="text-center text-sm text-[var(--text-hint)] p-4">Không có kênh nào.</p>
          }
        </div>
      </div>

      {/* ── MIDDLE/RIGHT: Chat ── */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white transition-all duration-300",
        !activeChannel ? "hidden lg:flex" : "fixed inset-0 pb-[76px] lg:static lg:pb-0 z-50 flex"
      )}>
        {activeChannel ? (
          <>
            {/* Header */}
            <div className="h-16 lg:h-20 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3 lg:gap-4">
                <button onClick={() => setActiveChannel(null)} className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-[var(--accent)]"><ArrowLeft className="w-5 h-5" /></button>
                <div className="relative shrink-0">
                  <Avatar url={activeChannel.avatar} name={activeChannel.name} size={10} />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-none">{activeChannel.name}</p>
                  <p className="text-[11px] text-green-500 mt-0.5 font-medium">Đang hoạt động</p>
                </div>
              </div>

              {/* Single Info button */}
              <button
                onClick={() => setShowInfo(p => !p)}
                title="Thông tin cuộc trò chuyện"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${showInfo ? "bg-[var(--accent)] text-white scale-105" : "bg-slate-50 hover:bg-slate-100 text-[var(--text-secondary)]"}`}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Messages + modal wrapper */}
            <div className="flex-1 relative min-h-0 overflow-hidden bg-slate-50/30">
              <div className="absolute inset-0 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 flex flex-col gap-2">
                {filteredMessages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <MessageCircle className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Bắt đầu thảo luận</h3>
                    <p className="max-w-xs text-sm text-slate-400">Hãy gửi tin nhắn đầu tiên để bắt đầu quá trình đồng hành cùng giáo viên.</p>
                  </div>
                ) : filteredMessages.map((msg: Msg, idx: number) => {
                  const isMe = msg.users?.id === currentUser?.id;
                  const replied = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;
                  const isHit = !!msgSearch && msg.content?.toLowerCase().includes(msgSearch.toLowerCase());

                  if (msg.reactions?._deleted_by?.includes(currentUser?.id)) return null;

                  // Date separation logic
                  const currentDate = new Date(msg.created_at).toLocaleDateString("vi-VN");
                  const prevDate = idx > 0 ? new Date(filteredMessages[idx - 1].created_at).toLocaleDateString("vi-VN") : null;
                  const showDivider = currentDate !== prevDate;
                  const dateDisplay = currentDate === new Date().toLocaleDateString("vi-VN") ? "Hôm nay" :
                    currentDate === new Date(Date.now() - 86400000).toLocaleDateString("vi-VN") ? "Hôm qua" : currentDate;

                  return (
                    <React.Fragment key={msg.id}>
                      {showDivider && (
                        <div className="flex items-center gap-4 my-6 opacity-40">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{dateDisplay}</span>
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-400" />
                        </div>
                      )}
                      <div className={`w-full flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`} onMouseEnter={() => startHover(msg.id)} onMouseLeave={endHover}>
                        <div id={`msg-${msg.id}`}
                          className={`flex gap-3 max-w-[85%] lg:max-w-[70%] relative group ${isMe ? "flex-row-reverse" : ""} ${isHit ? "ring-2 ring-yellow-300 ring-offset-2 rounded-2xl" : ""} ${msg.isOptimistic ? "opacity-60" : ""}`}
                        >
                          {!isMe && <div className="mt-auto mb-1 shrink-0"><Avatar url={msg.users?.avatar_url} name={msg.users?.full_name} size={10} /></div>}
                          <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {!isMe && <span className="text-[11px] text-[var(--text-hint)] ml-1 mb-0.5 font-medium">{msg.users?.full_name}</span>}
                            {replied && (
                              <div onClick={() => document.getElementById(`msg-${replied.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                                className={`mb-1 px-3 py-1.5 rounded-xl text-[11px] border-l-4 cursor-pointer hover:opacity-90 max-w-[240px] truncate ${isMe ? "bg-blue-50 border-[var(--accent)] text-slate-700" : "bg-slate-100 border-slate-400 text-slate-700"}`}>
                                <b className="block truncate">{replied.users?.full_name}</b>
                                <span className="opacity-70 truncate">{replied.is_deleted ? "Tin nhắn đã thu hồi" : replied.content}</span>
                              </div>
                            )}
                            <div className={`px-4 py-2.5 text-sm leading-relaxed relative rounded-2xl max-w-full
                          ${msg.is_deleted ? "italic text-[var(--text-hint)] bg-slate-50 border border-dashed border-slate-200" : isMe ? "bg-[var(--accent)] text-white rounded-br-sm shadow-md" : "bg-white border border-slate-100 text-[var(--text-primary)] rounded-bl-sm shadow-sm"}`}>
                              {msg.attachment_url && !msg.is_deleted && (
                                msg.attachment_type === "image"
                                  ? <img src={msg.attachment_url} className="max-w-[240px] rounded-xl mb-2 cursor-pointer hover:opacity-90 block shadow-sm border border-black/5" onClick={() => window.open(msg.attachment_url, "_blank")} alt="img" />
                                  : <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl mb-2 text-xs font-medium border border-white/20">
                                    <FileText className="w-4 h-4" /> Tệp đính kèm
                                  </a>
                              )}
                              <div className="flex flex-col">
                                <span>{msg.content}</span>
                                <span className={`text-[10px] mt-1 self-end opacity-50 font-medium ${isMe ? "text-white" : "text-slate-500"}`}>
                                  {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              {!msg.is_deleted && msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className={`absolute -bottom-4 ${isMe ? "right-1" : "left-1"} flex gap-1 bg-white border border-slate-100 rounded-full px-2 py-0.5 shadow-md text-xs z-10 animate-in zoom-in-50`}>
                                  {Object.entries(msg.reactions).map(([em, arr]: any) => em !== "_deleted_by" && arr.length > 0 && (
                                    <span key={em} className="cursor-pointer hover:scale-125 transition-transform flex items-center gap-1" title={arr.length > 1 ? `${arr.length} người đã thả ${em}` : undefined} onClick={() => reactTo(msg, em)}>
                                      {em}{arr.length > 1 && <span className="text-[9px] font-bold text-slate-400">{arr.length}</span>}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Hover toolbar/Actions */}
                          {(hoveredMsg === msg.id || reactingTo === msg.id) && !confirmUnsend && !confirmDelete && (
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 ${isMe ? "right-full pr-2" : "left-full pl-2"} flex items-center z-40 animate-in fade-in slide-in-from-top-1 zoom-in-95 duration-200`}
                              onClick={e => e.stopPropagation()}
                              onMouseEnter={cancelEndHover} onMouseLeave={endHover}
                            >
                              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-100 shadow-2xl rounded-2xl px-2 py-1.5 whitespace-nowrap ring-1 ring-black/5">
                                {!msg.is_deleted && (
                                  <>
                                    <div className="relative">
                                      <button onClick={() => setReactingTo(reactingTo === msg.id ? null : msg.id)} className={`p-2.5 rounded-xl border border-transparent transition-all ${reactingTo === msg.id ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-inner" : "hover:bg-slate-50 text-slate-400 hover:text-emerald-500"}`} title="Thả cảm xúc"><Smile className="w-4 h-4" /></button>
                                      {reactingTo === msg.id && (
                                        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white border border-slate-100 shadow-2xl rounded-full px-4 py-2.5 flex gap-3 z-50 animate-in zoom-in-90 slide-in-from-bottom-2 duration-150 ring-4 ring-black/5">
                                          {EMOJI_OPTIONS.map(em => <button key={em} onClick={() => reactTo(msg, em)} className="text-2xl hover:scale-135 transition-transform active:scale-95 origin-bottom duration-200">{em}</button>)}
                                        </div>
                                      )}
                                    </div>
                                    <button onClick={() => { setReplyingTo(msg); setTimeout(() => inputRef.current?.focus(), 50); }} className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-blue-500 rounded-xl transition-all border border-transparent" title="Trả lời"><Reply className="w-4 h-4" /></button>
                                    {isMe && (
                                      <button
                                        onClick={() => setConfirmUnsend(msg.id)}
                                        className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-orange-500 rounded-xl transition-all border border-transparent"
                                        title="Thu hồi với mọi người"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                      </button>
                                    )}
                                  </>
                                )}
                                <button
                                  onClick={() => setConfirmDelete(msg.id)}
                                  className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all border border-transparent flex-shrink-0"
                                  title="Xóa ở phía tôi"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {isUploading && <div className="self-end px-4 py-2.5 bg-[var(--accent-tint)] rounded-2xl text-sm text-[var(--accent)] animate-pulse">Đang tải lên...</div>}
                <div ref={messagesEndRef} />
              </div>

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
            </div>

            {/* Input */}
            <div className="border-t border-[var(--border)] bg-white px-4 lg:px-6 py-4 lg:py-5 shrink-0 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${showAttach ? "bg-[var(--accent)] text-white rotate-45 shadow-lg" : "bg-slate-100 hover:bg-slate-200 text-[var(--text-secondary)]"}`}>
                    <Plus className="w-5 h-5" />
                  </button>
                  {showAttach && (
                    <div className="absolute bottom-14 left-0 bg-white border border-[var(--border)] shadow-2xl rounded-2xl p-2 w-52 flex flex-col gap-1 z-50 animate-in slide-in-from-bottom-4">
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
                  placeholder="Nhắn tin..." disabled={isUploading}
                  className="flex-1 h-12 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[var(--accent-tint)] focus:bg-white text-sm text-[var(--text-primary)] placeholder:text-[var(--text-hint)] outline-none transition-all shadow-inner" />
                <button type="submit" disabled={!newMessage.trim() || isUploading}
                  className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 hover:opacity-90 disabled:opacity-40 active:scale-95 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <MessageCircle className="w-9 h-9 text-slate-200 mb-3" />
            <p className="text-sm text-[var(--text-hint)]">Chọn một cuộc hội thoại</p>
          </div>
        )}
      </div>

      {/* ── RIGHT: Info Panel (tabbed) ── */}
      {showInfo && activeChannel && (
        <div className="fixed inset-0 lg:static lg:w-80 shrink-0 lg:border-l border-[var(--border)] flex flex-col bg-white z-[60] animate-in slide-in-from-right-8 duration-300">
          {/* Panel header */}
          <div className="h-16 lg:h-10 flex items-center justify-between px-6 lg:px-4 border-b border-[var(--border)] shrink-0">
            <span className="font-bold lg:font-semibold text-base lg:text-sm">Thông tin lớp học</span>
            <button onClick={() => setShowInfo(false)} className="w-10 h-10 lg:w-8 lg:h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[var(--text-hint)]"><X className="w-5 h-5 lg:w-4 lg:h-4" /></button>
          </div>

          {/* Tab bar */}
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
              {/* Course card */}
              <div className="flex flex-col items-center gap-2 py-4 px-4 border-b border-[var(--border)]">
                <Avatar url={activeChannel.avatar} name={activeChannel.name} size={16} />
                <p className="font-bold text-sm text-center">{activeChannel.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">GV. {activeChannel.teacher}</p>
                {members.length > 0 && (
                  <span className="mt-1 px-3 py-0.5 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold">{members.length} thành viên</span>
                )}
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
                        <p className="text-sm font-medium truncate">
                          {m.full_name} {m.id === currentUser?.id && <span className="text-[var(--text-hint)] font-normal">(Bạn)</span>}
                        </p>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${m.role === "teacher" ? "text-[var(--accent)]" : "text-[var(--text-hint)]"}`}>
                          {m.role === "teacher" ? "Giảng viên" : "Học viên"}
                        </p>
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
                  <input ref={searchInputRef} value={msgSearch} onChange={e => setMsgSearch(e.target.value)}
                    placeholder="Tìm trong cuộc trò chuyện..."
                    className="w-full h-9 pl-9 pr-3 rounded-full bg-slate-100 text-sm outline-none focus:bg-slate-50 transition-colors" />
                  {msgSearch && <button onClick={() => setMsgSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-hint)] hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>}
                </div>
                {msgSearch && <p className="text-[11px] text-[var(--text-hint)] mt-1.5 px-1">{filteredMessages.length} kết quả</p>}
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {!msgSearch ? (
                  <p className="text-center text-xs text-[var(--text-hint)] mt-8">Nhập từ khóa để tìm kiếm tin nhắn.</p>
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
