"use client";

import React, { useState } from "react";
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

const SESSIONS = [
  { id: 1, title: "Vinyasa Core Flow", teacher: "Linh Nguyen", date: "Hôm nay", time: "19:00 - 20:00", status: "upcoming", type: "Live Class" },
  { id: 2, title: "Hatha for Beginners", teacher: "Minh Tu", date: "Thứ 3, 24/03", time: "07:30 - 08:30", status: "booked", type: "Live Class" },
  { id: 3, title: "Ashtanga Morning", teacher: "Quoc Huy", date: "16/03", time: "06:00 - 07:00", status: "completed", type: "Live Class" },
  { id: 4, title: "Deep Stretch & Breath", teacher: "Thu Trang", date: "12/03", time: "20:00 - 21:00", status: "completed", type: "Live Class" },
];

export default function StudentClassesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredSessions = activeTab === "all" ? SESSIONS : SESSIONS.filter(s => s.status === activeTab);

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

      {/* Live class grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSessions.map((session, i) => (
          <div key={i} className={`group bg-white rounded-[var(--r-xl)] border-2 transition-all overflow-hidden ${session.status === 'upcoming' ? 'border-[var(--accent-light)] shadow-sky' : 'border-[var(--border)] shadow-sm'}`}>
             <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div className={`px-3 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest ${session.status === 'upcoming' ? 'bg-[var(--accent)] text-white' : session.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                      {session.status === 'upcoming' ? 'Live Today' : session.status === 'completed' ? 'Completed' : 'Booked'}
                   </div>
                   <div className="text-[var(--text-hint)] flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] uppercase">{session.time}</span>
                   </div>
                </div>

                <div className="mb-8">
                   <h3 className="text-xl mb-2 group-hover:text-[var(--accent)] transition-colors">{session.title}</h3>
                   <div className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--accent)] font-bold text-[10px]">{session.teacher.charAt(0)}</div>
                      {session.teacher}
                   </div>
                </div>

                <div className="flex items-center gap-3 mb-8">
                   <div className="flex-1 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                      <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase mb-1">Ngày diễn ra</div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">{session.date}</div>
                   </div>
                   <div className="flex-1 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                      <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase mb-1">Loại lớp</div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">{session.type}</div>
                   </div>
                </div>

                <div className="flex gap-2">
                   {session.status === 'upcoming' ? (
                     <Button className="flex-1 btn-primary h-12 text-sm font-bold rounded-xl ring-offset-4 ring-offset-white ring-2 ring-transparent active:scale-95 transition-all">
                        <Video className="w-4 h-4 mr-2" /> Vào lớp học
                     </Button>
                   ) : (
                      <Link href={`/student/course/${session.id}`} className="flex-1">
                        <Button variant="outline" className="w-full h-12 text-sm font-bold rounded-xl border-[var(--border-medium)] text-[var(--text-secondary)] hover:bg-[var(--bg-base)]">
                           <ExternalLink className="w-4 h-4 mr-2" /> Xem lại
                        </Button>
                      </Link>
                   )}
                   <Button variant="ghost" className="h-12 w-12 rounded-xl text-[var(--text-hint)] hover:text-[var(--accent)] transition-colors bg-[var(--bg-muted)] p-0">
                      <MessageCircle className="w-5 h-5" />
                   </Button>
                </div>
             </div>
             
             {session.status === 'completed' && (
               <div className="bg-emerald-50/50 p-4 border-t border-[var(--border)] flex items-center gap-3 text-emerald-700 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>AI: Bạn đã hoàn thành 100% mục tiêu bài này.</span>
               </div>
             )}
          </div>
        ))}
      </div>
      
      {/* Empty State Mockup */}
      {filteredSessions.length === 0 && (
        <div className="py-32 text-center rounded-[var(--r-xl)] border-2 border-dashed border-[var(--border-medium)] bg-white/50">
           <div className="mb-6 opacity-20">
              <Calendar className="w-16 h-16 mx-auto" />
           </div>
           <h3 className="text-2xl mb-2 text-[var(--text-secondary)]">Chưa có lớp học được xếp</h3>
           <p className="text-[var(--text-hint)] mb-8">Bạn có thể tìm các lớp học phù hợp với mình tại mục Khám phá.</p>
           <Link href="/student/explore">
              <Button className="btn-primary h-14 px-10">Khám phá lớp ngay</Button>
           </Link>
        </div>
      )}
    </div>
  );
}
