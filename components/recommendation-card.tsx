"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Clock, Star, Bookmark, BookmarkCheck,
  CheckCircle2, Users, CalendarDays, ArrowRight, TrendingUp,
  Loader2
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export interface Recommendation {
  id: string;
  course?: string;
  name?: string;
  score?: number;
  explanation?: string;
  rationale?: string;
  level: string;
  duration: string;
  focus: string[];
  intensity: "Gentle" | "Moderate" | "Dynamic";
  teacher?: string;
  schedule?: string;
  enrolled?: number;
  maxSpots?: number;
}

const INTENSITY_STYLES: Record<string, { badge: string; dot: string; icon: string }> = {
  Gentle: {
    badge: "bg-emerald-50 text-emerald-600 border-none px-3 py-1",
    dot: "bg-emerald-400",
    icon: "🌊",
  },
  Moderate: {
    badge: "bg-sky-50 text-sky-600 border-none px-3 py-1",
    dot: "bg-sky-400",
    icon: "🌬️",
  },
  Dynamic: {
    badge: "bg-amber-50 text-amber-600 border-none px-3 py-1",
    dot: "bg-amber-400",
    icon: "🔥",
  },
};

const INTENSITY_LABELS: Record<string, string> = {
  Gentle: "Nhẹ nhàng",
  Moderate: "Trung bình",
  Dynamic: "Năng động",
};

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [saved, setSaved] = useState(false);

  const style = INTENSITY_STYLES[recommendation.intensity] ?? INTENSITY_STYLES.Gentle;
  const title = recommendation.course || recommendation.name || "Lớp học";
  const desc = recommendation.explanation || recommendation.rationale;
  const score = recommendation.score ?? 95;

  const handleEnroll = async () => {
    setLoading(true);
    try {
      // In a real app we'd call the API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEnrolled(true);
      toast.success("Đã ghi danh", `Bạn đã đăng ký thành công lớp ${title}.`);
    } catch (e: any) {
      console.error(e);
      toast.error("Lỗi đăng ký", "Hiện tại không thể ghi danh lớp học này. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group flex flex-col rounded-[2.5rem] bg-white border border-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden h-full">

      {/* Dynamic Background Circle */}
      <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 ${style.dot}`} />

      {/* Body */}
      <div className="flex-1 space-y-8 relative z-10">

        <div className="flex items-start justify-between">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform duration-500">
            {style.icon}
          </div>
          <Badge className={`${style.badge} font-black uppercase tracking-widest text-[9px] rounded-xl`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot} mr-2`} />
            {INTENSITY_LABELS[recommendation.intensity]}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Cấp độ {recommendation.level}</span>
              <span className="text-slate-200">|</span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {recommendation.duration}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-[1.1] group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {recommendation.focus?.map((tag) => (
              <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-50">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* AI Explanation - Ultra Premium */}
        {desc && (
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100/50 space-y-4 shadow-sm group-hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">AI INSIGHT</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-indigo-900 bg-white border border-indigo-50 px-2.5 py-1 rounded-full shadow-sm">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> {score}% Phù hợp
              </div>
            </div>
            <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic pr-2">
              "{desc}"
            </p>
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="flex items-center gap-3 mt-10 relative z-10 pt-6 border-t border-slate-50">
        {enrolled ? (
          <div className="flex-1 h-14 rounded-2xl bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-sm border border-emerald-100 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-4 h-4" /> Đã ghi danh
          </div>
        ) : (
          <Button
            onClick={handleEnroll}
            disabled={loading}
            className="flex-1 h-16 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200 font-black uppercase tracking-widest text-[10px] transition-all active:scale-[0.98] group/btn"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                XỬ LÝ...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Đăng ký ngay <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        )}

        <button
          onClick={() => setSaved(!saved)}
          className={`h-16 w-16 rounded-2xl border flex items-center justify-center transition-all ${saved
              ? "bg-slate-50 border-sky-200 text-sky-500 shadow-inner"
              : "bg-white border-slate-100 text-slate-300 hover:text-slate-900 hover:bg-slate-50"
            }`}
        >
          {saved ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
