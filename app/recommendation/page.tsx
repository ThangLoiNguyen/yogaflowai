import { DashboardNav } from "@/components/dashboard-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { mockRecommendations } from "@/lib/mock-data";

const FILTERS = ["Tất cả", "Nhẹ nhàng", "Trung bình", "Năng động"];

export default function RecommendationPage() {
  const courses = mockRecommendations;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">

          {/* Header */}
          <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="space-y-3">
              <Badge className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/20 font-semibold px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                Đề xuất AI đã sẵn sàng
              </Badge>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Lớp học dành riêng cho bạn
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Dựa trên hồ sơ sức khỏe của bạn, YogaFlow AI đã chọn chính xác những lớp học này —
                kèm giải thích chi tiết lý do phù hợp với cơ thể và mục tiêu hiện tại của bạn.
              </p>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              {FILTERS.map((f, i) => (
                <button
                  key={f}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    i === 0
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          {/* AI context banner */}
          <div className="mb-8 rounded-xl border border-indigo-100/80 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-950/20 px-5 py-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              <strong>Dựa trên hôm nay:</strong> Mức căng thẳng của bạn ở mức <strong>cao</strong>, độ dẻo dai đang cải thiện. AI đã ưu tiên các lớp phục hồi và nhẹ nhàng.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
            {courses.map((course) => (
              <RecommendationCard
                key={course.id}
                recommendation={course}
              />
            ))}
          </div>

          {/* Load more */}
          <div className="mt-10 flex justify-center">
            <Button variant="outline" className="font-semibold border-slate-200 dark:border-slate-700">
              Tải thêm đề xuất
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
