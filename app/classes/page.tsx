"use client";

import { useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Sparkles, Clock, Star,
  CalendarCheck, Users, X, Filter, LayoutGrid, ArrowRight
} from "lucide-react";

const ALL_CLASSES = [
  { id: "c-1", name: "Grounded Morning Flow", teacher: "Leah Nguyen", teacherAvatar: "🧘‍♀️", level: "Cơ bản", duration: "45 phút", intensity: "Gentle" as const, focus: ["Hông", "Cân bằng", "Hơi thở"], rating: 4.9, reviews: 128, enrolled: 18, max: 20, schedule: "T2, T4, T6 • 7:00 SA", score: 96, rationale: "Bài tập nhẹ nhàng buổi sáng giúp mở khớp hông và điều tiết thần kinh trước ngày dài." },
  { id: "c-2", name: "Restore & Decompress", teacher: "Arjun Sharma", teacherAvatar: "🧘‍♂️", level: "Mọi cấp độ", duration: "35 phút", intensity: "Gentle" as const, focus: ["Phục hồi", "Hệ thần kinh", "Thư giãn"], rating: 4.8, reviews: 94, enrolled: 12, max: 15, schedule: "T3, T5 • 8:00 CH", score: 92, rationale: "Lớp phục hồi buổi tối phù hợp với mức căng thẳng cao hiện tại của bạn." },
  { id: "c-3", name: "Strength for Flow", teacher: "Maya Kim", teacherAvatar: "🧘", level: "Trung cấp", duration: "50 phút", intensity: "Moderate" as const, focus: ["Core", "Vai", "Cân bằng"], rating: 4.9, reviews: 156, enrolled: 16, max: 18, schedule: "T2, T5 • 6:30 CH", score: 88, rationale: "Bài tập rèn luyện sức mạnh hỗ trợ transitions vinyasa và cân bằng trong tháng tới." },
  { id: "c-4", name: "Power Vinyasa", teacher: "Leah Nguyen", teacherAvatar: "🧘‍♀️", level: "Nâng cao", duration: "60 phút", intensity: "Dynamic" as const, focus: ["Sức mạnh", "Linh hoạt", "Vinyasa"], rating: 4.7, reviews: 87, enrolled: 10, max: 12, schedule: "T3, T7 • 7:00 SA", score: 72, rationale: "Lớp cường độ cao phù hợp khi bạn muốn thách thức thể lực - hãy chắc chắn nghỉ ngơi đủ giấc trước." },
  { id: "c-5", name: "Yin & Meditation", teacher: "Arjun Sharma", teacherAvatar: "🧘‍♂️", level: "Mọi cấp độ", duration: "60 phút", intensity: "Gentle" as const, focus: ["Yin", "Thiền", "Cột sống"], rating: 5.0, reviews: 42, enrolled: 8, max: 20, schedule: "CN • 9:00 SA", score: 95, rationale: "Kết hợp Yin và thiền định giúp bạn cải thiện giấc ngủ và phục hồi sâu." },
  { id: "c-6", name: "Functional Flexibility", teacher: "Maya Kim", teacherAvatar: "🧘", level: "Cơ bản", duration: "45 phút", intensity: "Moderate" as const, focus: ["Dẻo dai", "Khớp", "Chức năng"], rating: 4.8, reviews: 63, enrolled: 14, max: 20, schedule: "T4, CN • 10:00 SA", score: 85, rationale: "Tăng cường độ dẻo dai chức năng - mục tiêu hàng đầu trong hồ sơ của bạn." },
];

const INTENSITIES = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Nhẹ nhàng", value: "Gentle" },
  { label: "Vừa phải", value: "Moderate" },
  { label: "Mạnh mẽ", value: "Dynamic" },
];

function ClassCard({ cls, aiTag }: { cls: typeof ALL_CLASSES[0]; aiTag?: boolean }) {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFull = cls.enrolled >= cls.max;
  const fillPct = Math.round((cls.enrolled / cls.max) * 100);

  const intensityStyles: Record<string, { badge: string; dot: string }> = {
    Gentle: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/50", dot: "bg-emerald-500" },
    Moderate: { badge: "bg-sky-50 text-sky-700 border-sky-200/50", dot: "bg-sky-500" },
    Dynamic: { badge: "bg-amber-50 text-amber-700 border-amber-200/50", dot: "bg-amber-500" },
  };

  const handleBook = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setBooked(true);
    setLoading(false);
  };

  return (
    <div className="group flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
      
      {/* AI Indicator */}
      {aiTag && (
        <div className="absolute top-6 right-6 z-10">
          <Badge className="bg-indigo-600 text-white border-none shadow-lg shadow-indigo-100 font-black uppercase tracking-widest text-[9px] py-1 px-2.5">
            <Sparkles className="w-2.5 h-2.5 mr-1" /> Best Fit
          </Badge>
        </div>
      )}

      <div className="space-y-6 flex-1">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${intensityStyles[cls.intensity].badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${intensityStyles[cls.intensity].dot}`} />
              {cls.intensity}
            </span>
            <span className="text-[11px] font-bold text-slate-400">• {cls.level}</span>
          </div>
          
          <h3 className="font-black text-xl text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {cls.name}
          </h3>
        </div>

        {/* AI Insight Box */}
        {aiTag && (
          <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100/50 p-4 space-y-2">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Gợi ý từ AI ⟡</span>
                <span className="text-[10px] font-black text-white bg-indigo-500 rounded-full px-2 py-0.5">{cls.score}%</span>
             </div>
             <p className="text-[12px] font-medium text-indigo-700/80 leading-relaxed italic">
               "{cls.rationale}"
             </p>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">{cls.teacherAvatar}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Giáo viên</p>
                <p className="text-xs font-bold text-slate-700">{cls.teacher}</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                 <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Thời gian</p>
                <p className="text-xs font-bold text-slate-700">{cls.duration}</p>
              </div>
           </div>
        </div>

        {/* Meta Row */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
             <span className="flex items-center gap-1.5">
               <CalendarCheck className="w-3.5 h-3.5" /> {cls.schedule}
             </span>
             <span className="flex items-center gap-1.5">
               <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {cls.rating}
             </span>
          </div>

          <div className="space-y-1.5">
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã đăng ký</span>
                <span className="text-[11px] font-black text-slate-900">{cls.enrolled}/{cls.max} học viên</span>
             </div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${fillPct >= 90 ? "bg-rose-500" : fillPct >= 70 ? "bg-amber-500" : "bg-indigo-500"}`}
                  style={{ width: `${fillPct}%` }}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="pt-8 mt-auto">
        {booked ? (
          <Button disabled className="w-full h-14 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] border-emerald-100/50">
             <CalendarCheck className="w-4 h-4 mr-2" /> Đã đăng ký
          </Button>
        ) : (
          <Button 
            onClick={handleBook}
            disabled={isFull || loading}
            className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all active:scale-95 ${
              isFull ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none" 
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
            }`}
          >
            {loading ? "Đang xử lý..." : isFull ? "Lớp đã đầy" : "Đăng ký học ngay"}
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

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="student" />
      <main className="flex-1 py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-2 text-left">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 mb-2 rounded-full">
                <LayoutGrid className="w-3 h-3 mr-2 inline" /> Thư viện khóa học
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Khám phá lớp học
              </h1>
              <p className="text-slate-400 font-medium max-w-xl">
                YogAI đã phân loại và đánh giá từng lớp học để đảm bảo bạn tìm thấy không gian luyện tập phù hợp nhất với thể trạng hôm nay.
              </p>
            </div>
          </header>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <Input
                placeholder="Tìm lớp học, giáo viên hoặc mục tiêu của bạn..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-16 pl-14 pr-14 rounded-[1.5rem] border-slate-100 bg-white shadow-sm focus:shadow-xl focus:shadow-indigo-50 transition-all font-bold text-slate-700"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Group */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <div className="p-2 bg-slate-50 rounded-2xl flex items-center gap-1">
                {INTENSITIES.map(i => (
                  <button
                    key={i.value}
                    onClick={() => setIntensity(i.value)}
                    className={`h-11 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      intensity === i.value
                        ? "bg-white text-indigo-600 shadow-md shadow-slate-200/50"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="h-16 px-6 rounded-[1.5rem] border-slate-100 bg-white font-black text-slate-500"
              >
                <Filter className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </div>

          {/* AI Banner - Premium Card */}
          <div className="rounded-[2rem] bg-indigo-600 p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 border-none">
             <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <Sparkles className="w-32 h-32" />
             </div>
             <div className="relative flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                   <Sparkles className="w-7 h-7" />
                </div>
                <div>
                   <h4 className="text-lg font-black tracking-tight leading-none mb-1">Cá nhân hóa bởi YogAI</h4>
                   <p className="text-indigo-100/80 text-sm font-medium">Chúng tôi đã đánh dấu các lớp học phù hợp nhất với tiến độ luyện tập của bạn bằng biểu tượng ⟡.</p>
                </div>
             </div>
          </div>

          {/* Results Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
                 <Search className="w-10 h-10 text-slate-200" />
              </div>
              <div className="space-y-1">
                 <p className="text-xl font-black text-slate-900">Không tìm thấy lớp học phù hợp</p>
                 <p className="text-slate-400 font-medium">Hãy thử điều chỉnh từ khóa hoặc bộ lọc cường độ.</p>
              </div>
              <Button variant="ghost" onClick={() => { setSearch(""); setIntensity("Tất cả"); }} className="font-black text-indigo-600 uppercase tracking-widest text-[11px]">
                 Đặt lại tất cả bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-soft-fade">
              {filtered.map(cls => (
                <ClassCard key={cls.id} cls={cls} aiTag={aiRecommended.has(cls.id)} />
              ))}
            </div>
          )}

          {/* Load More */}
          {filtered.length > 0 && (
            <div className="flex justify-center pt-8">
               <Button className="h-14 px-12 bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all">
                  Tải thêm lớp học <ArrowRight className="w-4 h-4 ml-3" />
               </Button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
