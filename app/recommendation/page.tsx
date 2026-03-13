import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendationCard } from "@/components/recommendation-card";
import { DashboardNav } from "@/components/dashboard-nav";
import { mockRecommendations } from "@/lib/mock-data";
import { Sparkles } from "lucide-react";

export default function RecommendationPage() {
  const courses = mockRecommendations;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
          <header className="mb-10 flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="space-y-3">
              <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-400/20">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                Đề xuất AI đã sẵn sàng
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Lớp học thiết kế riêng cho bạn
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Dựa trên hồ sơ của bạn, YogaFlow AI đã lựa chọn những lớp học này để giúp bạn đạt mục tiêu hiệu quả. Hãy so sánh và chọn lớp phù hợp.
              </p>
            </div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-700">
            {courses.map((course) => (
              <RecommendationCard
                key={course.id}
                recommendation={course}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

