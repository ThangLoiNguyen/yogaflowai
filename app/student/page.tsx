import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  CheckCircle, Flame, Map, Star, Calendar, ChevronRight, PlayCircle, AlertCircle, ArrowRight, MessageCircle, User, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { StudentEditDialog } from "@/components/profile/student-edit-dialog";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: quiz } = await supabase.from("onboarding_quiz").select("goals, experience_level, health_issues, fitness_level").eq("student_id", user.id).single();
  const { data: streakData } = await supabase.from("streaks").select("*").eq("student_id", user.id).single();
  
  const { count: completedCount } = await supabase.from("bookings").select("id, class_sessions!inner(status)", { count: 'exact', head: true }).eq("student_id", user.id).eq("class_sessions.status", "completed");

  const { data: nextBooking } = await supabase.from("bookings").select("id, class_sessions!inner (id, title, scheduled_at, duration_minutes, status, users!teacher_id (full_name))").eq("student_id", user.id).in("class_sessions.status", ["scheduled", "live"]).order("class_sessions(scheduled_at)", { ascending: true }).limit(1).single();
  const nextSession = nextBooking?.class_sessions as any;

  const { data: upcomingBookings } = await supabase.from("bookings").select("id, class_sessions!inner (id, title, scheduled_at, status, users!teacher_id (full_name))").eq("student_id", user.id).in("class_sessions.status", ["scheduled", "live"]).order("class_sessions(scheduled_at)", { ascending: true }).limit(5);

  const stats = [
    { label: "Đã học", value: completedCount?.toString() || "0", icon: CheckCircle, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Streak", value: `${streakData?.current_streak || 0}`, icon: Flame, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Rating TB", value: "4.9", icon: Star, color: "text-sky-500", bg: "bg-sky-50" },
  ];

  const hour = (new Date().getUTCHours() + 7) % 24;
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="flex flex-col min-h-screen lg:h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-hidden gap-6 lg:gap-8 pb-24 lg:pb-0 px-2 lg:px-1">
      <div className="shrink-0 space-y-4">
        {!quiz && (
          <div className="flex items-center gap-3 bg-sky-50 border border-sky-200 p-4 rounded-3xl animate-in fade-in slide-in-from-top-3 shadow-sm">
             <AlertCircle className="w-8 h-8 text-sky-600 shrink-0" />
             <div className="flex-1">
                <h4 className="txt-title text-sky-900 border-none">Hoàn thành Onboarding</h4>
                <p className="txt-action text-sky-700">AI cần dữ liệu để thiết kế lộ trình</p>
             </div>
             <Link href="/register/quiz"><Button className="bg-sky-600 hover:bg-sky-700 text-white txt-action rounded-xl px-6 h-9">Làm ngay</Button></Link>
          </div>
        )}

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1">
          <div className="space-y-1">
            <h1 className="txt-title text-xl lg:text-2xl font-bold border-none italic leading-tight">
              {greeting}, <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">{userData?.full_name?.split(" ").pop() || "bạn"}!</span>
            </h1>
            <p className="txt-content opacity-60 text-[10px] lg:text-sm">Hôm nay bạn đã sẵn sàng chưa?</p>
          </div>
          <div className="flex gap-2">
             <StudentEditDialog mode="profile" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 px-1 lg:px-0">
          {stats.map((stat, i) => (
            <div key={i} className="p-3 lg:p-4 rounded-2xl lg:rounded-[1.5rem] bg-white border border-slate-200 shadow-sm flex items-center gap-3 group hover:shadow-md transition-all">
               <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.color}`} />
               </div>
               <div className="min-w-0">
                  <div className="txt-title text-lg lg:text-xl font-bold leading-none mb-0.5 text-slate-700 truncate">{stat.value}</div>
                  <div className="txt-action text-slate-300 text-[8px] lg:text-[10px] truncate uppercase tracking-widest leading-none">{stat.label}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="p-5 lg:p-6 border-b border-slate-100 flex items-center justify-between bg-sky-50/10">
              <h3 className="txt-title text-sm lg:text-base text-slate-900 border-none uppercase tracking-tight">Lịch học & Lộ trình</h3>
              <Link href="/student/classes" className="txt-action text-xs text-sky-600 hover:underline">Xem tất cả</Link>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4 custom-scrollbar">
              {nextSession ? (
                <div className="p-5 lg:p-6 bg-sky-600 rounded-2xl lg:rounded-[1.5rem] text-white relative overflow-hidden group shadow-lg shadow-sky-100">
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${nextSession.status === 'live' ? 'bg-white animate-pulse' : 'bg-sky-300'}`} />
                           <span className="txt-action text-[9px] lg:text-[10px] opacity-80 uppercase tracking-widest">{nextSession.status === 'live' ? 'Đang diễn ra' : 'Sắp diễn ra'}</span>
                         </div>
                         <h2 className="txt-title text-lg lg:text-xl font-bold leading-tight text-white border-none">{nextSession.title}</h2>
                         <div className="flex items-center gap-3 txt-action text-[10px] opacity-90">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(nextSession.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {new Date(nextSession.scheduled_at).toLocaleDateString('vi-VN')}
                         </div>
                      </div>
                      <Link href={`/student/session/${nextSession.id}`} className="w-full sm:w-auto">
                         <Button className={`w-full sm:w-auto h-9 lg:h-10 px-6 rounded-xl shadow-xl txt-action text-[10px] lg:text-xs group transition-all ${nextSession.status === 'live' ? 'bg-white text-sky-600 hover:bg-slate-50' : 'bg-white text-sky-600 hover:bg-slate-50'}`}>
                           Vào học ngay
                         </Button>
                      </Link>
                   </div>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-sky-50/10">
                   <Sparkles className="w-10 h-10 mx-auto mb-2 text-sky-300 opacity-20" />
                   <p className="txt-content text-xs opacity-50 italic">Chưa có lịch học mới.</p>
                   <Link href="/student/explore"><Button variant="ghost" className="mt-4 txt-action text-[10px] text-sky-600">Khám phá lớp học mới <ArrowRight className="w-3 h-3 ml-2" /></Button></Link>
                </div>
              )}

              <div className="space-y-4 pt-4">
                 <h4 className="txt-action text-[10px] lg:text-xs text-slate-300 uppercase tracking-widest px-1">Lịch đã đặt</h4>
                 {upcomingBookings && upcomingBookings.length > 0 ? upcomingBookings.map((b, i) => (
                   <div key={i} className="p-3 lg:p-4 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <div className="txt-content text-xs font-black text-slate-700">{new Date((b.class_sessions as any).scheduled_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                         </div>
                         <div className="min-w-0">
                            <div className="txt-content font-bold text-slate-700 truncate text-sm leading-tight">{(b.class_sessions as any).title}</div>
                            <div className="txt-action text-[10px] text-slate-400 truncate mt-0.5">GV: {(b.class_sessions as any).users?.full_name}</div>
                         </div>
                      </div>
                      <Link href={`/student/session/${(b.class_sessions as any).id}`}>
                         <Button variant="ghost" className="h-8 w-8 lg:h-9 lg:w-9 p-0 text-slate-300 group-hover:text-sky-600 group-hover:bg-sky-50"><ChevronRight className="w-5 h-5" /></Button>
                      </Link>
                   </div>
                 )) : <p className="text-center txt-action text-[10px] text-slate-300 italic py-4">Trống</p>}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden shrink-0">
           {/* Streak Stats */}
           <div className="p-5 lg:p-6 bg-slate-900 rounded-3xl lg:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden shrink-0">
              <div className="flex items-center gap-3 mb-4 text-sky-400">
                 <Flame className="w-5 h-5 lg:w-6 lg:h-6 fill-sky-400" />
                 <span className="txt-action text-xs text-sky-400 uppercase tracking-widest">Streak {streakData?.current_streak || 0} Ngày</span>
              </div>
              <div className="flex justify-between items-center gap-1 mb-6">
                 {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
                   const todayIdx = (new Date().getDay() + 6) % 7;
                   const isActive = idx <= todayIdx && (streakData?.current_streak || 0) > 0;
                   return (
                     <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                       <span className="txt-action text-white/30 text-[8px] lg:text-[10px] scale-90">{day}</span>
                       <div className={`w-6 h-6 lg:w-7 lg:h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-sky-500 shadow-lg scale-110' : 'bg-white/10'}`}>
                          {isActive && <CheckCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />}
                       </div>
                     </div>
                   );
                 })}
              </div>
              <p className="txt-action text-white/50 text-center text-[10px] lg:text-xs leading-relaxed italic">Duy trì thói quen!</p>
           </div>

           {/* AI Recommended Section */}
           <div className="p-5 lg:p-6 bg-sky-50/50 rounded-3xl border border-sky-100 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-sky-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-sky-900">AI Đề xuất</span>
              </div>
              <div className="space-y-3">
                 <div className="p-3 bg-white rounded-2xl border border-sky-100 shadow-sm group cursor-pointer hover:border-sky-400 transition-all">
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors">Vinyasa Flow Phục hồi</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                       <span className="text-[9px] text-slate-400">Phù hợp 95%</span>
                    </div>
                 </div>
                 <Link href="/student/explore">
                   <Button variant="outline" className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-widest border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white transition-all">Xem tất cả</Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
