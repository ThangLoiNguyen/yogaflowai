import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendationCard } from "@/components/recommendation-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockRecommendations } from "@/lib/mock-data";

export default function RecommendationPage() {
  const courses = mockRecommendations;

  return (
    <main className="flex-1 bg-white dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-400/40">
              Gợi ý lớp học
            </Badge>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Lớp yoga phù hợp với cơ thể bạn
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Dựa trên hồ sơ của bạn, YogaFlow AI đề xuất các lớp học này để hỗ trợ mục tiêu sức khỏe của bạn.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="w-full max-w-4xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 p-6 rounded-xl mb-6">
          <div className="mb-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-medium text-sky-600 dark:text-sky-400">Bước 4: Gợi ý lớp học</span>
              <span>100%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 dark:bg-sky-400 transition-all duration-500 ease-in-out" 
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-slate-200">
              Các lớp học được đề xuất
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <RecommendationCard
                key={course.id}
                recommendation={course}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

