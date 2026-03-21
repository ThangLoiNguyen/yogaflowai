"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Search, Clock, ChevronRight, Hash, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function StudentMessagesPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch teachers they have booked with
    const { data } = await supabase
      .from("bookings")
      .select(`
        class_sessions!inner (
          id,
          title,
          users!teacher_id (id, full_name, avatar_url)
        )
      `)
      .eq("student_id", user.id);

    // Group to unique channels
    const uniqueMap = new Map();
    if (data) {
      data.forEach((b: any) => {
        const s = b.class_sessions;
        if (s && s.id && !uniqueMap.has(s.id)) {
          uniqueMap.set(s.id, {
            id: s.id,
            type: "class",
            name: s.title,
            teacher: s.users?.full_name || "Giảng viên",
            avatar: s.users?.avatar_url
          });
        }
      });
    }

    const channelList = Array.from(uniqueMap.values());
    setChannels(channelList);
    if (channelList.length > 0) setActiveChannel(channelList[0]);
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-[var(--r-xl)] border border-[var(--border)] overflow-hidden shadow-sm">
      {/* Sidebar: Channel List */}
      <div className="w-1/3 border-r border-[var(--border)] flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold mb-4 font-display">Thảo luận</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-hint)]" />
            <Input placeholder="Tìm lớp, giáo viên..." className="h-10 pl-9 rounded-full bg-white shadow-sm" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-[var(--text-hint)] mb-3 px-2">Lớp học của bạn</div>
          {loading ? (
             [1,2,3].map(n => <div key={n} className="h-16 bg-slate-100 rounded-[var(--r-md)] animate-pulse" />)
          ) : channels.length > 0 ? (
             channels.map(ch => (
               <button
                 key={ch.id}
                 onClick={() => setActiveChannel(ch)}
                 className={`w-full flex items-center gap-3 p-3 rounded-[var(--r-md)] transition-all ${activeChannel?.id === ch.id ? 'bg-white shadow-sm border border-[var(--border)] relative' : 'hover:bg-slate-100 border border-transparent'}`}
               >
                 {activeChannel?.id === ch.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent)] rounded-r-full" />}
                 <div className="w-10 h-10 rounded-full bg-[var(--accent-tint)] flex flex-col items-center justify-center shrink-0 text-[var(--accent)]">
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
      <div className="flex-1 flex flex-col bg-white">
        {activeChannel ? (
          <>
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-[var(--accent-tint)] flex items-center justify-center text-[var(--accent)]">
                    <Hash className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{activeChannel.name}</h3>
                    <div className="text-xs text-[var(--text-secondary)]">Kênh thảo luận chung • GV. {activeChannel.teacher}</div>
                 </div>
              </div>
              <Button variant="outline" className="h-10 rounded-full border-[var(--border)] text-xs">
                 Xem thành viên
              </Button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center opacity-60">
               <MessageCircle className="w-16 h-16 text-[var(--text-hint)] mb-4" />
               <h4 className="text-[var(--text-primary)] font-bold text-lg mb-2">Chưa có tin nhắn nào</h4>
               <p className="text-[var(--text-secondary)] text-sm text-center max-w-sm">
                 Gửi lời chào đầu tiên tới Giáo viên và các bạn học trong lớp {activeChannel.name} nhé!
               </p>
            </div>
            
            <div className="p-4 border-t border-[var(--border)] bg-slate-50">
               <div className="flex items-center gap-3">
                  <Input placeholder={`Nhắn tin vào ${activeChannel.name}...`} className="flex-1 h-12 rounded-full border-[var(--border-medium)] shadow-sm bg-white focus-visible:ring-1 focus-visible:ring-[var(--accent)] px-6" />
                  <Button className="w-12 h-12 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] p-0 shadow-sm shrink-0 flex items-center justify-center">
                     <Send className="w-5 h-5 -ml-1" />
                  </Button>
               </div>
               <div className="text-center mt-2">
                 <span className="text-[10px] text-[var(--text-hint)] uppercase font-mono tracking-widest">Tính năng realtime đang thiết lập</span>
               </div>
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
