import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
  Sparkles,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionActions } from "@/components/teacher/session-actions";
import Link from "next/link";

export default async function TeacherClassesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "all";

  // Fetch real sessions
  let query = supabase
    .from("class_sessions")
    .select(`
      *,
      bookings(id),
      courses(title, level, goals)
    `)
    .eq("teacher_id", user.id)
    .order("scheduled_at", { ascending: false });

  if (activeTab === "live") query = query.eq("status", "live");
  if (activeTab === "upcoming") query = query.eq("status", "scheduled");
  if (activeTab === "completed") query = query.eq("status", "completed");

  const { data: sessionsData } = await query;

  const SESSIONS = sessionsData?.map(s => ({
    id: s.id,
    title: s.title || (s.courses as any)?.title || "Yoga Session",
    duration: `${s.duration_minutes || 60}m`,
    level: (s.courses as any)?.level === 1 ? "Beginner" : (s.courses as any)?.level === 2 ? "Intermediate" : "Advanced",
    time: new Date(s.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    scheduled_at: new Date(s.scheduled_at).toLocaleDateString('vi-VN'),
    students: (s as any).bookings?.length || 0,
    max_students: s.max_students || 20,
    status: s.status,
    courseId: s.course_id,
    result: s.status === 'completed' ? "AI: Hoàn thành" : s.status === 'live' ? "Đang diễn ra..." : "Chưa bắt đầu"
  })) || [];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <ClipboardList className="w-4 h-4 text-emerald-600" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Lịch giảng dạy</span>
          </div>
          <h1 className="text-2xl text-[var(--text-primary)] font-display italic">Quản lý lớp học</h1>
          <p className="text-[var(--text-secondary)] mt-2">Theo dõi các lớp đang diễn ra và quản lý lịch trình dạy yoga.</p>
        </div>
        <Link href="/teacher/classes/new">
          <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-10 px-5 rounded-full shadow-lg">
            <Plus className="w-5 h-5 mr-2" /> Tạo lớp dạy mới
          </Button>
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex gap-10">
           {["all", "live", "upcoming", "completed"].map(tab => (
             <Link 
               key={tab}
               href={`?tab=${tab}`}
               className={`pb-4 px-1 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? "text-emerald-600" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
             >
               {tab === "all" ? "Tất cả" : tab === "live" ? "Đang diễn ra" : tab === "upcoming" ? "Sắp tới" : "Hoàn thành"}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full" />}
             </Link>
           ))}
        </div>
        <Button variant="ghost" className="h-10 text-[var(--text-muted)] font-bold text-[10px] uppercase">
          Lịch trình tháng <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Session List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {SESSIONS.length > 0 ? SESSIONS.map((session, i) => (
          <div key={i} className={`group p-5 bg-white border-2 rounded-[var(--r-xl)] transition-all ${session.status === 'live' ? 'border-emerald-500 shadow-emerald ring-2 ring-emerald-50' : 'border-[var(--border)] shadow-sm hover:border-emerald-200'}`}>
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

             <SessionActions 
                sessionId={session.id}
                courseId={session.courseId}
                status={session.status}
             />
          </div>
        )) : (
          <div className="col-span-2 p-20 text-center bg-white rounded-3xl border-2 border-dashed border-[var(--border)]">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar className="w-8 h-8" />
             </div>
             <p className="text-[var(--text-secondary)] italic">Không tìm thấy lớp học nào trong mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
