"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Search, Hash, Send, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function TeacherMessagesPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
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
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `channel_id=eq.${activeChannel.id}` },
          (payload) => {
            supabase.from("users").select("full_name, avatar_url, id").eq("id", payload.new.user_id).single().then(({ data: author }) => {
              const enrichedMessage = { ...payload.new, users: author };
              setMessages(prev => [...prev, enrichedMessage]);
            });
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
    setNewMessage("");

    await supabase.from("chat_messages").insert({
      channel_id: activeChannel.id,
      user_id: currentUser.id,
      content: content
    });
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
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeChannel ? (
          <>
            <div className="p-4 md:p-6 border-b border-[var(--border)] flex items-center justify-between shrink-0">
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
              <Button variant="outline" className="hidden md:flex h-9 rounded-full border-[var(--border)] text-xs">
                 Quản lý lớp
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
                   return (
                     <div key={i} className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
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
                         <div className="flex items-center gap-2 mb-1 mx-1.5">
                           {!isMe && <span className="text-[10px] font-bold bg-[var(--bg-muted)] tracking-widest uppercase px-1.5 py-0.5 rounded shadow-sm">Học viên</span>}
                           <span className="text-[10px] text-[var(--text-muted)] font-medium">{isMe ? 'Bạn' : msg.users?.full_name || 'Anonymous'}</span>
                         </div>
                         <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-[var(--accent)] text-white rounded-tr-sm' : 'bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm'}`}>
                            {msg.content}
                         </div>
                       </div>
                     </div>
                   );
                 })
               )}
               <div ref={messagesEndRef} />
            </div>
            
            {/* Input Box */}
            <form onSubmit={sendMessage} className="p-4 border-t border-[var(--border)] bg-white shrink-0">
               <div className="flex items-center gap-2 md:gap-3 max-w-3xl mx-auto">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Nhắn tin tới lớp ${activeChannel.name}...`} 
                    className="flex-1 h-12 rounded-full border-[var(--border-medium)] shadow-sm bg-slate-50 focus-visible:ring-1 focus-visible:ring-[var(--accent)] px-4 md:px-6" 
                  />
                  <Button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] p-0 shadow-sm shrink-0 flex items-center justify-center transition-all disabled:opacity-50">
                     <Send className="w-5 h-5 -ml-1" />
                  </Button>
               </div>
            </form>
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
