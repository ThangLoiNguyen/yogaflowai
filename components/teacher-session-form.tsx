"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, CheckCircle2, Zap, Activity, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function TeacherSessionForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    class_type: "",
    flexibility_score: 50,
    strength_score: 50,
    notes: "",
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, student_id: studentId }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
            ...form,
            class_type: "",
            notes: "",
            flexibility_score: 50,
            strength_score: 50,
        });
        router.refresh();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || "Giao thức truyền tải dữ liệu thất bại.");
      }
    } catch (error) {
      setError("Mất kết nối với cơ sở dữ liệu tập trung.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-soft-fade">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Loại lớp học</Label>
          <Input 
            required 
            placeholder="Vd: Vinyasa Flow, Hatha..." 
            value={form.class_type} 
            onChange={(e) => setForm({...form, class_type: e.target.value})} 
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ngày luyện tập</Label>
          <Input 
            type="date" 
            required 
            value={form.date} 
            onChange={(e) => setForm({...form, date: e.target.value})} 
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-3xl bg-slate-50/50 border border-slate-50">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-emerald-500" />
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Độ dẻo dai</Label>
            </div>
            <span className="text-xl font-black text-emerald-600">{form.flexibility_score}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={form.flexibility_score} 
            onChange={(e) => setForm({...form, flexibility_score: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
          />
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Zap className="w-4 h-4 text-indigo-500" />
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sức mạnh</Label>
            </div>
            <span className="text-xl font-black text-indigo-600">{form.strength_score}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={form.strength_score} 
            onChange={(e) => setForm({...form, strength_score: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>
      </div>

      <div className="space-y-3">
         <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ghi chú & Phản hồi</Label>
         <Textarea 
            placeholder="Học viên đã thực hiện như thế nào? Cần cải thiện tư thế nào?" 
            className="rounded-[2rem] min-h-[120px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold p-6"
            value={form.notes}
            onChange={(e) => setForm({...form, notes: e.target.value})}
         />
      </div>

      <div className="space-y-6 pt-6">
        {error && (
            <div className="w-full flex items-center gap-4 p-6 rounded-[2rem] cyber-error-glow text-rose-600 animate-glitch relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.6)]" />
                <div className="w-12 h-12 rounded-2xl bg-rose-100/50 flex items-center justify-center shrink-0 border border-rose-200/50">
                   <AlertCircle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                   <p className="uppercase tracking-[0.4em] text-[9px] font-black opacity-30 mb-1">Alert: Transmission Failure // Protocol X</p>
                   <p className="text-[13px] font-bold leading-tight">{error}</p>
                </div>
            </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-end gap-6">
            {success && (
                <div className="flex items-center gap-3 text-emerald-600 animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Status: Data Synced</span>
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none">Báo cáo đã được ghi lại</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>
            )}
            <Button 
                disabled={loading} 
                className="h-16 px-12 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-slate-100 transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <span className="animate-pulse">Đang ghi...</span>
                        <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                ) : (
                    <span className="flex items-center gap-3">
                        Gửi báo cáo buổi tập <ArrowRight className="w-4 h-4" />
                    </span>
                )}
            </Button>
        </div>
      </div>
    </form>
  );
}
