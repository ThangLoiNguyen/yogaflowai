import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Info } from "lucide-react";
import {
  mockTeacherAnalytics,
  mockStudents,
  mockClassesPerformance,
} from "@/lib/mock-data";

export default function TeacherDashboard() {
  return (
    <main className="flex-1 bg-slate-50 min-h-screen dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-3">
          <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/20">
            Vận hành Giáo viên
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Sức khỏe Studio & Gợi ý AI
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Theo dõi tiến trình học viên, phân tích hiệu suất lớp học, và xem các đề xuất AI để giữ chân học viên.
          </p>
        </header>

        {/* AI Actionable Insights Banner */}
        <div className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
              Gợi ý từ AI Copilot
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-indigo-50 dark:border-indigo-800/30">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Học viên có rủi ro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sarah đã nghỉ 3 lớp liên tiếp. Cân nhắc liên hệ để kiểm tra xem cô ấy có tham gia được không.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-indigo-50 dark:border-indigo-800/30">
              <Info className="w-4 h-4 text-sky-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Tối ưu hóa Lớp học</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  "Vinyasa Flow" đang lấp đầy 95%. Thêm một suất vào Thứ Tư có thể thu hút thêm học viên.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <TeacherAnalytics data={mockTeacherAnalytics} />
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1.4fr]">
          <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                Danh sách Học viên
                <Badge className="font-normal text-xs bg-slate-100 hover:bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300">
                  {mockStudents.length} Hoạt động
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <span>Học viên</span>
                <span>Trình độ</span>
                <span>Mục tiêu</span>
                <span className="text-right">Chuyên cần</span>
              </div>
              <div className="space-y-1 mt-3">
                {mockStudents.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate pr-2">
                        {student.recentClass}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {student.level}
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {student.focus}
                    </span>
                    <span className="text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {student.attendance}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
                  Hiệu suất Gần đây
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    7 ngày qua
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockClassesPerformance.map((cls) => (
                  <div
                    key={cls.id}
                    className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {cls.name}
                      </p>
                      <Badge className="text-[10px] font-medium border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400">
                        {cls.occurrences} buổi học
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Tỷ lệ lấp đầy</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{cls.fill}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
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
  );
}

