import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Users, Video, Sparkles, TrendingUp, Clock, ChevronRight, CheckCircle, AlertTriangle, Plus, X
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
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const { data: todaySessions } = await supabase.from("class_sessions").select("*, bookings(id)").eq("teacher_id", user.id).gte("scheduled_at", today.toISOString()).order("scheduled_at", { ascending: true });
  
  // 3. Fetch AI Alerts
  const { count: pendingAlerts } = await supabase.from("ai_suggestions").select("id", { count: 'exact', head: true }).eq("teacher_id", user.id).eq("teacher_decision", "pending");
  const { data: insightsData } = await supabase.from("ai_suggestions").select("id, suggestions, teacher_decision, student_id, users!student_id (full_name)").eq("teacher_id", user.id).eq("teacher_decision", "pending").order("created_at", { ascending: false }).limit(3);

  const stats = [
    { label: "Lớp hôm nay", value: todaySessions?.length.toString() || "0", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "AI Alerts", value: pendingAlerts?.toString() || "0", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6">
      {/* Top Section: Greeting & Stats (Fixed) */}
      <div className="shrink-0 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display">Chào buổi sáng, <span className="text-emerald-600 italic">{userData?.full_name?.split(" ").pop()}!</span></h1>
            <p className="text-xs text-slate-400">Bạn có {stats[0].value} lớp học và {stats[1].value} cảnh báo khẩn cấp từ AI.</p>
          </div>
          <div className="flex gap-2">
            <TeacherEditDialog />
            <Link href="/teacher/classes/new">
              <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-lg font-bold uppercase tracking-widest text-[10px]">
                <Plus className="w-4 h-4 mr-2" /> Tạo lớp mới
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-[2rem] bg-white border border-slate-50 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
               <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
               </div>
               <div>
                  <div className="text-2xl font-black text-slate-700 leading-none mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{stat.label}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (Scrollable internally) */}
      <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-6">
        {/* Left Column: List of Sessions */}
        <div className="lg:col-span-12 flex flex-col overflow-hidden bg-white rounded-[2.5rem] border border-slate-50 shadow-sm">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-emerald-50/10">
              <h3 className="text-base font-display">Nhật ký lớp học hôm nay</h3>
              <Link href="/teacher/classes" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Tất cả lịch dạy</Link>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {todaySessions && todaySessions.length > 0 ? todaySessions.map((s, i) => (
                <div key={i} className={`p-4 rounded-3xl border transition-all flex items-center gap-4 group ${s.status === 'live' ? 'border-emerald-500 bg-emerald-50/10 shadow-lg' : 'border-slate-50 bg-white hover:border-emerald-200 shadow-sm'}`}>
                   <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <div className="text-lg font-black text-slate-700">{new Date(s.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="text-[7px] font-black uppercase text-slate-400">START AT</div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-700 truncate">{s.title}</h4>
                        {s.status === 'live' && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[8px] font-black uppercase animate-pulse">Live</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{(s as any).bookings?.length || 0} Học viên đặt chỗ</p>
                   </div>
                   <div className="shrink-0 min-w-[140px]">
                      <SessionActions sessionId={s.id} courseId={s.course_id} status={s.status} />
                   </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-300">
                   <Video className="w-12 h-12 mb-2 opacity-10" />
                   <p className="text-xs italic">Hôm nay chưa có lịch dạy Yoga.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
