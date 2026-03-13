"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Clock, Bookmark, BookmarkCheck } from "lucide-react";

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
    <Card className="flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-tight">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {recommendation.duration}</span>
              <span>•</span>
              <span className="text-amber-500 flex items-center gap-1 font-medium">★ 4.9</span>
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
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            {recommendation.level}
          </span>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10 p-4 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Sparkles className="w-12 h-12 text-indigo-500" />
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Vì sao lớp này hợp với bạn</span>
            <Badge className="ml-auto bg-indigo-500 text-white border-0">{score}% Phù hợp</Badge>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed relative z-10">
            {desc}
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
        {enrolled ? (
          <div className="flex items-center justify-center rounded-lg bg-emerald-500/10 text-sm text-emerald-600 dark:text-emerald-400 font-semibold w-full h-10">
            ✓ Đã đăng ký thành công
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleEnroll}
              disabled={loading}
              className="flex-1 h-10 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-sm transition-transform active:scale-95"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký lớp này"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSaved(!saved)}
              className={`h-10 w-10 flex-shrink-0 transition-colors ${saved ? 'border-sky-500 text-sky-500 bg-sky-50 dark:bg-sky-500/10' : 'border-slate-200 text-slate-400 hover:text-slate-600 dark:border-slate-700'}`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
