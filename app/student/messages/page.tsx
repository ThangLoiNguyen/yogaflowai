"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Search, Hash, Send, Reply, Smile, Trash2, Plus, Camera, Image as ImageIcon, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function StudentMessagesPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [reactingTo, setReactingTo] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Hide popovers when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setReactingTo(null);
      setShowAttachMenu(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id);
      
      const channelLabel = `room_${activeChannel.id}`;
      const subscription = supabase
        .channel(channelLabel)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${activeChannel.id}` },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              const { data: author } = await supabase.from("users").select("full_name, avatar_url, id").eq("id", payload.new.user_id).single();
              const enrichedMessage = { ...payload.new, users: author };
              setMessages(prev => [...prev, enrichedMessage]);
            } else if (payload.eventType === 'UPDATE') {
              setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
            } else if (payload.eventType === 'DELETE') {
              setMessages(prev => prev.filter(m => m.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChannels = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUser(user);

    const { data } = await supabase
      .from("bookings")
      .select(`
        class_sessions!inner (
          courses!inner (
            id,
            title,
            users!teacher_id (id, full_name, avatar_url)
          )
        )
      `)
      .eq("student_id", user.id);

    const uniqueMap = new Map();
    if (data) {
      data.forEach((b: any) => {
        const c = b.class_sessions?.courses;
        if (c && c.id && !uniqueMap.has(c.id)) {
          uniqueMap.set(c.id, {
            id: c.id,
            name: c.title || "Khóa học Yoga",
            teacher: c.users?.full_name || "Giảng viên",
            avatar: c.users?.avatar_url
          });
        }
      });
    }

    const channelList = Array.from(uniqueMap.values());
    setChannels(channelList);
    if (channelList.length > 0) setActiveChannel(channelList[0]);
    setLoading(false);
  };

  const fetchMessages = async (channelId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*, users(id, full_name, avatar_url)")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });
    
    if (data) setMessages(data);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChannel || !currentUser) return;

    const content = newMessage.trim();
    const replyId = replyingTo?.id || null;
    
    setNewMessage("");
    setReplyingTo(null);

    const { error } = await supabase.from("chat_messages").insert({
      channel_id: activeChannel.id,
      user_id: currentUser.id,
      content: content,
      reply_to_id: replyId
    });

    if (error) {
      toast.error("Lỗi gửi tin nhắn! Hãy chắc chắn bạn đã cập nhật file create_chat.sql trong Supabase để thêm cột mới.");
      console.error(error);
    }
  };

  const unsendMessage = async (messageId: string) => {
    await supabase.from("chat_messages").update({ is_deleted: true, content: "Tin nhắn đã bị thu hồi", attachment_url: null }).eq("id", messageId);
  };

  const reactToMessage = async (message: any, emoji: string) => {
    let currentReactions = message.reactions || {};
    let usersForEmoji = currentReactions[emoji] || [];
    
    if (usersForEmoji.includes(currentUser.id)) {
      usersForEmoji = usersForEmoji.filter((u: string) => u !== currentUser.id);
    } else {
      usersForEmoji.push(currentUser.id);
    }
    
    if (usersForEmoji.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = usersForEmoji;
    }
    
    const { error } = await supabase.from("chat_messages").update({ reactions: currentReactions }).eq("id", message.id);
    if (error) console.error(error);
    setReactingTo(null);
  };

  const handleReplyClick = (msg: any) => {
    setReplyingTo(msg);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Convert File to Base64 for instant upload without Storage Bucket
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;

     if (file.size > 5 * 1024 * 1024) {
       toast.error("File quá lớn! Vui lòng chọn ảnh/file dưới 5MB.");
       return;
     }

     setIsUploading(true);
     const reader = new FileReader();
     reader.onload = async (event) => {
       const base64Str = event.target?.result as string;
       
       const isImage = file.type.startsWith("image/");
       const replyId = replyingTo?.id || null;

       const { error } = await supabase.from("chat_messages").insert({
          channel_id: activeChannel.id,
          user_id: currentUser.id,
          content: isImage ? "Đã gửi một ảnh" : `Đã gửi file: ${file.name}`,
          attachment_url: base64Str,
          attachment_type: isImage ? "image" : "file",
          reply_to_id: replyId
       });

       setIsUploading(false);
       setReplyingTo(null);
       if (fileInputRef.current) fileInputRef.current.value = "";
       
       if (error) {
          toast.error("Không thể tải lên. Hãy thử lại!");
       }
     };
     reader.readAsDataURL(file);
  };

  const triggerUpload = (type: string) => {
     if (type === 'file' && fileInputRef.current) {
         fileInputRef.current.accept = "*/*";
         fileInputRef.current.removeAttribute("capture");
     } else if (type === 'camera' && fileInputRef.current) {
         fileInputRef.current.accept = "image/*";
         fileInputRef.current.setAttribute("capture", "environment");
     } else if (type === 'image' && fileInputRef.current) {
         fileInputRef.current.accept = "image/*";
         fileInputRef.current.removeAttribute("capture");
     }
     fileInputRef.current?.click();
     setShowAttachMenu(false);
  };

  const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-[var(--r-xl)] border border-[var(--border)] overflow-hidden shadow-sm max-w-6xl mx-auto cursor-default">
      {/* Sidebar: Channel List */}
      <div className="w-1/3 md:w-80 border-r border-[var(--border)] flex flex-col bg-slate-50/50">
        <div className="p-4 md:p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold mb-4 font-display">Thảo luận</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
            <Input placeholder="Tìm lớp, giáo viên..." className="h-10 pl-9 rounded-full bg-white shadow-sm text-sm" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-[var(--text-hint)] mb-3 px-2">Lớp học của bạn</div>
          {loading ? (
             [1,2,3].map(n => <div key={n} className="h-14 bg-slate-100 rounded-[var(--r-md)] animate-pulse" />)
          ) : channels.length > 0 ? (
             channels.map(ch => (
               <button
                 key={ch.id}
                 onClick={() => setActiveChannel(ch)}
                 className={`w-full flex items-center gap-3 p-3 rounded-[var(--r-md)] transition-all ${activeChannel?.id === ch.id ? 'bg-white shadow-sm border border-[var(--border)] relative' : 'hover:bg-slate-100 border border-transparent'}`}
               >
                 {activeChannel?.id === ch.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent)] rounded-r-full" />}
                 <div className="w-10 h-10 rounded-full bg-[var(--accent-tint)] flex items-center justify-center shrink-0 text-[var(--accent)]">
                    <Hash className="w-5 h-5" />
                 </div>
                 <div className="text-left flex-1 min-w-0">
                   <div className="font-bold text-sm text-[var(--text-primary)] truncate">{ch.name}</div>
                   <div className="text-xs text-[var(--text-secondary)] truncate">Cùng GV. {ch.teacher}</div>
                 </div>
               </button>
             ))
          ) : (
             <div className="text-center p-6 text-[var(--text-hint)] text-sm">Chưa có kênh thảo luận nào.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {activeChannel ? (
          <>
            <div className="p-4 md:p-6 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-white z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--accent-tint)] flex items-center justify-center text-[var(--accent)]">
                    <Hash className="w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-base md:text-lg leading-none mb-1">{activeChannel.name}</h3>
                    <div className="text-xs text-[var(--text-secondary)]">Kênh chung • GV. {activeChannel.teacher}</div>
                 </div>
              </div>
              <Button onClick={() => toast.info(`Lớp có khoảng 20-25 học viên cùng tham dự khóa học ${activeChannel.name}.`)} variant="outline" className="hidden md:flex h-9 rounded-full border-[var(--border)] text-xs">
                 Tóm tắt thành viên
              </Button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
               {messages.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-60">
                    <MessageCircle className="w-12 h-12 text-[var(--text-hint)] mb-4" />
                    <h4 className="text-[var(--text-primary)] font-bold text-base mb-2">Chưa có tin nhắn nào</h4>
                    <p className="text-[var(--text-secondary)] text-xs text-center max-w-[250px]">
                      Gửi lời chào đầu tiên tới Giáo viên và các bạn học trong lớp nhé!
                    </p>
                 </div>
               ) : (
                 messages.map((msg, i) => {
                   const isMe = msg.users?.id === currentUser?.id;
                   const repliedMsg = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;
                   
                   return (
                     <div 
                       id={`msg-${msg.id}`}
                       key={msg.id} 
                       className={`flex gap-3 max-w-[85%] relative group ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                       onMouseEnter={() => setHoveredMessage(msg.id)}
                       onMouseLeave={() => setHoveredMessage(null)}
                     >
                       <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden mt-auto mb-2">
                         {msg.users?.avatar_url ? (
                           <img src={msg.users.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                         ) : (
                           <div className="w-full h-full bg-[var(--text-primary)] text-white flex items-center justify-center text-[10px] font-bold">
                             {msg.users?.full_name?.charAt(0) || "U"}
                           </div>
                         )}
                       </div>
                       <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                         <span className="text-[10px] text-[var(--text-muted)] mb-1 mx-1.5 font-medium flex items-center gap-2">
                            {isMe ? 'Bạn' : msg.users?.full_name || 'Anonymous'}
                            {msg.is_deleted && <span className="opacity-50">(đã thu hồi)</span>}
                         </span>

                         {/* Quoted Message */}
                         {repliedMsg && (
                            <div 
                              onClick={() => document.getElementById(`msg-${repliedMsg.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                              className={`mb-1 px-3 py-1.5 rounded-lg text-xs opacity-80 border-l-2 border-[var(--accent)] cursor-pointer hover:opacity-100 transition-opacity ${isMe ? 'bg-[var(--accent-tint)] text-slate-800' : 'bg-slate-200 text-slate-700'}`}
                            >
                               <div className="font-bold mb-0.5">{repliedMsg.users?.full_name || 'Anonymous'}</div>
                               <div className="truncate max-w-[200px]">{repliedMsg.is_deleted ? 'Tin nhắn đã thu hồi' : repliedMsg.content}</div>
                            </div>
                         )}

                         <div className={`px-4 py-2.5 rounded-2xl text-sm relative ${msg.is_deleted ? 'bg-transparent border border-[var(--border)] text-[var(--text-hint)] italic' : isMe ? 'bg-[var(--accent)] text-white rounded-tr-sm' : 'bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm'}`}>
                            {msg.attachment_url && !msg.is_deleted && (
                               msg.attachment_type === 'image' ? (
                                 <img src={msg.attachment_url} className="max-w-[240px] md:max-w-[300px] rounded-lg mb-2 object-cover border border-[var(--border)] cursor-pointer hover:opacity-90 transition-opacity" alt="attachment" onClick={() => window.open(msg.attachment_url, '_blank')} />
                               ) : (
                                 <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 max-w-[240px] bg-white/20 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-bold truncate mb-2 hover:bg-white/40">
                                    <FileText className="w-5 h-5" /> File đính kèm
                                 </a>
                               )
                            )}
                            {msg.content}
                            
                            {/* Reactions Render */}
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} flex gap-1 bg-white border border-[var(--border)] rounded-full px-1.5 py-0.5 shadow-sm text-xs z-10`}>
                                   {Object.entries(msg.reactions).map(([emoji, usersArr]: [string, any]) => (
                                     usersArr.length > 0 && <span key={emoji} className="flex items-center gap-1 cursor-pointer" onClick={() => reactToMessage(msg, emoji)}>{emoji} <span className="text-[9px] opacity-70 font-bold">{usersArr.length > 1 ? usersArr.length : ''}</span></span>
                                   ))}
                                </div>
                            )}
                         </div>
                       </div>
                       
                       {/* Messenger-like Hover Action Bar & Popovers */}
                       {!msg.is_deleted && (hoveredMessage === msg.id || reactingTo === msg.id) && (
                          <div className={`absolute top-4 ${isMe ? '-left-20' : '-right-20'} flex items-center gap-0.5 bg-white border border-[var(--border)] shadow-md rounded-full px-1.5 py-1 z-20`} onClick={(e) => e.stopPropagation()}>
                             {/* Emoji Picker Popover Trigger */}
                             <div className="relative">
                               <button onClick={() => setReactingTo(reactingTo === msg.id ? null : msg.id)} className={`p-1.5 rounded-full transition-colors text-[var(--text-secondary)] ${reactingTo === msg.id ? 'bg-slate-100 text-[var(--accent)]' : 'hover:bg-slate-50'}`}><Smile className="w-3.5 h-3.5" /></button>
                               {reactingTo === msg.id && (
                                   <div className={`absolute -top-12 ${isMe ? '-right-2' : '-left-2'} bg-white border border-[var(--border)] shadow-xl rounded-full px-2 py-1.5 flex gap-1 animate-in fade-in zoom-in duration-200`}>
                                     {EMOJI_OPTIONS.map(em => (
                                       <button key={em} onClick={() => reactToMessage(msg, em)} className="hover:scale-125 transition-transform text-lg">{em}</button>
                                     ))}
                                   </div>
                               )}
                             </div>
                             
                             <button onClick={() => handleReplyClick(msg)} className="p-1.5 hover:bg-slate-50 rounded-full transition-colors text-[var(--text-secondary)]"><Reply className="w-3.5 h-3.5" /></button>
                             {isMe && <button onClick={() => unsendMessage(msg.id)} className="p-1.5 hover:bg-rose-50 rounded-full transition-colors text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
                          </div>
                       )}
                     </div>
                   );
                 })
               )}
               {isUploading && (
                 <div className="flex gap-3 max-w-[85%] self-end flex-row-reverse animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                    <div className="px-4 py-2.5 rounded-2xl bg-[var(--accent-tint)] text-[var(--accent)] text-sm italic font-bold">
                       Đang xử lý ảnh tải lên...
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>
            
            {/* Input Form with Reply Banner */}
            <div className="bg-white border-t border-[var(--border)] shrink-0 px-4 md:px-6 py-4">
               {replyingTo && (
                  <div className="flex items-center justify-between bg-slate-100 rounded-t-xl px-4 py-2 border-b border-[var(--border)] max-w-3xl mx-auto -mt-4 mb-2 relative">
                     <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1"><Reply className="w-3 h-3"/> Đang trả lời {replyingTo.users?.full_name || 'bạn'}</span>
                        <span className="text-xs text-[var(--text-secondary)] truncate w-full max-w-[300px]">{replyingTo.content}</span>
                     </div>
                     <button onClick={() => setReplyingTo(null)} className="p-1 text-[var(--text-hint)] hover:text-rose-500"><X className="w-4 h-4"/></button>
                  </div>
               )}
               
               <form onSubmit={sendMessage}>
                 <div className="flex items-center gap-2 md:gap-3 max-w-3xl mx-auto relative">
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

                    {/* Attachment Add Button & Menu */}
                    <div className="relative">
                       <Button 
                         type="button" 
                         variant="ghost" 
                         onClick={(e) => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); setReactingTo(null); }}
                         className={`w-10 h-10 rounded-full shrink-0 p-0 transition-all ${showAttachMenu ? 'bg-[var(--accent)] text-white rotate-45' : 'text-[var(--text-secondary)] hover:bg-slate-100 hover:text-[var(--text-primary)]'}`}
                       >
                          <Plus className="w-5 h-5" />
                       </Button>
                       
                       {/* Dropdown Options */}
                       {showAttachMenu && (
                         <div className="absolute bottom-12 left-0 bg-white border border-[var(--border)] shadow-xl rounded-2xl p-2 w-48 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 z-50">
                           <button type="button" onClick={() => triggerUpload('camera')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] font-medium hover:bg-slate-50 rounded-xl transition-colors">
                              <Camera className="w-4 h-4 text-[var(--text-hint)]" /> Máy ảnh
                           </button>
                           <button type="button" onClick={() => triggerUpload('image')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] font-medium hover:bg-slate-50 rounded-xl transition-colors">
                              <ImageIcon className="w-4 h-4 text-[var(--text-hint)]" /> Thư viện ảnh
                           </button>
                           <button type="button" onClick={() => triggerUpload('file')} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] font-medium hover:bg-slate-50 rounded-xl transition-colors">
                              <FileText className="w-4 h-4 text-[var(--text-hint)]" /> Tệp tài liệu
                           </button>
                         </div>
                       )}
                    </div>

                    <Input 
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Nhắn tin vào kênh...`} 
                      disabled={isUploading}
                      className={`flex-1 h-12 border-[var(--border-medium)] shadow-sm bg-slate-50 focus-visible:ring-1 focus-visible:ring-[var(--accent)] px-4 md:px-5 ${replyingTo ? 'rounded-b-xl rounded-t-sm' : 'rounded-full'}`} 
                    />
                    <Button type="submit" disabled={!newMessage.trim() || isUploading} className="w-12 h-12 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] p-0 shadow-sm shrink-0 flex items-center justify-center transition-all disabled:opacity-50">
                       <Send className="w-5 h-5 -ml-1 flex-1 text-center" />
                    </Button>
                 </div>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
             <MessageCircle className="w-16 h-16 text-[var(--border)] mb-4" />
             <div className="text-[var(--text-hint)] text-sm">Chọn một cuộc hội thoại để bắt đầu</div>
          </div>
        )}
      </div>
    </div>
  );
}
