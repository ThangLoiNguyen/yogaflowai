"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle, Search, Hash, Send, Reply, Smile, Trash2,
  Plus, Camera, Image as ImageIcon, FileText, X, Users,
  ChevronLeft, Info, Phone, Video
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

type Channel = { id: string; name: string; teacher: string; avatar?: string };
type Member  = { id: string; full_name: string; avatar_url?: string; role: "teacher" | "student" };
type Msg     = any;

/* ───────── helpers ───────── */
function Avatar({ url, name, size = 10 }: { url?: string; name?: string; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full shrink-0 overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-bold text-white`;
  return url
    ? <div className={cls}><img src={url} className="w-full h-full object-cover" alt={name} /></div>
    : <div className={cls} style={{ background: "var(--accent)" }}>{name?.charAt(0) || "?"}</div>;
}

/* ───────── main component ───────── */
export default function StudentMessagesPage() {
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

  // Right panel: "members" | "search" | null
  const [rightPanel, setRightPanel] = useState<"members" | "search" | null>(null);
  const [msgSearch,  setMsgSearch]  = useState("");
  const [chSearch,   setChSearch]   = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* global click → close popovers */
  useEffect(() => {
    const h = () => { setReactingTo(null); setShowAttach(false); };
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);

  /* scroll to bottom */
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  /* focus search input when panel opens */
  useEffect(() => {
    if (rightPanel === "search") setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [rightPanel]);

  /* ── fetch channels ── */
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

  /* ── realtime messages ── */
  useEffect(() => {
    if (!activeChannel) return;
    fetchMessages(activeChannel.id);

    const sub = supabase
      .channel(`msgs_${activeChannel.id}`)
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

  /* ── fetch members when panel opens ── */
  useEffect(() => {
    if (rightPanel === "members" && activeChannel) fetchMembers(activeChannel.id);
  }, [rightPanel, activeChannel]);

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
      if (users) {
        setMembers(users.map((u: any) => ({ ...u, role: u.id === course?.teacher_id ? "teacher" : "student" })));
      }
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

  const unsend = async (id: string) =>
    supabase.from("chat_messages").update({ is_deleted: true, content: "Tin nhắn đã bị thu hồi", attachment_url: null }).eq("id", id);

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

  const togglePanel = (panel: "members" | "search") =>
    setRightPanel(p => p === panel ? null : panel);

  /* ── filtered messages for search ── */
  const filteredMessages = msgSearch.trim()
    ? messages.filter(m => m.content?.toLowerCase().includes(msgSearch.toLowerCase()))
    : messages;

  const filteredChannels = chSearch.trim()
    ? channels.filter(c => c.name.toLowerCase().includes(chSearch.toLowerCase()) || c.teacher.toLowerCase().includes(chSearch.toLowerCase()))
    : channels;

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm max-w-7xl mx-auto">

      {/* ═══ LEFT SIDEBAR: Conversations ═══ */}
      <div className="w-80 shrink-0 border-r border-[var(--border)] flex flex-col bg-[var(--bg-base)]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold mb-4">Thảo luận lớp học</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
            <Input
              value={chSearch}
              onChange={e => setChSearch(e.target.value)}
              placeholder="Tìm đoạn chat..."
              className="h-10 pl-9 rounded-full bg-white border-[var(--border-medium)] text-sm"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? [1, 2, 3].map(n => <div key={n} className="h-16 mx-3 my-1 bg-slate-100 rounded-xl animate-pulse" />) :
            filteredChannels.length > 0 ? filteredChannels.map(ch => {
              const isActive = activeChannel?.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => { setActiveChannel(ch); setMsgSearch(""); setRightPanel(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 mx-0 transition-colors ${isActive ? "bg-[var(--accent-tint)]" : "hover:bg-slate-100"}`}
                >
                  <div className="relative">
                    <Avatar url={ch.avatar} name={ch.name} size={12} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className={`font-semibold text-sm truncate ${isActive ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>{ch.name}</div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">GV. {ch.teacher}</div>
                  </div>
                </button>
              );
            }) : <p className="text-center text-sm text-[var(--text-hint)] p-6">Không tìm thấy.</p>
          }
        </div>
      </div>

      {/* ═══ MAIN CHAT AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeChannel ? (
          <>
            {/* Chat Header – Messenger style */}
            <div className="h-16 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar url={activeChannel.avatar} name={activeChannel.name} size={10} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">{activeChannel.name}</div>
                  <div className="text-xs text-green-500 font-medium">Đang hoạt động</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Search in chat */}
                <button
                  onClick={() => togglePanel("search")}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${rightPanel === "search" ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "hover:bg-slate-100 text-[var(--text-secondary)]"}`}
                  title="Tìm kiếm tin nhắn"
                >
                  <Search className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </button>
                {/* Members */}
                <button
                  onClick={() => togglePanel("members")}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${rightPanel === "members" ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "hover:bg-slate-100 text-[var(--text-secondary)]"}`}
                  title="Xem thành viên"
                >
                  <Users className="w-[18px] h-[18px]" />
                </button>
                {/* Info */}
                <button
                  onClick={() => togglePanel("members")}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${rightPanel === "members" ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "hover:bg-slate-100 text-[var(--text-secondary)]"}`}
                  title="Thông tin cuộc trò chuyện"
                >
                  <Info className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Search bar strip (visible only when search panel active) */}
            {rightPanel === "search" && (
              <div className="border-b border-[var(--border)] px-4 py-2.5 bg-slate-50 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                <Search className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <input
                  ref={searchInputRef}
                  value={msgSearch}
                  onChange={e => setMsgSearch(e.target.value)}
                  placeholder="Tìm kiếm trong đoạn trò chuyện..."
                  className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-hint)]"
                />
                {msgSearch && (
                  <button onClick={() => setMsgSearch("")} className="text-[var(--text-hint)] hover:text-rose-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[11px] text-[var(--text-hint)] shrink-0">
                  {filteredMessages.length} kết quả
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 bg-white">
              {filteredMessages.length === 0 ? (
                <div className="m-auto text-center opacity-50">
                  <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-hint)]">
                    {msgSearch ? "Không tìm thấy tin nhắn phù hợp." : "Gửi lời chào đầu tiên nhé!"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg: Msg) => {
                  const isMe = msg.users?.id === currentUser?.id;
                  const replied = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;
                  const isHighlighted = msgSearch && msg.content?.toLowerCase().includes(msgSearch.toLowerCase());
                  return (
                    <div
                      key={msg.id}
                      id={`msg-${msg.id}`}
                      className={`flex gap-2 max-w-[75%] relative group ${isMe ? "self-end flex-row-reverse" : "self-start"} ${isHighlighted ? "ring-2 ring-yellow-300 ring-offset-2 rounded-2xl" : ""}`}
                      onMouseEnter={() => setHoveredMsg(msg.id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                    >
                      {/* Avatar (only for others) */}
                      {!isMe && (
                        <div className="mt-auto mb-1 shrink-0">
                          <Avatar url={msg.users?.avatar_url} name={msg.users?.full_name} size={8} />
                        </div>
                      )}

                      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {/* Sender name */}
                        {!isMe && (
                          <span className="text-[11px] text-[var(--text-hint)] ml-1 mb-0.5 font-medium">{msg.users?.full_name}</span>
                        )}

                        {/* Quote */}
                        {replied && (
                          <div
                            onClick={() => document.getElementById(`msg-${replied.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                            className={`mb-1 px-3 py-1.5 rounded-xl text-[11px] border-l-4 cursor-pointer hover:opacity-90 transition-opacity max-w-[260px] ${isMe ? "bg-blue-50 border-[var(--accent)] text-slate-700" : "bg-slate-100 border-slate-400 text-slate-700"}`}
                          >
                            <div className="font-bold truncate">{replied.users?.full_name}</div>
                            <div className="truncate opacity-70">{replied.is_deleted ? "Tin nhắn đã thu hồi" : replied.content}</div>
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`px-4 py-2.5 text-sm leading-relaxed relative rounded-2xl
                          ${msg.is_deleted ? "italic text-[var(--text-hint)] bg-slate-50 border border-dashed border-slate-200"
                            : isMe ? "bg-[var(--accent)] text-white rounded-br-sm" : "bg-slate-100 text-[var(--text-primary)] rounded-bl-sm"}`}
                        >
                          {/* Attachment */}
                          {msg.attachment_url && !msg.is_deleted && (
                            msg.attachment_type === "image"
                              ? <img src={msg.attachment_url} className="max-w-[240px] rounded-xl mb-2 cursor-pointer hover:opacity-90" alt="img" onClick={() => window.open(msg.attachment_url, "_blank")} />
                              : <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl border border-white/20 mb-2 font-medium text-xs">
                                  <FileText className="w-4 h-4" /> Tệp đính kèm
                                </a>
                          )}
                          {msg.content}

                          {/* Reactions */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className={`absolute -bottom-4 ${isMe ? "right-1" : "left-1"} flex gap-0.5 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow text-xs z-10`}>
                              {Object.entries(msg.reactions).map(([em, arr]: any) =>
                                arr.length > 0 && (
                                  <span key={em} className="cursor-pointer hover:scale-110 transition-transform flex items-center gap-0.5" onClick={() => reactTo(msg, em)}>
                                    {em}{arr.length > 1 && <span className="text-[9px] text-slate-500">{arr.length}</span>}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Hover Actions (Messenger-style floating bar) */}
                      {!msg.is_deleted && (hoveredMsg === msg.id || reactingTo === msg.id) && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 ${isMe ? "-left-28" : "-right-28"} flex items-center gap-0.5 bg-white border border-slate-200 shadow-lg rounded-full px-2 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100`}
                          onClick={e => e.stopPropagation()}
                        >
                          {/* Emoji picker */}
                          <div className="relative">
                            <button
                              onClick={() => setReactingTo(reactingTo === msg.id ? null : msg.id)}
                              className={`p-1.5 rounded-full transition-colors ${reactingTo === msg.id ? "bg-[var(--accent-tint)] text-[var(--accent)]" : "hover:bg-slate-100 text-[var(--text-secondary)]"}`}
                            >
                              <Smile className="w-4 h-4" />
                            </button>
                            {reactingTo === msg.id && (
                              <div className={`absolute bottom-10 ${isMe ? "right-0" : "left-0"} bg-white border border-slate-200 shadow-xl rounded-full px-2 py-1.5 flex gap-1.5 animate-in zoom-in-95 z-40`}>
                                {EMOJI_OPTIONS.map(em => (
                                  <button key={em} onClick={() => reactTo(msg, em)} className="text-lg hover:scale-125 transition-transform">{em}</button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button onClick={() => { setReplyingTo(msg); setTimeout(() => inputRef.current?.focus(), 50); }} className="p-1.5 hover:bg-slate-100 rounded-full text-[var(--text-secondary)]">
                            <Reply className="w-4 h-4" />
                          </button>
                          {isMe && (
                            <button onClick={() => unsend(msg.id)} className="p-1.5 hover:bg-rose-50 rounded-full text-rose-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {isUploading && (
                <div className="self-end flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-tint)] rounded-2xl text-sm text-[var(--accent)] animate-pulse">
                  Đang tải lên...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[var(--border)] bg-white px-4 py-3 shrink-0">
              {/* Reply preview */}
              {replyingTo && (
                <div className="flex items-center justify-between bg-[var(--accent-tint)] rounded-xl px-3 py-2 mb-2 border-l-4 border-[var(--accent)]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--accent)]">
                      <Reply className="w-3 h-3" /> Đang trả lời {replyingTo.users?.full_name}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate max-w-[300px]">{replyingTo.content}</div>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 text-[var(--text-hint)] hover:text-rose-500 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

                {/* + attachment */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setShowAttach(p => !p); setReactingTo(null); }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showAttach ? "bg-[var(--accent)] text-white rotate-45" : "bg-slate-100 hover:bg-slate-200 text-[var(--text-secondary)]"}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {showAttach && (
                    <div className="absolute bottom-12 left-0 bg-white border border-[var(--border)] shadow-xl rounded-2xl p-2 w-44 flex flex-col gap-0.5 z-50 animate-in slide-in-from-bottom-2">
                      {[
                        { label: "Máy ảnh", icon: Camera, type: "camera" },
                        { label: "Thư viện ảnh", icon: ImageIcon, type: "image" },
                        { label: "Tệp tài liệu", icon: FileText, type: "file" },
                      ].map(({ label, icon: Icon, type }) => (
                        <button key={type} type="button" onClick={() => doUpload(type)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-slate-50 rounded-xl transition-colors text-left">
                          <Icon className="w-4 h-4 text-[var(--text-hint)]" /> {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  ref={inputRef}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Nhắn tin..."
                  disabled={isUploading}
                  className="flex-1 h-10 px-4 rounded-full bg-slate-100 border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-hint)] focus:bg-slate-50 transition-colors"
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim() || isUploading}
                  className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 opacity-50">
            <MessageCircle className="w-16 h-16 text-slate-200" />
            <p className="text-[var(--text-hint)] text-sm">Chọn một cuộc hội thoại để bắt đầu</p>
          </div>
        )}
      </div>

      {/* ═══ RIGHT PANEL: Members or Search results ═══ */}
      {rightPanel && activeChannel && (
        <div className="w-72 shrink-0 border-l border-[var(--border)] flex flex-col bg-[var(--bg-base)] animate-in slide-in-from-right-4 duration-200">
          {rightPanel === "members" ? (
            <>
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-sm">Thành viên lớp học</h3>
                <button onClick={() => setRightPanel(null)} className="p-1.5 hover:bg-slate-200 rounded-full text-[var(--text-hint)]"><X className="w-4 h-4" /></button>
              </div>

              {/* Course info */}
              <div className="p-5 border-b border-[var(--border)] flex flex-col items-center gap-3">
                <Avatar url={activeChannel.avatar} name={activeChannel.name} size={16} />
                <div className="text-center">
                  <div className="font-bold text-sm text-[var(--text-primary)]">{activeChannel.name}</div>
                  <div className="text-xs text-[var(--text-secondary)]">GV. {activeChannel.teacher}</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[11px] text-green-700 font-medium">{members.length} thành viên</span>
                </div>
              </div>

              {/* Member list */}
              {members.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center opacity-50">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-[var(--text-hint)]">Đang tải danh sách...</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
                  {/* Teachers first */}
                  {[...members].sort(a => a.role === "teacher" ? -1 : 1).map(m => (
                    <div key={m.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-100 transition-colors group">
                      <div className="relative">
                        <Avatar url={m.avatar_url} name={m.full_name} size={9} />
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {m.full_name} {m.id === currentUser?.id && <span className="text-[var(--text-hint)]">(Bạn)</span>}
                        </div>
                        <div className={`text-[10px] uppercase font-bold tracking-wide ${m.role === "teacher" ? "text-[var(--accent)]" : "text-[var(--text-hint)]"}`}>
                          {m.role === "teacher" ? "Giảng viên" : "Học viên"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Search results panel */
            <>
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold text-sm">Kết quả tìm kiếm</h3>
                <button onClick={() => { setRightPanel(null); setMsgSearch(""); }} className="p-1.5 hover:bg-slate-200 rounded-full text-[var(--text-hint)]"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredMessages.length === 0 ? (
                  <p className="text-center text-xs text-[var(--text-hint)] mt-6">{msgSearch ? "Không tìm thấy." : "Nhập từ khóa để tìm kiếm."}</p>
                ) : filteredMessages.map((msg: Msg) => (
                  <button
                    key={msg.id}
                    onClick={() => document.getElementById(`msg-${msg.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="w-full text-left flex items-start gap-2 p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Avatar url={msg.users?.avatar_url} name={msg.users?.full_name} size={8} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[var(--text-primary)] truncate">{msg.users?.full_name}</div>
                      <div className="text-xs text-[var(--text-secondary)] truncate">{msg.content}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
