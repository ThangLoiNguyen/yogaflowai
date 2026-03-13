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
    name: (enc.courses as any)?.title || "Untitled Course",
    when: "Next Available Time", // Since we don't have schedules in mocked DB
    teacher: (enc.courses as any)?.teacher_id || "Unassigned",
    type: "Enrolled",
  })) || [];

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-400/20">
                Bảng điều khiển học viên
              </Badge>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Chào mừng trở lại
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Dưới đây là sự thay đổi của cơ thể bạn tuần này—và gợi ý tiếp theo từ YogaFlow AI.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <Link href="/onboarding">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Tìm lớp học
              </Button>
            </Link>
            <form action={async () => {
              "use server"
              const { logout } = await import('@/app/actions/auth');
              await logout();
            }}>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
              >
                Đăng xuất
              </Button>
            </form>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]">
          <div className="space-y-6">
            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-800 dark:text-slate-200">
                  Tiến độ của bạn
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    30 ngày qua
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudentProgress data={mockStudentProgress} />
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-800 dark:text-slate-200">
                  Biểu đồ sức khoẻ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthProgressChart />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-sky-500/10 bg-sky-50/20 dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-slate-100">
                  Lớp học đề xuất
                  <Badge className="font-normal text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-500/10 border-transparent dark:text-sky-300">
                    AI cập nhật mỗi ngày
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecommendations.slice(0, 2).map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec as any} />
                ))}
                <Link href="/recommendation">
                  <Button
                     variant="ghost"
                     size="sm"
                     className="mt-2 w-full justify-center text-xs text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-slate-800 dark:hover:text-sky-300"
                  >
                    Xem thêm đề xuất
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-slate-100">
                  Lớp học sắp tới
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                    Dựa trên lớp đã đăng ký
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-3">
                {upcomingClasses.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Chưa có lớp học nào. Hãy đăng ký từ gợi ý bên trên!
                    </p>
                  </div>
                ) : (
                  upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{cls.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {cls.when} 
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold border-0",
                          cls.type === "Recommended"
                            ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                            : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                        )}
                      >
                        Đã đăng ký
                      </span>
                    </div>
                  ))
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
    { label: "W1", flexibility: 40, balance: 35, stress: 65 },
    { label: "W2", flexibility: 48, balance: 42, stress: 60 },
    { label: "W3", flexibility: 56, balance: 50, stress: 54 },
    { label: "W4", flexibility: 64, balance: 58, stress: 49 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-sky-400" />
            Độ dẻo dai
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-indigo-400" />
            Cân bằng
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full bg-rose-400" />
            Mức căng thẳng
          </span>
        </div>
      </div>
      <div className="relative h-40 rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 pt-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="absolute inset-x-4 top-6 bottom-4">
          <div className="flex h-full flex-col justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-px w-full bg-slate-800/80 last:hidden"
              />
            ))}
          </div>
        </div>
        <div className="relative flex h-full items-end justify-between gap-3">
          {weeks.map((week) => (
            <div
              key={week.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-24 w-8 flex-col justify-end gap-0.5">
                <div
                  className="w-full rounded-full bg-sky-400/80"
                  style={{ height: `${(week.flexibility / 100) * 100}%` }}
                />
                <div
                  className="w-full rounded-full bg-indigo-400/70"
                  style={{ height: `${(week.balance / 100) * 100}%` }}
                />
                <div
                  className="w-full rounded-full bg-rose-400/60"
                  style={{ height: `${(week.stress / 100) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400">{week.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
