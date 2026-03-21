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
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TeacherOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();

  // Mock data for display based on spec
  const stats = [
    { label: "Lớp hôm nay", value: "3", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Tổng học viên", value: "142", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "AI Alerts", value: "5", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Rating TB", value: "5.0", icon: Sparkles, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const sessions = [
    { time: "07:00", title: "Morning Vinyasa Flow", students: 12, status: "completed" },
    { time: "18:30", title: "Hatha for Beginners", students: 8, status: "live" },
    { time: "20:00", title: "Deep Stretch & Breath", students: 15, status: "upcoming" },
  ];

  const aiInsights = [
    { student: "Minh Anh", change: "Fatigue level increased (+2)", suggestion: "Reduce intensity for next 2 sessions.", status: "pending" },
    { student: "Quoc Huy", change: "Flexibility milestone reached", suggestion: "Suggest Advanced Vinyasa track.", status: "approved" },
    { student: "Thu Trang", change: "Missing 3 sessions", suggestion: "Send motivational nudge & check-in.", status: "pending" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Teacher Dashboard active</span>
          </div>
          <h1 className="text-4xl">Chào, GV. <span className="font-medium italic text-emerald-600">{userData?.full_name?.split(" ").pop() || "Linh"}!</span></h1>
          <p className="text-[var(--text-secondary)] mt-2">Hôm nay bạn có 3 lớp học và 5 thông báo AI cần xử lý.</p>
        </div>
        <Link href="/teacher/classes/new">
          <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-14 px-8 rounded-full">
            <Plus className="w-5 h-5 mr-2" /> Tạo lớp học mới
          </Button>
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 rounded-[var(--r-lg)] bg-white border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
             <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
             </div>
             <div className="stats-value text-3xl mb-1">{stat.value}</div>
             <div className="label-mono uppercase text-[10px] text-[var(--text-muted)] tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Sessions */}
        <div className="lg:col-span-7 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-display">Lịch dạy hôm nay</h3>
              <Link href="/teacher/classes" className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
                 Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
           <div className="space-y-4">
              {sessions.map((s, i) => (
                <div key={i} className={`p-6 bg-white border rounded-[var(--r-lg)] flex items-center gap-6 group transition-all hover:border-emerald-300 ${s.status === 'live' ? 'border-emerald-500 shadow-md ring-1 ring-emerald-50' : 'border-[var(--border)] shadow-sm'}`}>
                   <div className="w-20 text-center border-r border-[var(--bg-muted)] pr-6">
                      <div className="text-lg font-bold text-[var(--text-primary)] leading-none mb-1">{s.time}</div>
                      <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Time</div>
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg">{s.title}</h4>
                        {s.status === 'live' && (
                           <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase animate-pulse">Live</span>
                        )}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">{s.students} học viên đã đặt chỗ</div>
                   </div>
                   <Button variant={s.status === 'live' ? 'default' : 'outline'} className={`h-12 rounded-full px-6 font-medium ${s.status === 'live' ? 'bg-emerald-600' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}>
                      {s.status === 'live' ? 'Vào lớp dạy' : s.status === 'completed' ? 'Xem báo cáo' : 'Chi tiết'}
                   </Button>
                </div>
              ))}
           </div>
        </div>

        {/* Right: AI Insights */}
        <div className="lg:col-span-5 space-y-8">
           <div className="flex items-center gap-2 px-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-2xl font-display">AI Insights Feed</h3>
           </div>
           <div className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div key={i} className="p-6 bg-white border border-[var(--border)] rounded-[var(--r-lg)] shadow-sm hover:shadow-md transition-all relative group">
                   {insight.status === 'pending' && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500" />
                   )}
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 ring-2 ring-white">
                         {insight.student.charAt(0)}
                      </div>
                      <div>
                         <div className="text-sm font-bold text-[var(--text-primary)]">{insight.student}</div>
                         <div className={`text-[10px] font-bold uppercase ${insight.change.includes('+') ? 'text-red-500' : 'text-emerald-500'}`}>{insight.change}</div>
                      </div>
                   </div>
                   <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 italic">
                      "{insight.suggestion}"
                   </p>
                   <div className="flex gap-2">
                      <Button size="sm" className="h-9 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase rounded-lg">Duyệt gợi ý</Button>
                      <Button size="sm" variant="outline" className="h-9 px-3 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-lg">
                         <X className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full h-12 rounded-xl text-[var(--text-hint)] hover:text-indigo-600 font-medium text-xs">
                 Xem dòng thời gian đầy đủ
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

// Fixed missing icons
import { Plus, X } from "lucide-react";
