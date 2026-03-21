"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Sparkles, Clock, Star,
  CalendarCheck, X, Filter, LayoutGrid, ArrowRight,
  CheckCircle2, Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/toast";

type ClassData = {
  id: string;
  name: string;
  teacher_id: string;
  level: string;
  duration: string;
  intensity: string;
  focus: string[];
  rating: number;
  reviews_count: number;
  enrolled: number;
  max_capacity: number;
  schedule: string;
  teacher?: {
    name: string;
    avatar_url: string;
  };
};

const INTENSITIES = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Nhẹ nhàng", value: "Gentle" },
  { label: "Vừa phải", value: "Moderate" },
  { label: "Mạnh mẽ", value: "Dynamic" },
];

function ClassCard({ cls, aiTag }: { cls: ClassData; aiTag?: boolean }) {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFull = (cls.enrolled || 0) >= (cls.max_capacity || 20);
  const fillPct = Math.round(((cls.enrolled || 0) / (cls.max_capacity || 20)) * 100);

  const intensityStyles: Record<string, { badge: string; dot: string }> = {
    Gentle: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/50", dot: "bg-emerald-500" },
    Moderate: { badge: "bg-sky-50 text-sky-700 border-sky-200/50", dot: "bg-sky-500" },
    Dynamic: { badge: "bg-amber-50 text-amber-700 border-amber-200/50", dot: "bg-amber-500" },
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classes/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: cls.id }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setBooked(true);
        toast.success("Đăng ký thành công", `Bạn đã đăng ký tham gia lớp ${cls.name}.`);
      } else {
        toast.error("Đăng ký thất bại", data.error || "Vui lòng thử lại sau.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối", "Không thể gửi yêu cầu đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  const intensityKey = cls.intensity || "Moderate";
  const styles = intensityStyles[intensityKey] || intensityStyles["Moderate"];

  return (
    <div className="group flex flex-col rounded-[2.5rem] border border-slate-100 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden">
      
      {aiTag && (
        <div className="absolute top-6 right-6 z-10">
          <Badge className="bg-indigo-600 text-white border-none shadow-lg shadow-indigo-100 font-black uppercase tracking-widest text-[9px] py-1 px-2.5">
            <Sparkles className="w-2.5 h-2.5 mr-1" /> Best Fit
          </Badge>
        </div>
      )}

      <div className="space-y-6 flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${styles.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
              {cls.intensity}
            </span>
            <span className="text-[11px] font-bold text-slate-400">• {cls.level}</span>
          </div>
          
          <h3 className="font-black text-xl text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {cls.name}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                {cls.teacher?.avatar_url ? (
                  <img src={cls.teacher.avatar_url} alt={cls.teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <LayoutGrid className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Giáo viên</p>
                <p className="text-xs font-bold text-slate-700">{cls.teacher?.name || "Giảng viên"}</p>
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
                <span className="text-[11px] font-black text-slate-900">{cls.enrolled || 0}/{cls.max_capacity || 20} học viên</span>
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

      <div className="pt-8 mt-auto">
        {booked ? (
          <Button disabled className="w-full h-10 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] border-emerald-100/50">
             <CheckCircle2 className="w-4 h-4 mr-2" /> Đã đăng ký
          </Button>
        ) : (
          <Button 
            onClick={handleBook}
            disabled={isFull || loading}
            className={`w-full h-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all active:scale-95 ${
              isFull ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none" 
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : isFull ? "Lớp đã đầy" : "Đăng ký học ngay"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ClassesList({ initialClasses }: { initialClasses: ClassData[] }) {
  const [search, setSearch] = useState("");
  const [intensity, setIntensity] = useState("Tất cả");

  const filtered = initialClasses.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.teacher?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.focus || []).some(f => f.toLowerCase().includes(search.toLowerCase()));
    const matchIntensity = intensity === "Tất cả" || c.intensity === intensity;
    return matchSearch && matchIntensity;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row gap-4">
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
            <button onClick={() => setSearch("")} className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-slate-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

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
        </div>
      </div>

      <div className="rounded-[2rem] bg-indigo-600 p-5 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 border-none">
         <div className="absolute top-0 right-0 p-5 opacity-10 rotate-12">
            <Sparkles className="w-32 h-32" />
         </div>
         <div className="relative flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
               <Sparkles className="w-7 h-7" />
            </div>
            <div>
               <h4 className="text-lg font-black tracking-tight leading-none mb-1">Cá nhân hóa bởi YogAI</h4>
               <p className="text-indigo-100/80 text-sm font-medium">Chúng tôi đồng hành cùng bạn trên hành trình chinh phục sự dẻo dai.</p>
            </div>
         </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
             <Search className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-xl font-black text-slate-900">Không tìm thấy lớp học phù hợp</p>
          <Button variant="ghost" onClick={() => { setSearch(""); setIntensity("Tất cả"); }} className="font-black text-indigo-600 uppercase tracking-widest text-[11px]">
             Đặt lại bộ lọc
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-soft-fade">
          {filtered.map(cls => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
}
