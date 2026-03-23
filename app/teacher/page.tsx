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
    <div className="flex flex-col min-h-screen lg:h-[calc(100vh-10rem)] overflow-y-auto lg:overflow-hidden gap-6 lg:gap-8 pb-24 lg:pb-0 px-1">
      <div className="shrink-0 space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-2 lg:px-0">
          <div className="space-y-1">
            <h1 className="txt-title text-xl lg:text-2xl font-bold border-none italic leading-tight">
              Chào buổi sáng, <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{userData?.full_name?.split(" ").pop()}!</span>
            </h1>
            <p className="txt-content opacity-60 text-[10px] lg:text-sm">Bạn có {stats[0].value} lớp học và {stats[1].value} cảnh báo từ AI.</p>
          </div>
          <div className="flex gap-2">
            <TeacherEditDialog />
            <Link href="/teacher/classes/new" className="flex-1 sm:flex-none">
              <Button className="w-full h-10 lg:h-11 px-6 rounded-2xl bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-100 txt-action font-bold text-xs lg:text-sm">
                <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" /> Tạo lớp mới
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 px-2 lg:px-0">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 lg:p-5 rounded-2xl lg:rounded-[1.5rem] bg-white border border-slate-50 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all duration-300">
               <div className={`w-11 h-11 lg:w-14 lg:h-14 rounded-2xl lg:rounded-3xl ${stat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 lg:w-7 lg:h-7 ${stat.color}`} />
               </div>
               <div className="min-w-0">
                  <div className="txt-title text-xl lg:text-2xl leading-none mb-1 font-bold text-slate-800">{stat.value}</div>
                  <div className="txt-action text-slate-400 text-[9px] lg:text-[10px] uppercase tracking-widest font-medium">{stat.label}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 flex flex-col overflow-hidden bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-50 shadow-sm">
           <div className="p-5 lg:p-6 border-b border-slate-50 flex items-center justify-between bg-emerald-50/10">
              <h3 className="txt-title text-sm lg:text-base">Nhật ký dạy học hôm nay</h3>
              <Link href="/teacher/classes" className="txt-action text-xs text-emerald-600 hover:underline">Xem lịch dạy</Link>
           </div>
           <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 custom-scrollbar">
              {todaySessions && todaySessions.length > 0 ? todaySessions.map((s, i) => (
                <div key={i} className={`p-3 lg:p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center gap-4 group ${s.status === 'live' ? 'border-emerald-500 bg-emerald-50/10 shadow-lg' : 'border-slate-50 bg-white hover:border-emerald-200 shadow-sm'}`}>
                   <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                         <div className="txt-content text-sm lg:text-base font-black text-slate-700">{new Date(s.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                         <div className="txt-action text-slate-400 opacity-50 block lg:hidden" style={{ fontSize: '6px' }}>START</div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-0.5">
                           <h4 className="txt-content font-bold text-slate-700 truncate text-sm lg:text-base">{s.title}</h4>
                           {s.status === 'live' && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 txt-action animate-pulse" style={{ fontSize: '7px' }}>Live</span>}
                         </div>
                         <p className="txt-action text-[10px] lg:text-xs text-slate-400 opacity-80 leading-none">{(s as any).bookings?.length || 0} Học viên đặt chỗ</p>
                      </div>
                   </div>
                   <div className="shrink-0 w-full sm:w-auto">
                      <SessionActions sessionId={s.id} courseId={s.course_id} status={s.status} />
                   </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                   <Video className="w-10 h-10 mb-2 opacity-10" />
                   <p className="txt-content text-xs italic opacity-50">Hôm nay chưa có lịch dạy Yoga.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
