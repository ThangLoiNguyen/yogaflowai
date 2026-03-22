"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Square } from "lucide-react";
import { toast } from "sonner";

export default function EndSessionButton({ sessionId, variant = "sidebar" }: { sessionId: string; variant?: "sidebar" | "compact" }) {
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
      toast.success("✅ Buổi học đã kết thúc!");
      router.push("/teacher/classes");
    } catch (err: any) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleEnd}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-400 hover:text-red-300 text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 backdrop-blur shadow-lg"
      >
        <Square className="w-3 h-3 fill-current" />
        <span className="hidden sm:inline">{loading ? "Đang kết thúc..." : "Kết thúc"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleEnd}
      disabled={loading}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-sm font-semibold transition-all disabled:opacity-50"
    >
      <Square className="w-4 h-4 fill-current shrink-0" />
      {loading ? "Đang kết thúc..." : "Kết thúc buổi dạy"}
    </button>
  );
}

