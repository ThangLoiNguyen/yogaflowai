"use client";

import React, { useState } from "react";
import { Video, Zap, Users, Pencil, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SessionActionsProps {
  sessionId: string;
  courseId: string;
  status: string;
}

export function SessionActions({ sessionId, courseId, status }: SessionActionsProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  const changeStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/sessions/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: newStatus }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      
      setCurrentStatus(newStatus);

      if (newStatus === "live") {
        toast.success("🎉 Buổi học đã bắt đầu! Đang chuyển vào phòng dạy...");
        router.push(`/teacher/session/${sessionId}`);
      } else if (newStatus === "completed") {
        toast.success("✅ Buổi học đã kết thúc.");
        router.refresh();
      }
    } catch (err: any) {
      toast.error("Lỗi cập nhật trạng thái: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Primary action button */}
      {currentStatus === "scheduled" && (
        <Button
          onClick={() => changeStatus("live")}
          disabled={loading}
          className="w-full h-14 rounded-2xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          <Play className="w-5 h-5 mr-3 fill-white" />
          {loading ? "Đang kết nối..." : "Bắt đầu dạy ngay"}
        </Button>
      )}

      {currentStatus === "live" && (
        <div className="flex gap-3">
          <Link href={`/teacher/session/${sessionId}`} className="flex-1">
            <Button className="w-full h-14 rounded-2xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
              <Video className="w-5 h-5 mr-3" />
              Vào phòng dạy
            </Button>
          </Link>
          <Button
            onClick={() => changeStatus("completed")}
            disabled={loading}
            variant="outline"
            className="h-14 w-14 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 flex-shrink-0"
            title="Kết thúc buổi học"
          >
            <Square className="w-5 h-5 fill-red-500" />
          </Button>
        </div>
      )}

      {currentStatus === "completed" && (
        <Link href={`/teacher/ai-insights`} className="block w-full">
          <Button className="w-full h-14 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
            <Zap className="w-5 h-5 mr-3" />
            Xem AI Insights
          </Button>
        </Link>
      )}

      {/* Secondary actions */}
      <div className="flex gap-3">
        <Link href={`/teacher/classes/${courseId}/edit`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider"
          >
            <Pencil className="w-3.5 h-3.5 mr-2" /> Sửa lớp
          </Button>
        </Link>
        <Link href={`/teacher/students?session=${sessionId}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider"
          >
            <Users className="w-3.5 h-3.5 mr-2" /> Học viên
          </Button>
        </Link>
      </div>
    </div>
  );
}
