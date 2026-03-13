"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Clock, Star, Bookmark, BookmarkCheck,
  CheckCircle2, Users, CalendarDays, ArrowRight
} from "lucide-react";

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

const INTENSITY_STYLES: Record<string, { badge: string; dot: string }> = {
  Gentle: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40",
    dot: "bg-emerald-400",
  },
  Moderate: {
    badge: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/40",
    dot: "bg-sky-400",
  },
  Dynamic: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40",
    dot: "bg-amber-400",
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
      const res = await fetch("/api/enroll-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: recommendation.id }),
      });
      if (res.ok) setEnrolled(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-900 overflow-hidden">

      {/* Body */}
      <div className="flex-1 p-5 space-y-4">

        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-[15px] leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {title}
            </h3>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recommendation.duration}
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                4.9
              </span>
              {recommendation.teacher && (
                <span className="text-slate-400">· {recommendation.teacher}</span>
              )}
            </div>
          </div>

          {/* Intensity badge */}
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shrink-0 ${style.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {INTENSITY_LABELS[recommendation.intensity]}
          </span>
        </div>

        {/* Schedule + spots */}
        {(recommendation.schedule || recommendation.enrolled !== undefined) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {recommendation.schedule && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {recommendation.schedule}
              </span>
            )}
            {recommendation.enrolled !== undefined && recommendation.maxSpots !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {recommendation.maxSpots - recommendation.enrolled} chỗ trống
              </span>
            )}
          </div>
        )}

        {/* Focus tags + level */}
        <div className="flex flex-wrap gap-1.5">
          {recommendation.focus?.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-md border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {recommendation.level}
          </span>
        </div>

        {/* AI Rationale box */}
        {desc && (
          <div className="rounded-xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/60 to-white dark:border-indigo-900/30 dark:from-indigo-950/30 dark:to-transparent p-3.5 space-y-2 group-hover:border-indigo-200 dark:group-hover:border-indigo-800/50 transition-colors">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Lý do phù hợp với bạn
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-white bg-indigo-500 px-2 py-0.5 rounded-full">
                {score}% phù hợp
              </span>
            </div>
            <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
              {desc}
            </p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100/80 dark:border-slate-800/60 bg-slate-50/20 dark:bg-slate-900/30 flex gap-2.5">
        {enrolled ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl h-10">
            <CheckCircle2 className="w-4 h-4" /> Đã đăng ký
          </div>
        ) : (
          <Button
            onClick={handleEnroll}
            disabled={loading}
            className="flex-1 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-white font-semibold shadow-sm active:scale-[0.98] transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-slate-500/30 dark:border-t-slate-900" />
                Đang đặt...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Đăng ký học <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        )}

        <button
          onClick={() => setSaved(!saved)}
          className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
            saved
              ? "border-sky-400/60 bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800/50"
              : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
          aria-label={saved ? "Bỏ lưu" : "Lưu lớp học"}
        >
          {saved
            ? <BookmarkCheck className="w-4 h-4" />
            : <Bookmark className="w-4 h-4" />
          }
        </button>
      </div>
    </div>
  );
}
