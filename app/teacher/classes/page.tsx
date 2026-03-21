"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Video, 
  Clock, 
  ChevronRight, 
  Plus, 
  Zap, 
  Users, 
  CheckCircle,
  MoreVertical,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const SESSIONS = [
  { id: 1, title: "Morning Vinyasa Flow", duration: "60m", level: "Beginner", time: "07:00", scheduled_at: "Hôm nay", students: 12, max_students: 20, status: "completed", result: "AI: Tốt, 100% hài lòng" },
  { id: 2, title: "Hatha for Beginners", duration: "45m", level: "Intermediate", time: "18:30", scheduled_at: "Hôm nay", students: 8, max_students: 15, status: "live", result: "Đang diễn ra..." },
  { id: 3, title: "Deep Stretch & Breath", duration: "75m", level: "All levels", time: "20:00", scheduled_at: "Hôm nay", students: 15, max_students: 25, status: "upcoming", result: "Dự kiến 20:00" },
  { id: 4, title: "Ashtanga Morning Series", duration: "90m", level: "Advanced", time: "06:00", scheduled_at: "Ngày mai", students: 10, max_students: 12, status: "booked", result: "Chốt danh sách" },
];

export default function TeacherClassesPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <ClipboardList className="w-4 h-4 text-emerald-600" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Lịch giảng dạy</span>
          </div>
          <h1 className="text-4xl text-[var(--text-primary)] font-display italic">Quản lý lớp học</h1>
          <p className="text-[var(--text-secondary)] mt-2">Theo dõi các lớp đang diễn ra và quản lý lịch trình dạy yoga.</p>
        </div>
        <Link href="/teacher/classes/new">
          <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-14 px-8 rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Tạo lớp dạy mới
          </Button>
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex gap-10">
           {["all", "live", "upcoming", "completed"].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 px-1 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? "text-emerald-600" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
             >
               {tab === "all" ? "Tất cả" : tab === "live" ? "Đang diễn ra" : tab === "upcoming" ? "Sắp tới" : "Hoàn thành"}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
             </button>
           ))}
        </div>
        <Button variant="ghost" className="h-10 text-[var(--text-muted)] font-bold text-[10px] uppercase">
          Lịch trình tháng <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Session List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SESSIONS.map((session, i) => (
          <div key={i} className={`group p-8 bg-white border-2 rounded-[var(--r-xl)] transition-all ${session.status === 'live' ? 'border-emerald-500 shadow-emerald ring-2 ring-emerald-50' : 'border-[var(--border)] shadow-sm hover:border-emerald-200'}`}>
             <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-3">
                      <h3 className="text-xl font-display">{session.title}</h3>
                      {session.status === 'live' && (
                         <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest animate-pulse">Live Now</div>
                      )}
                   </div>
                   <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.duration}</span>
                      <span className="flex items-center gap-1 font-mono uppercase tracking-widest text-[10px] text-[var(--text-hint)]">{session.level}</span>
                   </div>
                </div>
                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-emerald-50">
                   <MoreVertical className="w-5 h-5 text-slate-300" />
                </Button>
             </div>

             <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[var(--border-subtle)]">
                   <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">Thời gian</div>
                   <div className="text-sm font-bold text-[var(--text-primary)]">{session.time} · {session.scheduled_at}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[var(--border-subtle)]">
                   <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">Học viên</div>
                   <div className="text-sm font-bold text-[var(--text-primary)]">{session.students}/{session.max_students}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/70 border border-[var(--border-subtle)]">
                   <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">AI Status</div>
                   <div className="text-sm font-bold text-emerald-600 truncate">{session.result}</div>
                </div>
             </div>

             <div className="flex gap-3">
                <Button className={`flex-1 h-12 rounded-xl text-sm font-bold transition-all ${session.status === 'live' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald' : 'bg-slate-900 hover:bg-black text-white'}`}>
                   {session.status === 'live' ? (
                      <><Video className="w-4 h-4 mr-2" /> Tiếp tục dạy học</>
                   ) : (
                      <><Zap className="w-4 h-4 mr-2" /> Duyệt AI Insights</>
                   )}
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-sm font-bold">
                   <Users className="w-4 h-4 mr-2" /> Xem học viên
                </Button>
             </div>
          </div>
        ))}
      </div>
      
      {/* Banner: New Session Quick Info */}
      <div className="p-10 bg-emerald-50 rounded-[var(--r-xl)] border border-emerald-100 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm relative">
            <Sparkles className="w-10 h-10 text-emerald-500" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-pulse border-2 border-white" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-display mb-2">AI-Powered Class Planning</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">AI đã phân tích feedback từ buổi học sớm nay của 12 học viên. Hãy kiểm tra các gợi ý thay đổi cường độ cho buổi tối này.</p>
         </div>
         <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap px-8 h-14 rounded-full">Xem lộ trình gợi ý</Button>
      </div>
    </div>
  );
}
