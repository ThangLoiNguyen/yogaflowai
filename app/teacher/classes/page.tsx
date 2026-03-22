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
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2 lg:px-0">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-2 shadow-sm">
             <ClipboardList className="w-3.5 h-3.5 text-emerald-600" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Lịch giảng dạy</span>
          </div>
           <h1 className="txt-title text-2xl lg:text-3xl text-[var(--text-primary)] border-none italic mb-0 leading-tight">Quản lý lớp học</h1>
        </div>
        <Link href="/teacher/classes/new" className="w-full sm:w-auto">
           <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-full shadow-lg txt-action w-full text-xs lg:text-sm">
            <Plus className="w-4 h-4 mr-2" /> Tạo lớp mới
          </Button>
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--border)] overflow-x-auto no-scrollbar scroll-smooth px-2 lg:px-0">
        <div className="flex gap-6 lg:gap-10 shrink-0">
           {["all", "live", "upcoming", "completed"].map(tab => (
             <Link 
               key={tab}
               href={`?tab=${tab}`}
                className={`pb-4 px-1 txt-action transition-all relative whitespace-nowrap text-[10px] lg:text-xs ${activeTab === tab ? "text-emerald-600" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
              >
                {tab === "all" ? "Tất cả" : tab === "live" ? "Đang diễn ra" : tab === "upcoming" ? "Sắp tới" : "Hoàn thành"}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-t-full animate-in fade-in zoom-in-y-0" />}
             </Link>
           ))}
        </div>
         <Button variant="ghost" className="h-10 text-[var(--text-muted)] txt-action text-[10px] lg:text-xs shrink-0 pl-10 hidden sm:flex">
          Lịch trình tháng <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Session List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-1 lg:px-0">
        {SESSIONS.length > 0 ? SESSIONS.map((session, i) => (
          <div key={i} className={`group p-4 lg:p-6 bg-white border-2 rounded-3xl lg:rounded-[var(--r-xl)] transition-all ${session.status === 'live' ? 'border-emerald-500 shadow-emerald ring-2 ring-emerald-50' : 'border-[var(--border)] shadow-sm hover:border-emerald-200'}`}>
             <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                   <div className="flex items-center gap-2 mb-1">
                       <h3 className="txt-title text-base lg:text-xl truncate">{session.title}</h3>
                      {session.status === 'live' && (
                          <div className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 txt-action animate-pulse text-[8px] lg:text-[10px] shrink-0">Live Now</div>
                      )}
                   </div>
                    <div className="flex items-center gap-4 text-[10px] lg:text-xs text-[var(--text-secondary)]">
                       <span className="flex items-center gap-1 txt-content font-bold"><Clock className="w-3.5 h-3.5" /> {session.duration}</span>
                       <span className="flex items-center gap-1 txt-action text-[var(--text-hint)] uppercase tracking-widest">{session.level}</span>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                 <div className="p-3 lg:p-4 rounded-2xl bg-slate-50/70 border border-[var(--border-subtle)]">
                    <div className="txt-action text-[9px] lg:text-[11px] text-[var(--text-muted)] mb-1">Thời gian</div>
                    <div className="txt-content font-bold text-xs lg:text-sm text-[var(--text-primary)]">{session.time} · {session.scheduled_at}</div>
                 </div>
                 <div className="p-3 lg:p-4 rounded-2xl bg-slate-50/70 border border-[var(--border-subtle)]">
                    <div className="txt-action text-[9px] lg:text-[11px] text-[var(--text-muted)] mb-1">Học viên</div>
                    <div className="txt-content font-bold text-xs lg:text-sm text-[var(--text-primary)]">{session.students}/{session.max_students}</div>
                 </div>
                 <div className="p-3 lg:p-4 rounded-2xl bg-slate-50/70 border border-[var(--border-subtle)]">
                    <div className="txt-action text-[9px] lg:text-[11px] text-[var(--text-muted)] mb-1">AI Status</div>
                    <div className="txt-content font-bold text-xs lg:text-sm text-emerald-600 truncate">{session.result}</div>
                 </div>
             </div>

             <div className="shrink-0">
               <SessionActions 
                  sessionId={session.id}
                  courseId={session.courseId}
                  status={session.status}
               />
             </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-[var(--border)]">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Calendar className="w-8 h-8" />
             </div>
             <p className="text-[var(--text-secondary)] italic text-sm">Không tìm thấy lớp học nào trong mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
