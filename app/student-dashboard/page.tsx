import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentProgress } from "@/components/student-progress";
import { DashboardNav } from "@/components/dashboard-nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { RecommendationCard } from "@/components/recommendation-card";
import { mockStudentProgress, mockRecommendations, mockUpcomingClasses } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Sparkles, Flame, Trophy, Target, TrendingUp, ArrowRight, CalendarDays, CheckCircle2, Clock } from "lucide-react";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch actual enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(title, teacher_id, level)")
    .eq("student_id", user.id);

  const upcomingClasses = enrollments?.map((enc) => ({
    id: enc.id,
    name: (enc.courses as any)?.title || "Untitled Course",
    when: "Thời gian tiếp theo",
    teacher: (enc.courses as any)?.teacher_id || "Chưa phân công",
    type: "Enrolled" as const,
  })) || [];

  // Use mock upcoming if empty from DB
  const displayClasses = upcomingClasses.length > 0 ? upcomingClasses : mockUpcomingClasses;

  // Fake user name derived from email
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "bạn";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 space-y-8">

          {/* ─── Header ─── */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-400/20 font-semibold">
                  Trang tổng quan
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Xin chào, {userName} 👋
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Đây là sự tiến bộ của bạn tuần này — và gợi ý tiếp theo từ YogaFlow AI.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/recommendation">
                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-semibold shadow-sm active:scale-95 transition-transform">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Xem đề xuất AI
                </Button>
              </Link>
            </div>
          </header>

          {/* ─── Quick Stats Row ─── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Chuỗi ngày tập", value: "12", unit: "ngày", icon: Flame, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", trend: "+3 tuần này" },
              { label: "Lớp hoàn thành", value: "28", unit: "lớp", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", trend: "+4 tháng này" },
              { label: "Huy hiệu đạt", value: "7", unit: "huy hiệu", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", trend: "2 sắp mở khóa" },
              { label: "Mục tiêu tuần", value: "3/5", unit: "lớp", icon: Target, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", trend: "60% hoàn thành" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-none">
                    {stat.value}
                    <span className="ml-1 text-sm font-normal text-slate-400">{stat.unit}</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className={`mt-1.5 text-[11px] font-semibold ${stat.color}`}>{stat.trend}</p>
                </div>
              );
            })}
          </div>

          {/* ─── Main Grid ─── */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)]">

            {/* ─── Left column ─── */}
            <div className="space-y-6">

              {/* Progress metrics */}
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Tiến độ sức khỏe
                    </span>
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">30 ngày qua</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentProgress data={mockStudentProgress} />
                </CardContent>
              </Card>

              {/* Weekly bar chart */}
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <CalendarDays className="w-4 h-4 text-sky-500" />
                      Biểu đồ cải thiện theo tuần
                    </span>
                    <div className="flex gap-3 text-[10px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400"/> Dẻo dai</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400"/> Cân bằng</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400"/> Căng thẳng</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HealthProgressChart />
                </CardContent>
              </Card>

              {/* Gamification streak banner */}
              <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 p-5 dark:border-orange-900/30 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/20">
                <div className="pointer-events-none absolute right-4 -top-4 text-7xl opacity-10 select-none">🔥</div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-bold text-orange-700 dark:text-orange-400">Chuỗi tập luyện: 12 ngày liên tiếp!</span>
                    </div>
                    <p className="text-xs text-orange-600/80 dark:text-orange-300/70">Chỉ còn 3 ngày nữa để mở khóa huy hiệu "Người kiên trì"</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i < 12 ? "bg-orange-400" : "bg-orange-200 dark:bg-orange-900"}`} />
                      ))}
                    </div>
                  </div>
                  <Trophy className="w-10 h-10 text-amber-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* ─── Right column ─── */}
            <div className="space-y-6">

              {/* AI Recommendation */}
              <Card className="border-indigo-200/50 bg-gradient-to-b from-indigo-50/40 to-white dark:border-slate-800 dark:bg-slate-900/50 dark:from-slate-900/50 shadow-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      Đề xuất từ AI
                    </span>
                    <Badge className="font-semibold text-[10px] bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/10 border-transparent dark:text-indigo-300">
                      Cập nhật mỗi ngày
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RecommendationCard key={mockRecommendations[0].id} recommendation={mockRecommendations[0] as any} />
                  <Link href="/recommendation">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-slate-800 mt-1">
                      Xem tất cả đề xuất <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming Classes */}
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Clock className="w-4 h-4 text-sky-500" />
                      Lớp học sắp tới
                    </span>
                    <Link href="/classes">
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] text-slate-500 hover:text-slate-900 px-2">
                        Xem tất cả
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {displayClasses.length === 0 ? (
                    <EmptyClasses />
                  ) : (
                    displayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{cls.name}</p>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{cls.when}</p>
                        </div>
                        <span className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-bold",
                          cls.type === "Recommended"
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        )}>
                          {cls.type === "Recommended" ? "Gợi ý" : "Đã đặt"}
                        </span>
                      </div>
                    ))
                  )}
                  <Link href="/classes" className="block">
                    <Button size="sm" variant="outline" className="w-full mt-1 border-slate-200 dark:border-slate-700 text-xs font-semibold">
                      Tìm lớp học mới
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyClasses() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center dark:border-slate-800 dark:bg-slate-900/30 gap-2">
      <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600" />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Chưa có lớp học nào</p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">Đăng ký từ các đề xuất AI bên trên!</p>
    </div>
  );
}

function HealthProgressChart() {
  const weeks = [
    { label: "Tuần 1", flexibility: 40, balance: 35, stress: 65 },
    { label: "Tuần 2", flexibility: 48, balance: 42, stress: 60 },
    { label: "Tuần 3", flexibility: 56, balance: 50, stress: 54 },
    { label: "Tuần 4", flexibility: 66, balance: 60, stress: 46 },
  ];

  return (
    <div className="space-y-4">
      <div className="relative h-44 rounded-xl border border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/20 px-4 pt-4 pb-2">
        {/* Grid lines */}
        <div className="absolute inset-x-4 top-6 bottom-8 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25].map((v) => (
            <div key={v} className="flex items-center gap-2">
              <span className="text-[9px] text-slate-300 dark:text-slate-700 w-4 shrink-0">{v}</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="relative flex h-full items-end justify-between gap-2 pb-6">
          {weeks.map((week) => (
            <div key={week.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-28 w-full max-w-[40px] flex-col justify-end gap-0.5">
                <div
                  className="w-full rounded-t-sm bg-sky-400/80 dark:bg-sky-500/70 transition-all duration-700"
                  style={{ height: `${(week.flexibility / 100) * 100}%` }}
                />
                <div
                  className="w-full bg-indigo-400/70 dark:bg-indigo-500/60 transition-all duration-700"
                  style={{ height: `${(week.balance / 100) * 100}%` }}
                />
                <div
                  className="w-full rounded-b-sm bg-rose-400/60 dark:bg-rose-500/50 transition-all duration-700"
                  style={{ height: `${(week.stress / 100) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{week.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary insight */}
      <div className="rounded-lg bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100/80 dark:border-emerald-900/20 px-4 py-2.5 flex items-center gap-2.5">
        <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Tuyệt vời! Độ dẻo dai của bạn tăng <strong>+26 điểm</strong> trong 4 tuần qua.
        </p>
      </div>
    </div>
  );
}
