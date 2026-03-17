
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { RecommendationCard } from "@/components/recommendation-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, SlidersHorizontal, ArrowDown, ChevronRight, Activity, TrendingUp } from "lucide-react";

const FILTERS = ["Tất cả", "Nhẹ nhàng", "Trung bình", "Năng động"];

export default async function RecommendationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch student profile
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*, users:user_id(name)")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch classes
  const { data: classes } = await supabase
    .from("classes")
    .select("*, teacher:teacher_id(name)");

  // Basic Recommendation heuristic logic
  const recommendations = (classes || []).map(cls => {
    let score = 70; // baseline
    
    // Match experience level
    if (cls.level?.toLowerCase() === profile.experience_level?.toLowerCase()) score += 20;
    
    // Match goals
    const goals = profile.goals || [];
    const clsFocus = cls.focus || [];
    goals.forEach((g: string) => {
      if (clsFocus.some((f: string) => f.toLowerCase().includes(g.toLowerCase()))) {
        score += 5;
      }
    });

    return {
      id: cls.id,
      name: cls.name,
      level: cls.level,
      duration: cls.duration,
      intensity: cls.intensity as any,
      focus: cls.focus as string[],
      teacher: (cls.teacher as any)?.name || "Giảng viên",
      score: Math.min(99, score),
      rationale: `Lớp này phù hợp với phong cách ${cls.intensity} và kinh nghiệm ${profile.experience_level} của bạn.`
    };
  }).sort((a, b) => b.score - a.score).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="student" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full flex flex-col space-y-16 animate-soft-fade">

          {/* Premium Header */}
          <header className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between relative">
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <Badge className="bg-sky-50 text-sky-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 mr-2 inline animate-pulse" />
                  AI Lộ trình của bạn
                </Badge>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Đề xuất dành riêng cho <br />
                <span className="text-indigo-600">thể trạng của bạn</span>
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                YogAI đã phân tích dữ liệu của bạn để tinh lọc bộ sưu tập các lớp học giúp bạn tối ưu hóa sự dẻo dai và phục hồi năng lượng.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <SlidersHorizontal className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lọc cường độ</span>
              </div>
              <div className="flex items-center gap-3 p-1.5 bg-slate-50 rounded-[2.5rem] border border-slate-50">
                {FILTERS.map((f, i) => (
                  <button
                    key={f}
                    className={`h-11 px-6 text-[10px] font-black uppercase tracking-widest rounded-[2rem] transition-all duration-300 ${i === 0
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "text-slate-400 hover:text-slate-900 hover:bg-white"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Context AI Banner */}
          <div className="relative group overflow-hidden rounded-[3rem] p-12 bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-700">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
              <Activity className="w-48 h-48" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-10 relative z-10">
              <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100/50">
                <Sparkles className="w-10 h-10 text-indigo-500 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Phân tích chuyên sâu từ AI</p>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 rounded-lg font-black text-[9px]">TRẠNG THÁI TỐT</Badge>
                </div>
                <p className="text-2xl font-black text-slate-800 leading-tight">
                  Chào mừng trở lại, {(profile as any).users?.name || "bạn"}. Dựa trên hồ sơ của bạn, chúng tôi đã chuẩn bị lộ trình rèn luyện <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">tối ưu nhất</span> cho hôm nay.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {recommendations.map((course) => (
              <RecommendationCard
                key={course.id}
                recommendation={course as any}
              />
            ))}
          </div>

          {/* Load more */}
          <div className="py-20 flex flex-col items-center gap-8 border-t border-slate-50">
            <div className="text-center space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Khám phá nhiều hơn</p>
              <p className="text-slate-300 font-medium">Hệ thống đang liên tục cập nhật các lớp học mới.</p>
            </div>
            <Button variant="ghost" className="h-20 w-20 rounded-full bg-slate-50 hover:bg-indigo-600 hover:text-white hover:scale-110 transition-all duration-500 shadow-inner group">
              <ArrowDown className="w-6 h-6 animate-bounce" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
