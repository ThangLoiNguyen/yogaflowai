import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentProgress } from "@/components/student-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { RecommendationCard } from "@/components/recommendation-card";
import { mockStudentProgress, mockRecommendations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Flame, Trophy, PlayCircle } from "lucide-react";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch actual enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(title, teacher_id, level)")
    .eq("student_id", user.id);

  // Safely map enrollments or fallback if database is empty/mocking
  const upcomingClasses = enrollments?.map((enc) => ({
    id: enc.id,
    name: (enc.courses as any)?.title || "Lớp học chưa đặt tên",
    when: "Thời gian đăng ký gần nhất", // Since we don't have schedules in mocked DB
    teacher: (enc.courses as any)?.teacher_id || "Chưa có giáo viên",
    type: "Đã đăng ký",
  })) || [];

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        
        {/* Header & Gamification Banner */}
        <header className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Chào mừng trở lại, Yogi!
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Dưới đây là phản hồi sinh học tuần này và đề xuất lớp tiếp theo từ AI.
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <ThemeToggle />
              <Link href="/onboarding">
                <Button variant="outline" className="hidden sm:flex rounded-full border-slate-200 dark:border-slate-800">
                  Cập nhật hồ sơ
                </Button>
              </Link>
              <form action={async () => {
                "use server"
                const { logout } = await import('@/app/actions/auth');
                await logout();
              }}>
                <Button type="submit" variant="ghost" className="rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                  Đăng xuất
                </Button>
              </form>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 dark:border-amber-500/20">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Chuỗi 4 ngày!</p>
                <p className="text-xs text-amber-700 dark:text-amber-400/80">Bạn nằm trong top 10% học viên chăm chỉ tuần này.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 dark:border-emerald-500/20">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                <Trophy className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Đạt mục tiêu độ dẻo</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400/80">Bạn đã mở khóa huy hiệu "Đàn hồi".</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1.2fr]">
          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                  Chỉ số cốt lõi
                  <span className="text-xs font-normal text-slate-500">30 ngày qua</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudentProgress data={mockStudentProgress} />
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Biểu đồ phản hồi sinh học
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthProgressChart />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-slate-900/50 dark:border-indigo-900/30 overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                  Đề xuất bởi AI
                  <Badge className="bg-indigo-500 text-white border-0 hover:bg-indigo-600">Mới</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecommendations.slice(0, 1).map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec as any} />
                ))}
                <Link href="/recommendation" className="block text-center mt-2">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    Xem tất cả lớp thiết kế riêng →
                  </span>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                  Lớp học sắp tới
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingClasses.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bạn chưa đăng ký lớp nào.</p>
                    <p className="text-xs text-slate-400 mt-1">Hãy đăng ký từ các lớp đề xuất nhé!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="group flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/80 hover:border-sky-200 dark:hover:border-sky-900/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform text-sky-500">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{cls.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{cls.when}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function HealthProgressChart() {
  const weeks = [
    { label: "Tuần 1", flexibility: 40, balance: 35, stress: 65 },
    { label: "Tuần 2", flexibility: 48, balance: 42, stress: 60 },
    { label: "Tuần 3", flexibility: 56, balance: 50, stress: 54 },
    { label: "Tuần 4", flexibility: 64, balance: 58, stress: 49 },
    { label: "Tuần 5", flexibility: 75, balance: 70, stress: 35 },
  ];

  return (
    <div className="space-y-6 mt-2">
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
          Độ dẻo dai
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          Cân bằng
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
          Mức căng thẳng (thấp là tốt)
        </span>
      </div>
      
      <div className="relative h-48 w-full px-2">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px w-full bg-slate-100 dark:bg-slate-800/80" />
          ))}
        </div>
        
        {/* Bars Container */}
        <div className="relative flex h-full items-end justify-between px-2 sm:px-6">
          {weeks.map((week) => (
            <div key={week.label} className="group relative flex flex-col items-center gap-3 w-12 sm:w-16">
              
              {/* The 3 Data Bars side-by-side per week */}
              <div className="flex items-end justify-center w-full h-[150px] gap-0.5 sm:gap-1 z-10">
                <div 
                  className="w-1/3 max-w-[12px] rounded-t-[4px] bg-sky-500 hover:bg-sky-400 transition-all duration-300 group-hover:opacity-100 opacity-90 shadow-sm"
                  style={{ height: `${week.flexibility}%` }}
                />
                <div 
                  className="w-1/3 max-w-[12px] rounded-t-[4px] bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 group-hover:opacity-100 opacity-90 shadow-sm"
                  style={{ height: `${week.balance}%` }}
                />
                <div 
                  className="w-1/3 max-w-[12px] rounded-t-[4px] bg-rose-500 hover:bg-rose-400 transition-all duration-300 group-hover:opacity-100 opacity-90 shadow-sm"
                  style={{ height: `${week.stress}%` }}
                />
              </div>
              
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{week.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
