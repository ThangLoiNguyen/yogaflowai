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
    { label: "Đã học", value: completedCount?.toString() || "0", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Streak", value: `${streakData?.current_streak || 0}`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Rating TB", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const hour = (new Date().getUTCHours() + 7) % 24;
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6">
      {/* Top Section (Fixed) */}
      <div className="shrink-0 space-y-4">
        {!quiz && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-4 rounded-3xl animate-in fade-in slide-in-from-top-3 shadow-sm">
             <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
             <div className="flex-1">
                <h4 className="text-amber-900 font-bold mb-0.5">Hoàn thành Onboarding</h4>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest">AI cần dữ liệu để thiết kế lộ trình</p>
             </div>
             <Link href="/register/quiz"><Button className="bg-amber-600 hover:bg-amber-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl px-6 h-9">Làm ngay</Button></Link>
          </div>
        )}

        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-display">{greeting}, <span className="text-indigo-600 italic">{userData?.full_name?.split(" ").pop() || "bạn"}!</span></h1>
            <p className="text-xs text-slate-400">Bạn đã sẵn sàng cho buổi tập hôm nay chưa?</p>
          </div>
          <div className="flex gap-2">
             <StudentEditDialog mode="profile" />
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-[2rem] bg-white border border-slate-50 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
               <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
               </div>
               <div className="min-w-0">
                  <div className="text-lg font-black text-slate-700 leading-none mb-0.5 truncate">{stat.value}</div>
                  <div className="text-[9px] font-black uppercase text-slate-300 tracking-widest truncate">{stat.label}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area (Scrollable internally) */}
      <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-6">
        {/* Left: Classes & Roadmap */}
        <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white rounded-[2.5rem] border border-slate-50 shadow-sm">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-indigo-50/10">
              <h3 className="text-base font-display">Lịch học & Lộ trình</h3>
              <Link href="/student/classes" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Xem tất cả</Link>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Next Session Hero in list */}
              {nextSession ? (
                <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] text-white relative overflow-hidden group">
                   <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${nextSession.status === 'live' ? 'bg-red-400 animate-pulse' : 'bg-indigo-300'}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{nextSession.status === 'live' ? 'Đang diễn ra' : 'Sắp diễn ra'}</span>
                         </div>
                         <h2 className="text-xl font-display leading-tight">{nextSession.title}</h2>
                         <div className="flex items-center gap-3 text-xs opacity-90">
                            <Calendar className="w-4 h-4" />
                            {new Date(nextSession.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {new Date(nextSession.scheduled_at).toLocaleDateString('vi-VN')}
                         </div>
                      </div>
                      <Link href={`/student/session/${nextSession.id}`}>
                         <Button className={`h-12 px-8 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs group transition-all ${nextSession.status === 'live' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white text-indigo-600 hover:bg-slate-50'}`}>
                           {nextSession.status === 'live' ? 'Vào lớp ngay' : 'Chi tiết buổi học'}
                           <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                         </Button>
                      </Link>
                   </div>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-indigo-50/5">
                   <PlayCircle className="w-10 h-10 text-indigo-100 mx-auto mb-3" />
                   <p className="text-sm font-medium text-slate-400">Chưa có lịch học mới nào được lên.</p>
                   <Link href="/student/explore" className="mt-4 block"><Button variant="outline" className="rounded-xl border-indigo-100 text-indigo-600">Khám phá các khóa học</Button></Link>
                </div>
              )}

              {/* List of upcoming bookings */}
              <div className="space-y-4 pt-4">
                 <h4 className="text-xs font-black uppercase text-slate-300 tracking-widest px-2">Các buổi học đã đặt</h4>
                 {upcomingBookings && upcomingBookings.length > 0 ? upcomingBookings.map((b, i) => (
                   <div key={i} className="p-4 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white border border-slate-50 flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <div className="text-xs font-black text-slate-700">{new Date((b.class_sessions as any).scheduled_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                         </div>
                         <div>
                            <div className="font-bold text-slate-700 text-sm">{(b.class_sessions as any).title}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">GV: {(b.class_sessions as any).users?.full_name}</div>
                         </div>
                      </div>
                      <Link href={`/student/session/${(b.class_sessions as any).id}`}>
                         <Button variant="ghost" className="h-9 w-9 rounded-xl p-0 text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50"><ChevronRight className="w-5 h-5" /></Button>
                      </Link>
                   </div>
                 )) : <p className="text-center text-[10px] text-slate-300 uppercase italic">Không còn lịch học nào khác</p>}
              </div>
           </div>
        </div>

        {/* Right: Sidebar widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1 custom-scrollbar">
           {/* Streak Widget */}
           <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden shrink-0">
              <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-indigo-500/10 rounded-full blur-[40px]" />
              <div className="flex items-center gap-3 mb-4 text-orange-400">
                 <Flame className="w-6 h-6 fill-orange-400" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em]">Streak {streakData?.current_streak || 0} Ngày</span>
              </div>
              <div className="flex justify-between items-center gap-1 mb-6">
                 {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
                   const todayIdx = (new Date().getDay() + 6) % 7;
                   const isActive = idx <= todayIdx && (streakData?.current_streak || 0) > 0;
                   return (
                     <div key={day} className="flex flex-col items-center gap-3 flex-1">
                       <span className="text-[8px] font-black text-white/30 uppercase">{day}</span>
                       <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-orange-500 shadow-lg scale-110' : 'bg-white/10'}`}>
                          {isActive && <CheckCircle className="w-4 h-4 text-white" />}
                       </div>
                     </div>
                   );
                 })}
              </div>
              <p className="text-[10px] text-white/50 text-center leading-relaxed font-bold uppercase tracking-widest">Duy trì thói quen mỗi ngày!</p>
           </div>

           {/* AI Recommendations Widget */}
           <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center"><Sparkles className="w-5 h-5 text-indigo-600" /></div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">AI gợi ý tập luyện</h4>
                    <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest opacity-60">Theo dữ liệu của bạn</p>
                 </div>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4 border border-indigo-100 border-dashed rounded-3xl bg-white/50">
                 <p className="text-xs text-indigo-900/60 italic mb-4">"Nâng cao sự dẻo dai với bài tập Chuỗi Chào Mặt Trời sáng nay nhé!"</p>
                 <Link href="/student/explore" className="w-full">
                    <Button variant="outline" className="w-full h-10 rounded-xl border-indigo-200 text-indigo-600 font-black uppercase text-[9px] tracking-widest bg-white hover:bg-indigo-600 hover:text-white transition-all">Xem gợi ý lớp học</Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
