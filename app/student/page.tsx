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
    { label: "Đã học", value: completedCount?.toString() || "0", icon: CheckCircle, color: "text-slate-400", bg: "bg-slate-50" },
    { label: "Chuỗi tập", value: `${streakData?.current_streak || 0}`, icon: Flame, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Rating TB", value: "4.9", icon: Star, color: "text-slate-400", bg: "bg-slate-50" },
  ];

  const hour = (new Date().getUTCHours() + 7) % 24;
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="flex flex-col min-h-screen lg:h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-hidden gap-6 lg:gap-8 pb-24 lg:pb-0 px-2 lg:px-1">
      <div className="shrink-0 space-y-4">
        {!quiz && (
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-3xl animate-in fade-in slide-in-from-top-3 shadow-md">
             <AlertCircle className="w-8 h-8 text-sky-500 shrink-0" />
             <div className="flex-1">
                <h4 className="txt-title text-slate-900 border-none">Hoàn thành Onboarding</h4>
                <p className="txt-action text-slate-500 italic lowercase tracking-tight">AI cần dữ liệu để thiết kế lộ trình</p>
             </div>
             <Link href="/register/quiz"><Button className="bg-sky-500 hover:bg-sky-600 text-white txt-action rounded-xl px-6 h-9 shadow-lg shadow-sky-100">Làm ngay</Button></Link>
          </div>
        )}

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1">
          <div className="space-y-1">
            <h1 className="txt-title text-xl lg:text-2xl font-bold border-none italic leading-tight">
              {greeting}, <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">{userData?.full_name?.split(" ").pop() || "bạn"}!</span>
            </h1>
            <p className="txt-content opacity-50 text-[10px] lg:text-sm italic">Hôm nay bạn đã sẵn sàng chưa?</p>
          </div>
          <div className="flex gap-2">
             <StudentEditDialog mode="profile" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 px-1 lg:px-0">
          {stats.map((stat, i) => (
            <div key={i} className="p-3 lg:p-4 rounded-2xl lg:rounded-[1.5rem] bg-white border border-slate-200 shadow-sm flex items-center gap-3 group hover:border-slate-300 transition-all">
               <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.color}`} />
               </div>
               <div className="min-w-0">
                  <div className="txt-title text-lg lg:text-xl font-bold leading-none mb-0.5 text-slate-900 truncate">{stat.value}</div>
                  <div className="txt-action text-slate-400 text-[8px] lg:text-[10px] truncate uppercase tracking-widest leading-none opacity-60 font-mono">{stat.label}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="p-5 lg:p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="txt-title text-xs lg:text-sm text-slate-400 border-none uppercase tracking-widest font-mono">Lịch học & Lộ trình</h3>
              <Link href="/student/classes" className="txt-action text-[10px] text-slate-400 hover:text-sky-600 transition-colors uppercase tracking-widest">Xem tất cả</Link>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4 custom-scrollbar">
              {nextSession ? (
                <div className="p-5 lg:p-6 bg-slate-900 rounded-2xl lg:rounded-[2rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-200 border border-slate-800">
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${nextSession.status === 'live' ? 'bg-sky-400 animate-pulse' : 'bg-slate-600'}`} />
                            <span className="txt-action text-[8px] lg:text-[9px] opacity-60 uppercase tracking-widest">{nextSession.status === 'live' ? 'Đang diễn ra' : 'Sắp diễn ra'}</span>
                         </div>
                         <h2 className="txt-title text-lg lg:text-2xl font-black leading-tight text-white border-none italic">{nextSession.title}</h2>
                         <div className="flex items-center gap-3 txt-action text-[9px] lg:text-[10px] text-slate-400 italic">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(nextSession.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {new Date(nextSession.scheduled_at).toLocaleDateString('vi-VN')}
                         </div>
                      </div>
                      <Link href={`/student/session/${nextSession.id}`} className="w-full sm:w-auto">
                         <Button className="w-full sm:w-auto h-10 lg:h-12 px-8 rounded-2xl bg-sky-500 text-white hover:bg-sky-600 shadow-xl shadow-sky-900/20 txt-action text-[10px] lg:text-xs font-black uppercase tracking-widest">
                           Vào học ngay
                         </Button>
                      </Link>
                   </div>
                   {/* Subtle decoration */}
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl group-hover:bg-sky-500/10 transition-all duration-700" />
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                   <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                   <p className="txt-content text-[11px] text-slate-400 italic">Chưa có lịch học mới.</p>
                   <Link href="/student/explore"><Button variant="ghost" className="mt-4 txt-action text-[10px] text-slate-400 hover:text-sky-500 uppercase tracking-widest">Khám phá lớp học mới <ArrowRight className="w-3 h-3 ml-2" /></Button></Link>
                </div>
              )}

              <div className="space-y-4 pt-4">
                 <h4 className="txt-action text-[10px] text-slate-300 uppercase tracking-[0.2em] px-1 font-mono">Lịch đã đặt</h4>
                 {upcomingBookings && upcomingBookings.length > 0 ? upcomingBookings.map((b, i) => (
                   <div key={i} className="p-3 lg:p-4 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-slate-200 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
                            <div className="txt-content text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase font-mono">{new Date((b.class_sessions as any).scheduled_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                         </div>
                         <div className="min-w-0">
                            <div className="txt-content font-bold text-slate-700 truncate text-sm leading-tight group-hover:text-slate-900 transition-colors">{(b.class_sessions as any).title}</div>
                            <div className="txt-action text-[9px] text-slate-300 truncate mt-0.5 group-hover:text-slate-400 transition-colors italic lowercase tracking-tight">GV: {(b.class_sessions as any).users?.full_name}</div>
                         </div>
                      </div>
                      <Link href={`/student/session/${(b.class_sessions as any).id}`}>
                         <Button variant="ghost" className="h-8 w-8 lg:h-9 lg:w-9 p-0 text-slate-200 group-hover:text-sky-500 group-hover:bg-sky-50 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></Button>
                      </Link>
                   </div>
                 )) : <p className="text-center txt-action text-[10px] text-slate-300 italic py-4">Trống</p>}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden shrink-0">
           {/* Streak Stats */}
           <div className="p-5 lg:p-7 bg-slate-900 rounded-3xl lg:rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden shrink-0 border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-sky-400 fill-sky-400" />
                 </div>
                 <span className="txt-action text-[10px] lg:text-xs text-slate-400 uppercase tracking-widest font-mono">Streak {streakData?.current_streak || 0} Ngày</span>
              </div>
              <div className="flex justify-between items-center gap-1 mb-8">
                 {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
                   const todayIdx = (new Date().getDay() + 6) % 7;
                   const isActive = idx <= todayIdx && (streakData?.current_streak || 0) > 0;
                   return (
                     <div key={day} className="flex flex-col items-center gap-2 flex-1">
                       <span className={`txt-action text-[8px] lg:text-[9px] scale-90 font-mono ${idx === todayIdx ? 'text-sky-400 font-black' : 'text-slate-600'}`}>{day}</span>
                       <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center transition-all border ${isActive ? 'bg-sky-500 border-sky-400 shadow-lg shadow-sky-500/20' : 'bg-white/5 border-white/5'}`}>
                          {isActive && <CheckCircle className="w-4 h-4 text-white" />}
                       </div>
                     </div>
                   );
                 })}
              </div>
              <p className="text-[10px] lg:text-[11px] text-slate-500 lg:text-center italic opacity-80 leading-relaxed">Hãy duy trì thói quen luyện tập mỗi ngày cùng YogAI.</p>
           </div>

           {/* AI Recommended Section */}
           <div className="p-5 lg:p-7 bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 flex flex-col gap-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                 <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-slate-300" />
                 </div>
                 <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">AI Đề xuất</span>
              </div>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-sky-300 hover:bg-white transition-all shadow-sm">
                    <p className="text-sm font-black text-slate-700 italic line-clamp-1 group-hover:text-sky-600 transition-colors leading-none">Vinyasa Flow Phục hồi</p>
                    <div className="flex items-center gap-2 mt-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                       <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest opacity-60">Match 95%</span>
                    </div>
                 </div>
                 <Link href="/student/explore">
                    <Button variant="outline" className="w-full h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all">Tất cả bài tập</Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
