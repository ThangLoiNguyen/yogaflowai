"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecommendationCard } from "@/components/recommendation-card";
import {
  Search, SlidersHorizontal, Sparkles, Clock, Star,
  CalendarCheck, Users, Flame, X, Filter
} from "lucide-react";

const ALL_CLASSES = [
  { id: "c-1", name: "Grounded Morning Flow", teacher: "Leah Nguyen", teacherAvatar: "🧘‍♀️", level: "Level 1–2", duration: "45 phút", intensity: "Gentle" as const, focus: ["Hông", "Cân bằng", "Hơi thở"], rating: 4.9, reviews: 128, enrolled: 18, max: 20, schedule: "T2, T4, T6 • 7:00 SA", score: 96, rationale: "Bài tập nhẹ nhàng buổi sáng giúp mở khớp hông và điều tiết thần kinh trước ngày dài." },
  { id: "c-2", name: "Restore & Decompress", teacher: "Arjun Sharma", teacherAvatar: "🧘‍♂️", level: "Tất cả cấp độ", duration: "35 phút", intensity: "Gentle" as const, focus: ["Phục hồi", "Hệ thần kinh", "Thư giãn"], rating: 4.8, reviews: 94, enrolled: 12, max: 15, schedule: "T3, T5 • 8:00 PM", score: 92, rationale: "Lớp phục hồi buổi tối phù hợp với mức căng thẳng cao hiện tại của bạn." },
  { id: "c-3", name: "Strength for Flow", teacher: "Maya Kim", teacherAvatar: "🧘", level: "Level 2", duration: "50 phút", intensity: "Moderate" as const, focus: ["Core", "Vai", "Cân bằng"], rating: 4.9, reviews: 156, enrolled: 16, max: 18, schedule: "T2, T5 • 6:30 PM", score: 88, rationale: "Bài tập rèn luyện sức mạnh hỗ trợ transitions vinyasa và cân bằng trong tháng tới." },
  { id: "c-4", name: "Power Vinyasa", teacher: "Leah Nguyen", teacherAvatar: "🧘‍♀️", level: "Level 3", duration: "60 phút", intensity: "Dynamic" as const, focus: ["Sức mạnh", "Linh hoạt", "Vinyasa"], rating: 4.7, reviews: 87, enrolled: 10, max: 12, schedule: "T3, T7 • 7:00 SA", score: 72, rationale: "Lớp cường độ cao phù hợp khi bạn muốn thách thức thể lực - hãy chắc chắn nghỉ ngơi đủ giấc trước." },
  { id: "c-5", name: "Yin & Meditation", teacher: "Arjun Sharma", teacherAvatar: "🧘‍♂️", level: "Tất cả cấp độ", duration: "60 phút", intensity: "Gentle" as const, focus: ["Yin", "Thiền", "Cột sống"], rating: 5.0, reviews: 42, enrolled: 8, max: 20, schedule: "CN • 9:00 SA", score: 95, rationale: "Kết hợp Yin và thiền định giúp bạn cải thiện giấc ngủ và phục hồi sâu." },
  { id: "c-6", name: "Functional Flexibility", teacher: "Maya Kim", teacherAvatar: "🧘", level: "Level 1–2", duration: "45 phút", intensity: "Moderate" as const, focus: ["Dẻo dai", "Khớp", "Chức năng"], rating: 4.8, reviews: 63, enrolled: 14, max: 20, schedule: "T4, CN • 10:00 SA", score: 85, rationale: "Tăng cường độ dẻo dai chức năng - mục tiêu hàng đầu trong hồ sơ của bạn." },
];

const INTENSITIES = ["Tất cả", "Gentle", "Moderate", "Dynamic"];
const DURATIONS = ["Tất cả", "< 40 phút", "40-50 phút", "> 50 phút"];

function ClassCard({ cls, aiTag }: { cls: typeof ALL_CLASSES[0]; aiTag?: boolean }) {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFull = cls.enrolled >= cls.max;
  const fillPct = Math.round((cls.enrolled / cls.max) * 100);

  const intensityColors: Record<string, string> = {
    Gentle: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40",
    Moderate: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/40",
    Dynamic: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40",
  };

  const handleBook = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setBooked(true);
    setLoading(false);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-5 space-y-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {aiTag && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-800/40 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> AI gợi ý
                </span>
              )}
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${intensityColors[cls.intensity]}`}>
                {cls.intensity}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-base leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {cls.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-amber-400 text-xs justify-end">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">{cls.rating}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">({cls.reviews})</p>
          </div>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="text-base">{cls.teacherAvatar}</span>
          <span className="font-medium">{cls.teacher}</span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cls.duration}</span>
          <span className="flex items-center gap-1"><CalendarCheck className="w-3.5 h-3.5" />{cls.schedule}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{cls.enrolled}/{cls.max} học viên</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {cls.focus.map(t => (
            <span key={t} className="text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5">{t}</span>
          ))}
          <span className="text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5">{cls.level}</span>
        </div>

        {/* AI rationale */}
        {aiTag && (
          <div className="rounded-lg border border-indigo-100/60 bg-indigo-50/40 dark:border-indigo-900/30 dark:bg-indigo-900/10 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Lý do phù hợp</span>
              <span className="ml-auto text-[10px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded-full">{cls.score}%</span>
            </div>
            <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed">{cls.rationale}</p>
          </div>
        )}

        {/* Fill bar */}
        <div>
          <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Chỗ trống</span>
            <span className={isFull ? "text-rose-500" : fillPct > 80 ? "text-amber-500" : "text-emerald-500"}>
              {isFull ? "Hết chỗ" : `${cls.max - cls.enrolled} chỗ còn lại`}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${fillPct >= 100 ? "bg-rose-400" : fillPct > 80 ? "bg-amber-400" : "bg-emerald-400"}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
        {booked ? (
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl h-10">
            <CalendarCheck className="w-4 h-4" /> Đã đặt lớp học
          </div>
        ) : (
          <Button
            onClick={handleBook}
            disabled={isFull || loading}
            className={`w-full h-10 font-semibold transition-all active:scale-95 ${
              isFull ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-slate-400/30 dark:border-t-slate-900" />
                Đang đặt...
              </span>
            ) : isFull ? "Hết chỗ" : "Đặt lớp học"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [intensity, setIntensity] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ALL_CLASSES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase()) ||
      c.focus.some(f => f.toLowerCase().includes(search.toLowerCase()));
    const matchIntensity = intensity === "Tất cả" || c.intensity === intensity;
    return matchSearch && matchIntensity;
  });

  const aiRecommended = new Set(["c-1", "c-2", "c-5"]);
  const activeFilters = (intensity !== "Tất cả" ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 space-y-8">

          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/50 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-800/40 font-semibold">
                Khám phá lớp học
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Tìm lớp học phù hợp
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {ALL_CLASSES.length} lớp học · Lớp AI gợi ý được đánh dấu riêng dựa trên hồ sơ của bạn.
            </p>
          </header>

          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Tìm theo tên, giáo viên hoặc kỹ năng..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-10 shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 h-10 px-4 rounded-lg border text-sm font-semibold transition-colors ${
                  activeFilters > 0
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <Filter className="w-4 h-4" />
                Bộ lọc
                {activeFilters > 0 && (
                  <span className="ml-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter drawer */}
          {showFilters && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cường độ</p>
                <div className="flex flex-wrap gap-2">
                  {INTENSITIES.map(i => (
                    <button
                      key={i}
                      onClick={() => setIntensity(i)}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-full border transition-all ${
                        intensity === i
                          ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-transparent dark:text-slate-300"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Banner */}
          <div className="flex items-center gap-3 rounded-xl border border-indigo-100/60 bg-indigo-50/40 dark:border-indigo-900/30 dark:bg-indigo-950/20 px-5 py-3.5">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              <strong>Lớp AI gợi ý</strong> được đánh dấu ⟡ — chọn dựa trên hồ sơ sức khỏe và mục tiêu hiện tại của bạn.
            </p>
          </div>

          {/* Class Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">Không tìm thấy lớp học</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              <button onClick={() => { setSearch(""); setIntensity("Tất cả"); }} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Đặt lại tất cả
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(cls => (
                <ClassCard key={cls.id} cls={cls} aiTag={aiRecommended.has(cls.id)} />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
