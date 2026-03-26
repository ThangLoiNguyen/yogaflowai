import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
   CheckCircle, Flame, Star, Calendar, AlertCircle, ArrowRight, Sparkles, Map, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StudentEditDialog } from "@/components/profile/student-edit-dialog";
import { cn } from "@/lib/utils";

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

   // AI Recommendation Logic (Top 2 for compact view)
   const { data: allCourses } = await supabase.from("courses").select("id, title, description, goals, level, intensity, users!teacher_id(avatar_url, full_name)").limit(20);
   
   let recommendedCourses: any[] = [];
   if (allCourses && allCourses.length > 0) {
      if (quiz) {
         const scored = allCourses.map(c => {
            let score = 0;
            if (Number(quiz.experience_level) === Number(c.level)) score += 40;
            if (Array.isArray(quiz.goals) && Array.isArray(c.goals)) {
               const common = quiz.goals.filter(g => c.goals?.includes(g));
               score += common.length * 20;
            }
            return { ...c, ai_score: score };
         }).sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
         recommendedCourses = scored.slice(0, 2);
      } else {
         recommendedCourses = allCourses.slice(0, 2);
      }
   }

   // Roadmap Logic
   let roadmapSteps: any[] = [];
   const { data: enrollment } = await supabase.from("bookings").select("class_sessions(course_id)").eq("student_id", user.id).limit(1).single();
   if (enrollment) {
      const courseId = (enrollment.class_sessions as any).course_id;
      const { data: cSessions } = await supabase.from("class_sessions").select("id, title, status, scheduled_at").eq("course_id", courseId).order("scheduled_at", { ascending: true }).limit(4);
      if (cSessions) {
         roadmapSteps = cSessions;
      }
   }

   const stats = [
      { label: "Đã học", value: completedCount?.toString() || "0", icon: CheckCircle, color: "text-sky-500", bg: "bg-sky-50" },
      { label: "Streak", value: `${streakData?.current_streak || 0}`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
      { label: "Rating TB", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
   ];

   const hour = (new Date().getUTCHours() + 7) % 24;
   const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

   return (
      <div className="flex flex-col min-h-screen lg:h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-hidden gap-6 lg:gap-8 pb-24 lg:pb-0 px-2 lg:px-1">
         <div className="shrink-0 space-y-4">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-1">
               <div className="space-y-1">
                  <h1 className="txt-title text-xl lg:text-3xl font-bold border-none italic leading-tight">
                     {greeting}, <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">{userData?.full_name?.split(" ").pop() || "bạn"}!</span>
                  </h1>
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

         <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="p-5 lg:p-6 border-b border-slate-100 flex items-center justify-between bg-sky-50/10">
                  <h3 className="txt-title text-sm lg:text-base text-slate-900 border-none uppercase tracking-tight">Kế hoạch rèn luyện</h3>
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

                  <div className="pt-4 space-y-4">
                     <h4 className="txt-action text-[9px] text-slate-300 uppercase tracking-widest px-1">Lộ trình học tập</h4>
                     {roadmapSteps.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           {roadmapSteps.map((step, i) => (
                              <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/20 flex items-center gap-3">
                                 <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-300'}`}>
                                    {step.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-slate-700 truncate uppercase tracking-tight">{step.title}</p>
                                    <p className="text-[9px] text-slate-400 font-mono italic">{new Date(step.scheduled_at).toLocaleDateString('vi-VN')}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="p-8 text-center border border-dashed border-slate-100 rounded-3xl">
                           <Map className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                           <p className="text-[10px] text-slate-400 italic">Hãy đăng ký khóa học để thấy lộ trình rèn luyện cá nhân.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 shrink-0">
               <div className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-7 text-white shadow-xl flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                     <Sparkles className="w-4 h-4 text-sky-400" />
                     <h4 className="txt-action text-[10px] text-sky-400 uppercase tracking-widest font-black">AI Gợi ý cho hôm nay</h4>
                  </div>

                  <div className="space-y-4 relative z-10">
                     {recommendedCourses.length > 0 ? (
                        recommendedCourses.map((course, idx) => {
                           return (
                              <Link key={course.id} href={`/student/course/${course.id}`}>
                                 <div className={cn(
                                    "p-3 my-1 rounded-2xl border transition-all cursor-pointer group/item flex items-center gap-4",
                                    idx === 0 
                                       ? "bg-white/10 border-sky-500/30 hover:bg-sky-500 hover:border-sky-400" 
                                       : "bg-white/5 border-white/5 hover:bg-white hover:text-slate-900"
                                 )}>
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0 flex items-center justify-center p-2 overflow-hidden border border-white/5">
                                       <p className="text-[7px] font-medium italic text-white/40 group-hover/item:text-white line-clamp-3 leading-tight opacity-80">{course.description || "Yoga Flow Course"}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center justify-between mb-1">
                                          <span className={cn(
                                             "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                             idx === 0 ? "bg-sky-500 text-white group-hover/item:bg-white group-hover/item:text-sky-600" : "text-white/40 group-hover/item:text-slate-400"
                                          )}>
                                             {idx === 0 ? "Best Match" : `Match ${Math.min(99, 80 + (course.ai_score || 0))}%`}
                                          </span>
                                       </div>
                                       <p className="text-[12px] font-bold leading-tight line-clamp-1 truncate uppercase tracking-tight italic">{course.title}</p>
                                    </div>
                                 </div>
                              </Link>
                           );
                        })
                     ) : (
                        <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                           <p className="text-[10px] text-slate-500 italic">Cần dữ liệu Onboarding</p>
                        </div>
                     )}
                  </div>

                  <Link href="/student/explore" className="mt-6 relative z-10">
                     <Button className="w-full h-11 bg-sky-500 text-white hover:bg-white hover:text-slate-900 rounded-xl txt-action text-[10px] font-black shadow-lg shadow-sky-900/20 border-none transition-all">Khám phá lộ trình</Button>
                  </Link>
               </div>
               
               {!quiz && (
                  <div className="p-5 bg-gradient-to-br from-indigo-50 to-sky-50 border border-sky-100 rounded-[2rem] shadow-sm">
                     <p className="text-[11px] text-indigo-900 font-bold italic text-center mb-4 leading-tight">Hoàn tất Onboarding để AI đề xuất bài tập chính xác!</p>
                     <Link href="/register/quiz">
                        <Button className="w-full h-10 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black shadow-md border-none">Bắt đầu khảo sát</Button>
                     </Link>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
