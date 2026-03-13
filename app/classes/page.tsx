import { DashboardNav } from "@/components/dashboard-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { mockRecommendations } from "@/lib/mock-data"; 

// Using the same mock data for now, treating them as generic classes
const allClasses = mockRecommendations.map(c => ({
  ...c,
  // ensure we have a rationale/explanation to reuse RecommendationCard gracefully
  rationale: c.rationale || "Một lớp học tuyệt vời để rèn luyện thói quen và kỹ năng mới.",
}));

export default function ClassesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="space-y-3">
              <Badge className="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-400/20">
                Tìm kiếm lớp học
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Danh sách lớp học mở
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl">
                Khám phá và đăng ký các lớp học phù hợp với mọi trình độ, từ cơ bản đến nâng cao do các giáo viên hàng đầu giảng dạy.
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Tìm lớp học, giáo viên..." 
                  className="pl-9 h-10 shadow-sm bg-white dark:bg-slate-900/80" 
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0 text-slate-500">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allClasses.map((course) => (
              <RecommendationCard
                key={course.id}
                recommendation={course as any}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
