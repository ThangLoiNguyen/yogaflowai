"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Search, Hash, Send, Users, Reply, Smile, Trash2, Paperclip, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function TeacherMessagesPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id);
      
      const channelLabel = `room_teacher_${activeChannel.id}`;
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

    // Fetch courses taught by this teacher
    const { data } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        status,
        class_sessions(
          bookings(id)
        )
      `)
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const channelList = data.map((c: any) => {
        // Count approximate total bookings across all sessions for this course
        let count = 0;
        if (c.class_sessions) {
          c.class_sessions.forEach((s: any) => {
             count += (s.bookings?.length || 0);
          });
        }
        return {
          id: c.id,
          name: c.title || "Khóa học Yoga",
          studentCount: count,
          status: c.status
        };
      });
      setChannels(channelList);
      if (channelList.length > 0) setActiveChannel(channelList[0]);
    }
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
    await supabase.from("chat_messages").update({ is_deleted: true, content: "Tin nhắn đã bị thu hồi" }).eq("id", messageId);
  };

  const reactToMessage = async (message: any, emoji: string) => {
    let currentReactions = message.reactions || {};
    let usersForEmoji = currentReactions[emoji] || [];
    
    // Toggle logic
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
  };

  const triggerMockUpload = () => {
    toast.info("Tính năng gửi File/Ảnh đang cắm API Storage...");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-[var(--r-xl)] border border-[var(--border)] overflow-hidden shadow-sm max-w-6xl mx-auto">
      {/* Sidebar: Channel List */}
      <div className="w-1/3 md:w-80 border-r border-[var(--border)] flex flex-col bg-slate-50/50">
        <div className="p-4 md:p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold mb-4 font-display">Thảo luận Lớp</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
            <Input placeholder="Tìm tên lớp học..." className="h-10 pl-9 rounded-full bg-white shadow-sm text-sm" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-[var(--text-hint)] mb-3 px-2">Kênh lớp học</div>
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
                   <div className="text-xs text-[var(--text-secondary)] truncate flex items-center gap-1">
                      <Users className="w-3 h-3" /> {ch.studentCount} Học viên
                   </div>
                 </div>
               </button>
             ))
          ) : (
             <div className="text-center p-6 text-[var(--text-hint)] text-sm">Bạn chưa có lớp học nào để thảo luận.</div>
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
                    <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                       Kênh lớp chung <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {activeChannel.studentCount} thành viên
                    </div>
                 </div>
              </div>
              <Button onClick={() => toast.info(`Lớp có khoảng ${activeChannel.studentCount} học viên. Tính năng quản lý chi tiết học viên đang được phát triển.`)} variant="outline" className="hidden md:flex h-9 rounded-full border-[var(--border)] text-xs">
                 Tóm tắt thành viên
              </Button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
               {messages.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-60">
                    <MessageCircle className="w-12 h-12 text-[var(--text-hint)] mb-4" />
                    <h4 className="text-[var(--text-primary)] font-bold text-base mb-2">Thông báo lớp học</h4>
                    <p className="text-[var(--text-secondary)] text-xs text-center max-w-[300px]">
                      Tạo thông báo, nhận phản hồi, và theo dõi quá trình tiến bộ của lớp qua group chat.
                    </p>
                 </div>
               ) : (
                 messages.map((msg, i) => {
                   const isMe = msg.users?.id === currentUser?.id;
                   const repliedMsg = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;
                   
                   return (
                     <div 
                       key={msg.id} 
                       className={`flex gap-3 max-w-[85%] relative group ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                       onMouseEnter={() => setHoveredMessage(msg.id)}
                       onMouseLeave={() => setHoveredMessage(null)}
                     >
                       <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
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
                            {!isMe && <span className="text-[10px] font-bold bg-[var(--bg-muted)] tracking-widest uppercase px-1.5 py-0.5 rounded shadow-sm">Học viên</span>}
                            {isMe ? 'Bạn' : msg.users?.full_name || 'Anonymous'}
                            {msg.is_deleted && <span className="opacity-50">(đã thu hồi)</span>}
                         </span>
                         
                         {/* Quoted Message */}
                         {repliedMsg && (
                            <div className={`mb-1 px-3 py-1.5 rounded-lg text-xs opacity-80 border-l-2 border-[var(--accent)] ${isMe ? 'bg-[var(--accent-tint)] text-slate-800' : 'bg-slate-200 text-slate-700'}`}>
                               <div className="font-bold mb-0.5">{repliedMsg.users?.full_name || 'Anonymous'}</div>
                               <div className="truncate max-w-[200px]">{repliedMsg.is_deleted ? 'Tin nhắn đã thu hồi' : repliedMsg.content}</div>
                            </div>
                         )}

                         <div className={`px-4 py-2.5 rounded-2xl text-sm relative ${msg.is_deleted ? 'bg-transparent border border-[var(--border)] text-[var(--text-hint)] italic' : isMe ? 'bg-[var(--accent)] text-white rounded-tr-sm' : 'bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm'}`}>
                            {msg.attachment_url && !msg.is_deleted && (
                                <img src={msg.attachment_url} className="max-w-[200px] rounded-lg mb-2 object-cover border border-[var(--border)]" alt="attachment" />
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
                       
                       {/* Messenger-like Hover Action Bar */}
                       {hoveredMessage === msg.id && !msg.is_deleted && (
                          <div className={`absolute top-4 ${isMe ? '-left-28' : '-right-28'} flex items-center gap-1 bg-white border border-[var(--border)] shadow-md rounded-full px-2 py-1`}>
                             <button onClick={() => reactToMessage(msg, '❤️')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-sm">❤️</button>
                             <button onClick={() => reactToMessage(msg, '👍')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-sm">👍</button>
                             <button onClick={() => setReplyingTo(msg)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-[var(--text-secondary)]"><Reply className="w-3.5 h-3.5" /></button>
                             {isMe && <button onClick={() => unsendMessage(msg.id)} className="p-1.5 hover:bg-rose-50 rounded-full transition-colors text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
                          </div>
                       )}
                     </div>
                   );
                 })
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
                    <Button type="button" onClick={triggerMockUpload} variant="ghost" className="w-10 h-10 rounded-full text-[var(--text-hint)] hover:bg-slate-100 hover:text-[var(--text-secondary)] shrink-0 p-0">
                       <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Nhắn tin tới lớp ${activeChannel.name}...`} 
                      className={`flex-1 h-12 border-[var(--border-medium)] shadow-sm bg-slate-50 focus-visible:ring-1 focus-visible:ring-[var(--accent)] px-4 md:px-5 ${replyingTo ? 'rounded-b-xl rounded-t-sm' : 'rounded-full'}`} 
                    />
                    <Button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] p-0 shadow-sm shrink-0 flex items-center justify-center transition-all disabled:opacity-50">
                       <Send className="w-5 h-5 -ml-1 flex-1 text-center" />
                    </Button>
                 </div>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
             <MessageCircle className="w-16 h-16 text-[var(--border)] mb-4" />
             <div className="text-[var(--text-hint)] text-sm">Chọn lớp học để mở kênh thảo luận</div>
          </div>
        )}
      </div>
    </div>
  );
}
