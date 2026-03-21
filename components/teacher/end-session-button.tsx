"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import { toast } from "sonner";

export default function EndSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnd = async () => {
    if (!confirm("Bạn có chắc muốn kết thúc buổi học này không?")) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/sessions/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "completed" }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      toast.success("✅ Buổi học đã kết thúc. Đang chuyển về trang quản lý...");
      router.push("/teacher/classes");
    } catch (err: any) {
      toast.error("Lỗi kết thúc buổi học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnd}
      disabled={loading}
      variant="ghost"
      className="w-full justify-start gap-4 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-12 border border-transparent hover:border-red-500/20 transition-all"
    >
      <Square className="w-4 h-4 fill-current" />
      <span className="text-sm font-bold">{loading ? "Đang kết thúc..." : "Kết thúc buổi dạy"}</span>
    </Button>
  );
}
