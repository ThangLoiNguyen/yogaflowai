"use client";

import React, { useState } from "react";
import { Video, Zap, Users, Pencil, Play } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const handleStartSession = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch("/api/sessions/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "live" }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      
      toast.success("Chào đón bạn tới buổi tập - Stream đã được bật!");
      router.push(`/teacher/session/${sessionId}`);
    } catch (err: any) {
      toast.error("Lỗi khi bắt đầu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
       {status === 'scheduled' ? (
         <Button 
           onClick={handleStartSession}
           disabled={loading}
           className="w-full h-14 rounded-2xl text-base font-bold transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
         >
           <Play className="w-5 h-5 mr-3" /> {loading ? "Đang kết nối..." : "Bắt đầu dạy ngay"}
         </Button>
       ) : (
         <Link href={`/teacher/session/${sessionId}`} className="block w-full">
           <Button className={`w-full h-14 rounded-2xl text-base font-bold transition-all shadow-lg ${status === 'live' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' : 'bg-slate-900 hover:bg-black text-white'}`}>
             {status === 'live' ? (
                 <><Video className="w-5 h-5 mr-3" /> Đang dạy (Vào phòng)</>
             ) : (
                 <><Zap className="w-5 h-5 mr-3" /> Xem AI Insights</>
             )}
           </Button>
         </Link>
       )}

       <div className="flex gap-3">
          <Link href={`/teacher/classes/${courseId}/edit`} className="flex-1">
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider">
              <Pencil className="w-3.5 h-3.5 mr-2" /> Sửa lớp
            </Button>
          </Link>
          <Link href={`/teacher/students?session=${sessionId}`} className="flex-1">
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 mr-2" /> Học viên
            </Button>
          </Link>
       </div>
    </div>
  );
}
