import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  CheckCircle, 
  Flame, 
  Map, 
  Star, 
  Calendar, 
  ChevronRight, 
  PlayCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch student info
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: quiz } = await supabase.from("onboarding_quiz").select("*").eq("student_id", user.id).single();
  
  if (!quiz && userData?.role === "student") {
    // Should have filled quiz, maybe redirect or show banner
  }

  // Mock data for display based on spec
  const stats = [
    { label: "Buổi đã học", value: "12", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Streak hiện tại", value: "5", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "% Lộ trình", value: "45%", icon: Map, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Rating GV", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const roadmapSteps = [
    { title: "Cơ bản: Thở & Tư thế", status: "completed", date: "Đã học 12/03" },
    { title: "Sức mạnh cốt lõi", status: "active", date: "Hôm nay" },
    { title: "Yoga Vinyasa nâng cao", status: "upcoming", date: "24/03" },
    { title: "Thiền & Phục hồi", status: "upcoming", date: "Tới đây" },
  ];

  const upcomingSessions = [
    { teacher: "Linh Nguyen", time: "19:00 Hôm nay", title: "Vinyasa Core Flow" },
    { teacher: "Minh Tu", time: "07:00 Sáng mai", title: "Ashtanga Basic" },
  ];

  return (
    <div className="space-y-12">
      {/* Top Banner for Pending Quiz */}
      {!quiz && (
        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 p-6 rounded-[var(--r-md)] animate-in fade-in slide-in-from-top-4">
           <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
           <div className="flex-1">
              <h4 className="text-amber-900 font-bold mb-1 underline decoration-amber-300">Hoàn thành Quiz Onboarding</h4>
              <p className="text-sm text-amber-700">AI cần thêm thông tin để thiết kế lộ trình cá nhân cho bạn.</p>
           </div>
           <Link href="/register/quiz">
             <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full">
               Làm Quiz ngay (3p)
             </Button>
           </Link>
        </div>
      )}

      {/* Greeting */}
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
           <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Student Space active</span>
        </div>
        <h1 className="text-4xl text-[var(--text-primary)]">
          Chào buổi sáng, <span className="font-medium italic text-[var(--accent)]">{userData?.full_name?.split(" ").pop() || "Minh"}!</span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Hôm nay bạn cảm thấy thế nào? Hãy bắt đầu luyện tập thôi.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 rounded-[var(--r-lg)] bg-white border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
             <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-[10px] text-[var(--text-hint)] font-mono uppercase tracking-widest mt-1">Status</div>
             </div>
             <div className="stats-value text-3xl mb-1">{stat.value}</div>
             <div className="label-mono opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Next Session Hero */}
      <section className="bg-white border border-[var(--border)] rounded-[var(--r-xl)] p-10 shadow-sky overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-[80px] -z-10 transition-transform group-hover:scale-125 duration-1000" />
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-md">
               <div className="flex items-center gap-2 mb-6">
                  <PlayCircle className="w-5 h-5 text-[var(--accent)]" />
                  <span className="label-mono text-[var(--accent)] text-[11px]">Buổi học kế tiếp</span>
               </div>
               <h2 className="text-3xl mb-4">Vinyasa Core & Balance</h2>
               <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                  Buổi tập này được AI điều chỉnh với cường độ <span className="font-bold text-[var(--text-primary)]">Moderate</span> để giúp bạn cải thiện độ mở khớp hông theo mục tiêu.
               </p>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-white">
                        <div className="w-full h-full bg-[var(--accent-tint)] flex items-center justify-center font-bold text-[var(--accent)]">L</div>
                     </div>
                     <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] leading-none">Linh Nguyen</div>
                        <div className="text-[10px] label-mono uppercase mt-1">Giảng viên</div>
                     </div>
                  </div>
                  <div className="h-10 w-[1px] bg-[var(--border)]" />
                  <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-medium">
                     <Calendar className="w-4 h-4 text-[var(--text-hint)]" />
                     19:00 · Hôm nay
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[200px]">
               <Button className="btn-primary h-14 text-base px-8 group">
                  Vào lớp học ngay
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Button>
               <Button variant="outline" className="h-14 rounded-full border-[var(--border-medium)] text-[var(--text-primary)] font-medium bg-white/50 backdrop-blur-sm">
                  Dời lịch học
               </Button>
            </div>
         </div>
      </section>

      {/* Grid: Roadmap & Sidebar */}
      <div className="grid lg:grid-cols-12 gap-12 items-start">
         {/* Left: Roadmap */}
         <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-2xl">Lộ trình rèn luyện</h3>
               <Link href="/student/roadmap" className="text-sm text-[var(--accent)] font-medium hover:underline flex items-center gap-1">
                  Xem chi tiết <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="bg-white border border-[var(--border)] rounded-[var(--r-lg)] p-4 shadow-sm overflow-hidden">
               <div className="space-y-2">
                 {roadmapSteps.map((step, i) => (
                   <div key={i} className={`p-6 flex items-center gap-6 rounded-[var(--r-md)] transition-colors ${step.status === 'active' ? 'bg-[var(--accent-tint)]/30' : 'hover:bg-[var(--bg-base)]'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-[var(--accent)]' : step.status === 'active' ? 'bg-white border-2 border-[var(--accent)]' : 'bg-[var(--bg-muted)] border-2 border-[var(--border)]'}`}>
                         {step.status === 'completed' ? <CheckCircle className="w-6 h-6 text-white" /> : <div className={`w-3 h-3 rounded-full ${step.status === 'active' ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--text-hint)]'}`} />}
                      </div>
                      <div className="flex-1">
                         <div className={`font-bold text-lg leading-none mb-1 ${step.status === 'upcoming' ? 'text-[var(--text-hint)]' : 'text-[var(--text-primary)]'}`}>{step.title}</div>
                         <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">{step.date}</div>
                      </div>
                      {step.status === 'active' && <Button size="sm" className="h-9 px-4 rounded-full bg-[var(--accent)] text-white font-bold text-[10px] uppercase">Học tiếp</Button>}
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="lg:col-span-4 space-y-10">
            {/* Streak Calendar */}
            <div className="p-8 bg-slate-900 rounded-[var(--r-lg)] text-white shadow-lg overflow-hidden relative">
               <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/5 rounded-full blur-[40px]" />
               <div className="flex items-center gap-2 mb-6 text-orange-400">
                  <Flame className="w-5 h-5 fill-orange-400" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest">Streak 5 days</span>
               </div>
               <div className="flex justify-between items-center mb-8">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                    <div key={day} className="flex flex-col items-center gap-3">
                       <span className="text-[10px] font-mono text-white/40 uppercase">{day}</span>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${['T2', 'T3', 'T4', 'T5', 'T6'].includes(day) ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`}>
                          {['T2', 'T3', 'T4', 'T5', 'T6'].includes(day) && <CheckCircle className="w-5 h-5 text-white" />}
                       </div>
                    </div>
                  ))}
               </div>
               <p className="text-xs text-white/60 text-center leading-relaxed">
                  Luyện tập thêm một buổi hôm nay để duy trì chuỗi 6 ngày!
               </p>
            </div>

            {/* Upcoming List */}
            <div className="space-y-6">
               <h4 className="text-xl font-bold px-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--accent)]" /> 
                  Lịch học đã đặt
               </h4>
               <div className="space-y-4">
                  {upcomingSessions.map((session, i) => (
                    <div key={i} className="p-6 rounded-[var(--r-lg)] bg-white border border-[var(--border)] shadow-sm hover:border-[var(--accent-light)] transition-all">
                       <div className="font-bold text-[var(--text-primary)] mb-1">{session.title}</div>
                       <div className="text-xs text-[var(--text-secondary)] mb-4">GV: {session.teacher}</div>
                       <div className="flex items-center justify-between pt-4 border-t border-[var(--bg-muted)]">
                          <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">{session.time}</div>
                          <Link href="#" className="text-[10px] font-bold text-[var(--accent)] uppercase hover:underline">Chi tiết</Link>
                       </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full h-12 rounded-xl text-[var(--text-hint)] hover:text-[var(--accent)] font-medium text-xs">
                     Xem toàn bộ lịch học
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
