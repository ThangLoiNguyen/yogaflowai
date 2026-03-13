"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  const tone =
    recommendation.intensity === "Gentle"
      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/40"
      : recommendation.intensity === "Moderate"
      ? "bg-sky-500/15 text-sky-200 border-sky-400/40"
      : "bg-amber-500/15 text-amber-200 border-amber-400/40";

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
      setLoading(false);
    }
  };

  const title = recommendation.course || recommendation.name || "Course Label";
  const desc = recommendation.explanation || recommendation.rationale;
  const score = recommendation.score;

  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/80">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              {title}
              {typeof score === "number" && (
                <span className="text-[10px] bg-sky-500/20 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-sm border border-sky-200 dark:border-sky-900">
                  {score}% Phù hợp
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {recommendation.duration} • <span className="text-amber-500 dark:text-amber-400">★ 4.9</span> (120 đánh giá)
            </p>
          </div>
          <Badge
            className={`border ${tone} text-[10px] whitespace-nowrap font-medium`}
          >
            {recommendation.intensity}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500">Độ khó</span>
            <p className="text-slate-900 font-medium dark:text-slate-200">{recommendation.level}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500">Lịch học</span>
            <p className="text-slate-900 font-medium dark:text-slate-200">Ngày mai, 18:30</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {recommendation.focus?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="rounded-lg bg-sky-500/5 border border-sky-500/20 p-3 space-y-1.5">
          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Vì sao lớp này hợp với bạn</span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {desc}
          </p>
        </div>

        <div className="pt-2">
          {enrolled ? (
            <div className="flex items-center justify-center rounded-md bg-sky-500/10 text-xs text-sky-600 dark:text-sky-400 font-medium w-full py-2">
              <span className="mr-2">✓</span> Đã đăng ký thành công
            </div>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={loading}
              size="sm"
              className="w-full text-sm h-9 bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký lớp này"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
