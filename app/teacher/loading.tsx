import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-50 rounded-full mb-6"></div>
        <div className="w-16 h-16 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <h3 className="text-xl font-display text-emerald-600 animate-pulse mb-2">Đang nạp dữ liệu lớp học...</h3>
      <p className="text-sm text-slate-500">Giáo viên vui lòng chờ giây lát</p>
    </div>
  );
}
