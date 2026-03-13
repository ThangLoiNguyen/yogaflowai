"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Bookmark, BookmarkCheck } from "lucide-react";

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
}

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [saved, setSaved] = useState(false);

  const isGentle = recommendation.intensity === "Gentle";
  const isModerate = recommendation.intensity === "Moderate";
  const tone = isGentle
    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-400/20"
    : isModerate
    ? "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-400/20"
    : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-400/20";

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enroll-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: recommendation.id }),
      });
      if (res.ok) {
        setEnrolled(true);
      } else {
        console.error("Enrollment failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!enrolled) setLoading(false);
    }
  };

  const title = recommendation.course || recommendation.name || "Course Label";
  const desc = recommendation.explanation || recommendation.rationale;
  const score = recommendation.score || 95;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/90 overflow-hidden group">
      <div className="flex-1 p-5 space-y-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 leading-tight">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recommendation.duration}</span>
              <span>•</span>
              <span className="text-amber-500 flex items-center gap-1">★ 4.9</span>
            </div>
          </div>
          <Badge className={`border px-2 py-0.5 whitespace-nowrap font-medium ${tone}`}>
            {recommendation.intensity}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {recommendation.focus?.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-md border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {recommendation.level}
          </span>
        </div>

        <div className="rounded-lg border border-indigo-100/60 bg-indigo-50/40 dark:border-indigo-900/30 dark:bg-indigo-900/10 p-3 space-y-2 relative overflow-hidden group-hover:bg-indigo-50/80 transition-colors">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Lý Do Đề Xuất</span>
            <Badge className="ml-auto bg-indigo-500 text-white border-0 text-[10px]">{score}% Phù hợp</Badge>
          </div>
          <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed relative z-10">
            {desc}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        {enrolled ? (
          <div className="flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-500/10 text-sm text-emerald-600 dark:text-emerald-400 font-semibold w-full h-9">
            ✓ Đã đăng ký
          </div>
        ) : (
          <div className="flex gap-2.5">
            <Button
              onClick={handleEnroll}
              disabled={loading}
              className="flex-1 h-9 rounded-md bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 shadow-sm transition-transform active:scale-[0.98]"
            >
              {loading ? "Đang xử lý..." : "Đăng ký học"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSaved(!saved)}
              className={`h-9 w-9 rounded-md flex-shrink-0 transition-colors ${saved ? 'border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-500/10' : 'border-slate-200 text-slate-400 hover:text-slate-600 dark:border-slate-700'}`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
