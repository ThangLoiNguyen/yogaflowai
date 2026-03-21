"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, CheckCircle2, Zap, Activity, AlertCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormError } from "@/components/ui/form-error";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!form.class_type) errors.class_type = "Vui lòng nhập loại lớp học.";
    if (!form.date) errors.date = "Vui lòng chọn ngày luyện tập.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Vui lòng hoàn thiện các thông tin buổi tập.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, student_id: studentId }),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Báo cáo hoàn tất", "Buổi tập đã được đồng bộ vào hệ thống theo dõi tiến độ.");
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
        const msg = data.error || "Giao thức truyền tải dữ liệu thất bại.";
        setError(msg);
        toast.error("Lỗi đồng bộ", msg);
      }
    } catch (error) {
      const msg = "Mất kết nối với cơ sở dữ liệu tập trung.";
      setError(msg);
      toast.error("Lỗi mạng", msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-soft-fade">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Loại lớp học</Label>
          <Input 
            placeholder="Vd: Vinyasa Flow, Hatha..." 
            value={form.class_type} 
            onChange={(e) => setForm({...form, class_type: e.target.value})} 
            className={`h-10 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 ${fieldErrors.class_type ? 'border-rose-200 bg-rose-50/20' : ''}`}
          />
          <FormError message={fieldErrors.class_type} />
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ngày luyện tập</Label>
          <Input 
            type="date" 
            value={form.date} 
            onChange={(e) => setForm({...form, date: e.target.value})} 
            className={`h-10 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 ${fieldErrors.date ? 'border-rose-200 bg-rose-50/20' : ''}`}
          />
          <FormError message={fieldErrors.date} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-5 rounded-3xl bg-slate-50/50 border border-slate-50">
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
            className="rounded-[2rem] min-h-[120px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold p-4"
            value={form.notes}
            onChange={(e) => setForm({...form, notes: e.target.value})}
         />
      </div>

      <div className="space-y-6 pt-6">
        {error && (
            <div className="w-full">
                <ErrorMessage message={error} onClose={() => setError("")} />
            </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
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
                className="h-16 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-slate-100 transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang ghi dữ liệu...</span>
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
