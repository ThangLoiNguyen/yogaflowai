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
          className="w-full h-9 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-[0.98]"
        >
          <Play className="w-4 h-4 mr-2 fill-white" />
          {loading ? "Đang kết nối..." : "Bắt đầu dạy ngay"}
        </Button>
      )}

      {currentStatus === "live" && (
        <div className="flex gap-2">
          <Link href={`/teacher/session/${sessionId}`} className="flex-1">
            <Button className="w-full h-9 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-[0.98]">
              <Video className="w-4 h-4 mr-2" />
              Vào phòng
            </Button>
          </Link>
          <Button
            onClick={() => changeStatus("completed")}
            disabled={loading}
            variant="outline"
            className="h-9 w-9 p-0 rounded-xl border-red-200 text-red-500 hover:bg-red-50 flex-shrink-0 flex items-center justify-center"
            title="Kết thúc buổi học"
          >
            <Square className="w-4 h-4 fill-red-500" />
          </Button>
        </div>
      )}

      {currentStatus === "completed" && (
        <Link href={`/teacher/ai-insights`} className="block w-full">
          <Button className="w-full h-9 rounded-xl text-[13px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
            Xem phân tích AI
          </Button>
        </Link>
      )}

      {/* Secondary actions */}
      <div className="flex gap-2">
        <Link href={`/teacher/classes/${courseId}/edit`} className="flex-1 text-center" title="Sửa lớp">
          <Button
            variant="outline"
            className="w-full h-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center p-0"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/teacher/students?session=${sessionId}`} className="flex-1 text-center" title="Học viên">
          <Button
            variant="outline"
            className="w-full h-9 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center p-0"
          >
            <Users className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
