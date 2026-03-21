import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Users, 
  Video, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TeacherEditDialog } from "@/components/profile/teacher-edit-dialog";
import { SessionActions } from "@/components/teacher/session-actions";

export default async function TeacherOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();

  // 1. Fetch Today's Classes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: todaySessions } = await supabase
    .from("class_sessions")
    .select(`
      *,
      bookings(id)
    `)
    .eq("teacher_id", user.id)
    .gte("scheduled_at", today.toISOString())
    .lt("scheduled_at", tomorrow.toISOString())
    .order("scheduled_at", { ascending: true });

  // 2. Fetch Total Students
  const { data: teacherStudents } = await supabase
    .from("bookings")
    .select("student_id, class_sessions!inner(teacher_id)")
    .eq("class_sessions.teacher_id", user.id);
  
  const uniqueStudentIds = new Set(teacherStudents?.map(b => b.student_id));
  const totalStudents = uniqueStudentIds.size;

  // 3. Fetch AI Alerts (Pending suggestions)
  const { count: pendingAlerts } = await supabase
    .from("ai_suggestions")
    .select("id", { count: 'exact', head: true })
    .eq("teacher_id", user.id)
    .eq("teacher_decision", "pending");

  // 4. Fetch AI Insights Feed
  const { data: insightsData } = await supabase
    .from("ai_suggestions")
    .select(`
      id,
      suggestions,
      teacher_decision,
      student_id,
      users!student_id (full_name)
    `)
    .eq("teacher_id", user.id)
    .eq("teacher_decision", "pending")
    .order("created_at", { ascending: false })
    .limit(3);

  // 5. Fetch Avg Rating
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("rating, course_id, courses!inner(teacher_id)")
    .eq("courses.teacher_id", user.id);

  const avgRating = reviewData && reviewData.length > 0
    ? (reviewData.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewData.length).toFixed(1)
    : "5.0";

  const stats = [
    { label: "Lớp hôm nay", value: todaySessions?.length.toString() || "0", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Tổng học viên", value: totalStudents.toString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "AI Alerts", value: pendingAlerts?.toString() || "0", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Rating TB", value: avgRating, icon: Sparkles, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const sessions = todaySessions?.map(s => ({
    id: s.id,
    course_id: s.course_id,
    time: new Date(s.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    title: s.title,
    students: (s as any).bookings?.length || 0,
    status: s.status as any
  })) || [];

  const aiInsights = insightsData?.map(ins => ({
    student: (ins.users as any).full_name,
    student_id: ins.student_id,
    change: (ins.suggestions as any)[0]?.type === 'intensity' ? 'Thay đổi cường độ' : 'Gợi ý mới',
    suggestion: (ins.suggestions as any)[0]?.action,
    status: ins.teacher_decision
  })) || [];

  return (
    <div className="space-y-12">
      {/* Red Flag Alerts */}
      {parseInt(stats[2].value) > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-4 bg-red-50 border border-red-200 p-4 rounded-[var(--r-md)] animate-in fade-in slide-in-from-top-4 shadow-sm">
             <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
             <div className="flex-1">
                <h4 className="text-red-900 font-bold mb-1">Cảnh báo AI Insights</h4>
                <p className="text-sm text-red-700">Có <span className="font-bold">{stats[2].value} gợi ý AI</span> khẩn cấp đang chờ bạn duyệt và điều chỉnh lộ trình.</p>
             </div>
             <Link href="/teacher/ai-insights">
               <Button className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-full h-9 px-5">
                 Xử lý ngay
               </Button>
             </Link>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Teacher Dashboard active</span>
          </div>
          <h1 className="text-2xl">Chào, GV. <span className="font-medium italic text-emerald-600">{userData?.full_name || user.email?.split("@")[0] || "Linh"}!</span></h1>
          <p className="text-[var(--text-secondary)] mt-2">Hôm nay bạn có {stats[0].value} lớp học và {stats[2].value} thông báo AI cần xử lý.</p>
        </div>
        <div className="flex gap-4">
          <TeacherEditDialog />
          <Link href="/teacher/classes/new">
            <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-10 px-5 rounded-full shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Tạo lớp mới
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 rounded-[var(--r-lg)] bg-white border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
             <div className="flex items-start justify-between mb-6">
                <div className={`w-9 h-9 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
             </div>
             <div className="stats-value text-xl mb-1">{stat.value}</div>
             <div className="label-mono uppercase text-[10px] text-[var(--text-muted)] tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-display">Lịch dạy hôm nay</h3>
              <Link href="/teacher/classes" className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
                 Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="space-y-4">
              {sessions.length > 0 ? sessions.map((s, i) => (
                <div key={i} className={`p-4 bg-white border rounded-[var(--r-lg)] flex flex-col sm:flex-row items-start sm:items-center gap-4 group transition-all hover:border-emerald-300 ${s.status === 'live' ? 'border-emerald-500 shadow-md ring-1 ring-emerald-50' : 'border-[var(--border)] shadow-sm'}`}>
                   <div className="w-full sm:w-20 text-left sm:text-center border-b sm:border-b-0 sm:border-r border-[var(--bg-muted)] pb-3 sm:pb-0 sm:pr-4 shrink-0 flex sm:block items-end justify-between">
                      <div className="text-base font-semibold text-[var(--text-primary)] leading-none sm:mb-1">{s.time}</div>
                      <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Time</div>
                   </div>
                   <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-base truncate">{s.title}</h4>
                        {s.status === 'live' && (
                           <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-semibold uppercase animate-pulse shrink-0">Live</span>
                        )}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">{s.students} học viên đã đặt chỗ</div>
                   </div>
                    <div className="w-full sm:w-[150px] shrink-0">
                       <SessionActions 
                          sessionId={s.id}
                          courseId={s.course_id}
                          status={s.status}
                       />
                    </div>
                </div>
              )) : (
                <div className="p-12 text-center bg-white rounded-[var(--r-lg)] border-2 border-dashed border-[var(--border)]">
                   <p className="text-[var(--text-secondary)] italic">Hôm nay bạn không có lớp dạy nào.</p>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="flex items-center gap-2 px-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-2xl font-display">AI Insights Feed</h3>
           </div>
           <div className="space-y-4">
              {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
                <div key={i} className="p-4 bg-white border border-[var(--border)] rounded-[var(--r-lg)] shadow-sm hover:shadow-md transition-all relative group">
                   {insight.status === 'pending' && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500" />
                   )}
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 ring-2 ring-white">
                         {insight.student.charAt(0)}
                      </div>
                      <div>
                         <div className="text-sm font-bold text-[var(--text-primary)]">{insight.student}</div>
                         <div className={`text-[10px] font-bold uppercase ${insight.change?.includes('intensity') ? 'text-red-500' : 'text-indigo-500'}`}>{insight.change}</div>
                      </div>
                   </div>
                   <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 italic">
                      "{insight.suggestion}"
                   </p>
                   <div className="flex gap-2">
                      <Link href={`/teacher/ai-insights?student=${insight.student_id}`} className="flex-1">
                        <Button size="sm" className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase rounded-lg">Xem chi tiết</Button>
                      </Link>
                      <Button size="sm" variant="outline" className="h-9 px-3 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-lg">
                         <X className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
              )) : (
                <div className="p-12 text-center bg-white rounded-[var(--r-lg)] border-2 border-dashed border-[var(--border)]">
                   <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                   <p className="text-[var(--text-secondary)] italic">Hiện tại không có gợi ý AI mới.</p>
                </div>
              )}
              <Link href="/teacher/ai-insights">
                <Button variant="ghost" className="w-full h-9 rounded-xl text-[var(--text-hint)] hover:text-indigo-600 font-medium text-xs">
                   Xem lịch sử Insights AI
                </Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
