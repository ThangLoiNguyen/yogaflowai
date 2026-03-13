import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
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
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
          <header className="mb-6 space-y-2">
            <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/20">
              Bảng điều khiển giáo viên
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Sức khỏe trung tâm
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Xem tiến độ của học viên, đánh giá chất lượng lớp học và nhận gợi ý hỗ trợ.
            </p>
          </header>

          <TeacherAnalytics data={mockTeacherAnalytics} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-slate-200">
                  Danh sách học viên
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                    {mockStudents.length} học viên đang học
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 pb-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <span>Học viên</span>
                  <span>Cấp độ</span>
                  <span>Mục tiêu</span>
                  <span className="text-right">Chuyên cần</span>
                </div>
                {mockStudents.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/80 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {student.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {student.recentClass}
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {student.level}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {student.focus}
                    </span>
                    <span className="text-right text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {student.attendance}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-slate-200">
                    Hiệu suất lớp học
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      7 ngày qua
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {mockClassesPerformance.map((cls) => (
                    <div
                      key={cls.id}
                      className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {cls.name}
                        </p>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {cls.occurrences} lớp
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        <span>Tỷ lệ lấp đầy</span>
                        <span>{cls.fill}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                          style={{ width: `${cls.fill}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

