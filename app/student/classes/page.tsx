"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Map, 
  Clock, 
  ChevronRight, 
  PlayCircle,
  CheckCircle,
  Video,
  ExternalLink,
  MessageCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function StudentClassesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        status,
        session_id,
        booked_at,
        class_sessions!inner (
          id,
          title,
          scheduled_at,
          status,
          users!teacher_id (full_name)
        )
      `)
      .eq("student_id", user.id)
      .order("booked_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Không thể tải danh sách lớp học.");
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return b.status === "booked" || b.class_sessions.status === "scheduled" || b.class_sessions.status === "live";
    if (activeTab === "completed") return b.status === "attended" || b.class_sessions.status === "completed";
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <Calendar className="w-4 h-4 text-[var(--accent)]" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Lượt học của bạn</span>
          </div>
          <h1 className="text-4xl text-[var(--text-primary)] font-display">Lớp học của tôi</h1>
          <p className="text-[var(--text-secondary)] mt-2">Quản lý các buổi học đã đặt và theo dõi tiến trình của bạn.</p>
        </div>
        <Link href="/student/explore">
          <Button className="btn-primary h-14 px-8 rounded-full shadow-sky">
            Đặt lớp học mới
          </Button>
        </Link>
      </header>

      {/* Tabs / Filters */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-1">
        <div className="flex gap-10">
           {["all", "upcoming", "completed"].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 px-1 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
             >
               {tab === "all" ? "Tất cả" : tab === "upcoming" ? "Sắp tới" : "Đã học"}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent)] rounded-t-full" />}
             </button>
           ))}
        </div>
        <Button variant="ghost" className="h-10 text-[var(--text-muted)] font-bold text-[10px] uppercase">
          <Filter className="w-4 h-4 mr-2" /> Lọc & Sắp xếp
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           [1,2,3].map(n => <div key={n} className="h-64 bg-slate-100 rounded-[var(--r-xl)] animate-pulse" />)
        ) : filteredBookings.map((b, i) => {
          const s = b.class_sessions;
          const isLive = s.status === 'live';
          const isCompleted = s.status === 'completed';

          return (
            <div key={i} className={`group bg-white rounded-[var(--r-xl)] border-2 transition-all overflow-hidden ${isLive ? 'border-[var(--accent-light)] shadow-sky' : 'border-[var(--border)] shadow-sm'}`}>
               <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                     <div className={`px-3 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest ${isLive ? 'bg-[var(--accent)] text-white animate-pulse' : isCompleted ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isLive ? 'Live Now' : isCompleted ? 'Completed' : 'Booked'}
                     </div>
                     <div className="text-[var(--text-hint)] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono text-[10px] uppercase">
                          {new Date(s.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-xl mb-2 group-hover:text-[var(--accent)] transition-colors h-14 line-clamp-2">{s.title}</h3>
                     <div className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--accent)] font-bold text-[10px]">
                          {(s.users as any)?.full_name?.[0] || "L"}
                        </div>
                        {(s.users as any)?.full_name || "Linh Yoga"}
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mb-8">
                     <div className="flex-1 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                        <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase mb-1">Ngày diễn ra</div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">
                          {new Date(s.scheduled_at).toLocaleDateString('vi-VN')}
                        </div>
                     </div>
                     <div className="flex-1 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                        <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase mb-1">Loại lớp</div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">Trực tuyến</div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <Link href={`/student/session/${s.id}`} className="flex-1">
                        <Button className={`w-full h-12 text-sm font-bold rounded-xl ring-offset-4 ring-offset-white ring-2 ring-transparent active:scale-95 transition-all ${isLive ? 'btn-primary' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
                           <Video className="w-4 h-4 mr-2" /> Vào lớp học
                        </Button>
                     </Link>
                     <Button variant="ghost" className="h-12 w-12 rounded-xl text-[var(--text-hint)] hover:text-[var(--accent)] transition-colors bg-[var(--bg-muted)] p-0">
                        <MessageCircle className="w-5 h-5" />
                     </Button>
                  </div>
               </div>
               
               {isCompleted && (
                 <Link href={`/student/session/${s.id}/quiz`} className="bg-emerald-50/50 p-4 border-t border-[var(--border)] flex items-center gap-3 text-emerald-700 text-xs hover:bg-emerald-100 transition-colors">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>AI: Buổi tập kết thúc. Vui lòng điền Quiz để nhận phản hồi.</span>
                 </Link>
               )}
            </div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <div className="py-32 text-center rounded-[var(--r-xl)] border-2 border-dashed border-[var(--border-medium)] bg-white/50">
           <div className="mb-6 opacity-20">
              <Calendar className="w-16 h-16 mx-auto" />
           </div>
           <h3 className="text-2xl mb-2 text-[var(--text-secondary)] font-display">Chưa có lớp học được xếp</h3>
           <p className="text-[var(--text-hint)] mb-8">Bạn có thể tìm các lớp học phù hợp với mình tại mục Khám phá.</p>
           <Link href="/student/explore">
              <Button className="btn-primary h-14 px-10">Khám phá lớp ngay</Button>
           </Link>
        </div>
      )}
    </div>
  );
}
