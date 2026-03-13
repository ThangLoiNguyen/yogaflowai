"use client";

import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sparkles, TrendingUp, Users, ArrowRight, BookOpen, Star, AlertCircle } from "lucide-react";
import {
  mockTeacherAnalytics,
  mockStudents,
  mockClassesPerformance,
} from "@/lib/mock-data";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="teacher" />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 space-y-8">

          {/* ─── Header ─── */}
          <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/20 font-semibold">
                Bảng điều khiển giáo viên
              </Badge>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                Sức khỏe trung tâm
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Theo dõi tiến độ học viên, hiệu suất lớp học và nhận gợi ý từ AI.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-semibold shadow-sm active:scale-95 transition-transform">
                <BookOpen className="w-4 h-4 mr-2" />
                Tạo lớp học mới
              </Button>
            </div>
          </header>

          {/* ─── Metrics ─── */}
          <TeacherAnalytics data={mockTeacherAnalytics} />

          {/* ─── AI Copilot Banner ─── */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 via-sky-50 to-cyan-50 p-5 dark:border-indigo-900/30 dark:from-indigo-950/30 dark:via-sky-950/20 dark:to-cyan-950/20">
            <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-5 select-none">🤖</div>
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">AI Copilot gợi ý</span>
                </div>
                <ul className="space-y-1 text-xs text-indigo-700/80 dark:text-indigo-300/70">
                  <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 shrink-0 text-indigo-400" /> Jordan Rivera cần được chuyển sang lớp Cấp 3 — đã vượt chuẩn trong 3 buổi liên tiếp.</li>
                  <li className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 shrink-0 text-indigo-400" /> Hãy thay thêm lớp Phục hồi vào Thứ 5 — tỷ lệ đặt lớp hôm đó đang thấp nhất tuần.</li>
                </ul>
              </div>
              <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/30 shrink-0 font-semibold">
                Xem phân tích đầy đủ
              </Button>
            </div>
          </div>

          {/* ─── Main Grid ─── */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">

            {/* Student Roster */}
            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                    <Users className="w-4 h-4 text-sky-500" />
                    Danh sách học viên
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {mockStudents.length} đang học
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Table header */}
                <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-3 pb-2.5 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
                  <span>Học viên</span>
                  <span>Cấp độ</span>
                  <span>Mục tiêu</span>
                  <span className="text-right">Chuyên cần</span>
                </div>
                <div className="space-y-2">
                  {mockStudents.map((student) => {
                    const attendanceColor = student.attendance >= 85 ? "text-emerald-600 dark:text-emerald-400" : student.attendance >= 70 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";
                    return (
                      <div
                        key={student.id}
                        className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/60 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{student.name}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">{student.recentClass}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{student.level}</span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{student.focus}</span>
                        <div className="text-right">
                          <span className={`text-xs font-bold ${attendanceColor}`}>{student.attendance}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Right column */}
            <div className="space-y-6">
              {/* Class Performance */}
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Hiệu suất lớp học
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">7 ngày qua</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockClassesPerformance.map((cls) => {
                    const fillColor = cls.fill >= 85 ? "bg-emerald-400 dark:bg-emerald-500" : cls.fill >= 70 ? "bg-sky-400 dark:bg-sky-500" : "bg-amber-400 dark:bg-amber-500";
                    return (
                      <div key={cls.id} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 space-y-2.5 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{cls.name}</p>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {cls.occurrences} lớp
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Tỷ lệ lấp đầy</span>
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{cls.fill}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div className={`h-full rounded-full ${fillColor} transition-all duration-700`} style={{ width: `${cls.fill}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Attention needed */}
              <Card className="border-amber-200/60 bg-amber-50/40 dark:border-amber-900/30 dark:bg-amber-950/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    Cần chú ý
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {mockStudents.filter(s => s.attendance < 80).map(s => (
                    <div key={s.id} className="flex items-center justify-between rounded-xl border border-amber-100 dark:border-amber-900/20 bg-white dark:bg-slate-900/40 px-3 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{s.name}</p>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">Chuyên cần chỉ {s.attendance}% — cần được khuyến khích</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-[11px] border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 px-2.5 font-semibold shrink-0">
                        Nhắn tin
                      </Button>
                    </div>
                  ))}
                  {mockStudents.filter(s => s.attendance < 80).length === 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Star className="w-4 h-4" /> Tất cả học viên đều có tỷ lệ chuyên cần tốt!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
