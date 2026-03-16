"use client";

import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sparkles, TrendingUp, Users, ArrowRight, BookOpen, Star, AlertCircle, PlusCircle, LayoutGrid } from "lucide-react";
import {
  mockTeacherAnalytics,
  mockStudents,
  mockClassesPerformance,
} from "@/lib/mock-data";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10 animate-soft-fade">

          {/* ─── Header ─── */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-1.5 text-left">
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 mb-2 rounded-full">
                <LayoutGrid className="w-3 h-3 mr-2 inline" /> Quản lý trung tâm
              </Badge>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
                Sức khỏe học viện
              </h1>
              <p className="text-slate-400 font-medium max-w-lg">
                Theo dõi tiến độ, hiệu suất và tối ưu hóa vận hành dựa trên phân tích AI.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
               <Button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-100 transition-transform active:scale-95 border-none">
                <PlusCircle className="w-4 h-4 mr-2" /> Tạo lớp học mới
              </Button>
            </div>
          </header>

          {/* ─── Metrics ─── */}
          <TeacherAnalytics data={mockTeacherAnalytics} />

          {/* ─── AI Copilot Banner ─── */}
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Sparkles className="w-40 h-40 text-indigo-600" />
            </div>
            
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">AI Copilot Insights</span>
                </div>
                <div className="space-y-3">
                   <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                        Học viên <span className="text-slate-900">Jordan Rivera</span> đã vượt chuẩn chuyên môn 3 buổi liên tiếp. AI đề xuất chuyển sang lớp Trung cấp để tối ưu lộ trình.
                      </p>
                   </div>
                   <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
                        Phân tích lưu lượng: Thứ 5 có tỷ lệ lấp đầy thấp nhất (45%). Hãy cân nhắc đổi sang lớp <span className="text-slate-900">Yin Yoga</span> để thu hút thêm học viên.
                      </p>
                   </div>
                </div>
              </div>
              <Button variant="outline" className="h-16 px-10 border-slate-100 bg-white text-slate-900 hover:bg-slate-50 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shrink-0">
                Xác nhận lộ trình <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* ─── Main Grid ─── */}
          <div className="grid gap-10 lg:grid-cols-12 items-start">

            {/* Student Roster */}
            <Card className="lg:col-span-8 rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
              <CardHeader className="px-8 pt-10 pb-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-sky-500" />
                      <span className="text-2xl font-black text-slate-900">Học viên tiêu biểu</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-9">Tổng cộng {mockStudents.length} đang hoạt động</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                <div className="grid grid-cols-4 gap-4 pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                  <span>Học viên</span>
                  <span>Trình độ</span>
                  <span>Tập trung</span>
                  <span className="text-right">Chuyên cần</span>
                </div>
                <div className="space-y-4 mt-6">
                  {mockStudents.map((student) => {
                    const attendanceColor = student.attendance >= 85 ? "text-emerald-500" : student.attendance >= 70 ? "text-amber-500" : "text-rose-500";
                    return (
                      <div
                        key={student.id}
                        className="grid grid-cols-4 items-center gap-4 group cursor-pointer p-4 rounded-[1.5rem] border border-transparent hover:border-slate-50 hover:bg-slate-50/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                              {student.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-900">{student.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{student.recentClass}</p>
                           </div>
                        </div>
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{student.level}</span>
                        <span className="text-[11px] font-bold text-slate-400">{student.focus}</span>
                        <div className="text-right">
                          <span className={`text-sm font-black ${attendanceColor}`}>{student.attendance}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" className="w-full h-14 bg-slate-50 text-slate-400 hover:bg-slate-100 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl mt-6">
                   Xem toàn bộ danh sách
                </Button>
              </CardContent>
            </Card>

            {/* Right Column Progress */}
            <div className="lg:col-span-4 space-y-10">
              {/* Class Performance */}
              <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                <CardHeader className="px-8 pt-10 pb-6">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                      <span className="text-xl font-black text-slate-900">Hiệu suất lớp</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-10 space-y-6">
                  {mockClassesPerformance.map((cls) => {
                    const fillColor = cls.fill >= 85 ? "bg-emerald-500" : cls.fill >= 70 ? "bg-indigo-500" : "bg-amber-500";
                    return (
                      <div key={cls.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-slate-900">{cls.name}</p>
                          <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[10px]">
                            {cls.occurrences} LỚP/TUẦN
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tỉ lệ lấp đầy</span>
                            <span className="text-xs font-black text-slate-900">{cls.fill}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50">
                            <div className={`h-full rounded-full ${fillColor} transition-all duration-1000 shadow-sm`} style={{ width: `${cls.fill}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Attention needed - High Visibility */}
              <Card className="rounded-[2.5rem] border-none bg-rose-50/50 p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                       <AlertCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black text-slate-900">Cần liên hệ</CardTitle>
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">3 Học sinh vắng mặt</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {mockStudents.filter(s => s.attendance < 80).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-rose-100/30">
                        <div>
                          <p className="text-sm font-black text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-rose-500 font-bold uppercase mt-0.5 mt-1 tracking-tighter">Vắng {100-s.attendance}% số buổi</p>
                        </div>
                        <Button className="h-10 px-4 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-100 transition-transform active:scale-90">
                          Gửi SMS
                        </Button>
                      </div>
                    ))}
                  </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
