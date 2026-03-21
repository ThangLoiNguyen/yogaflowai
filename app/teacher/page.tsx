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

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const { data: todaySessions } = await supabase.from("class_sessions").select("*, bookings(id)").eq("teacher_id", user.id).gte("scheduled_at", today.toISOString()).order("scheduled_at", { ascending: true });
  
  const { count: pendingAlerts } = await supabase.from("ai_suggestions").select("id", { count: 'exact', head: true }).eq("teacher_id", user.id).eq("teacher_decision", "pending");

  const stats = [
    { label: "Lớp hôm nay", value: todaySessions?.length.toString() || "0", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "AI Alerts", value: pendingAlerts?.toString() || "0", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6">
      <div className="shrink-0 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="txt-title">Chào buổi sáng, <span className="text-emerald-600 italic">{userData?.full_name?.split(" ").pop()}!</span></h1>
            <p className="txt-content opacity-70">Bạn có {stats[0].value} lớp học và {stats[1].value} cảnh báo khẩn cấp từ AI.</p>
          </div>
          <div className="flex gap-2">
            <TeacherEditDialog />
            <Link href="/teacher/classes/new">
              <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-lg txt-action">
                <Plus className="w-4 h-4 mr-2" /> Tạo lớp mới
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-[2rem] bg-white border border-slate-50 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
               <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
               </div>
               <div>
                  <div className="txt-title leading-none mb-1 text-slate-700">{stat.value}</div>
                  <div className="txt-action text-slate-300">{stat.label}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 flex flex-col overflow-hidden bg-white rounded-[2.5rem] border border-slate-50 shadow-sm">
           <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-emerald-50/10">
              <h3 className="txt-title">Nhật ký lớp học hôm nay</h3>
              <Link href="/teacher/classes" className="txt-action text-emerald-600 hover:underline">Tất cả lịch dạy</Link>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {todaySessions && todaySessions.length > 0 ? todaySessions.map((s, i) => (
                <div key={i} className={`p-4 rounded-3xl border transition-all flex items-center gap-4 group ${s.status === 'live' ? 'border-emerald-500 bg-emerald-50/10 shadow-lg' : 'border-slate-50 bg-white hover:border-emerald-200 shadow-sm'}`}>
                   <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <div className="txt-content font-black text-slate-700">{new Date(s.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="txt-action text-slate-400 opacity-50" style={{ fontSize: '7px' }}>START</div>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="txt-content font-bold text-slate-700 truncate">{s.title}</h4>
                        {s.status === 'live' && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 txt-action animate-pulse" style={{ fontSize: '7px' }}>Live</span>}
                      </div>
                      <p className="txt-action text-slate-400 opacity-80 leading-none">{(s as any).bookings?.length || 0} Học viên đặt chỗ</p>
                   </div>
                   <div className="shrink-0 min-w-[140px]">
                      <SessionActions sessionId={s.id} courseId={s.course_id} status={s.status} />
                   </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-300">
                   <Video className="w-12 h-12 mb-2 opacity-10" />
                   <p className="txt-content italic opacity-50">Hôm nay chưa có lịch dạy Yoga.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
