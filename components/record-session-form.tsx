"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { FormError } from "@/components/ui/form-error";
import { Loader2, Sparkles, Activity, TrendingUp, Heart, Clock, Calendar } from "lucide-react";

interface RecordSessionFormProps {
  studentId: string;
  studentName: string;
}

export function RecordSessionForm({ studentId, studentName }: RecordSessionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    class_type: "Vinyasa Flow",
    duration: 60,
    flexibility_score: 75,
    strength_score: 70,
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!form.class_type) errors.class_type = "Vui lòng nhập loại lớp học.";
    if (!form.duration || form.duration <= 0) errors.duration = "Thời lượng không hợp lệ.";
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          student_id: studentId
        }),
      });

      if (res.ok) {
        toast.success("Đã ghi nhận buổi tập", `Buổi tập của ${studentName} đã được lưu thành công.`);
        router.push(`/teacher/students/${studentId}`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error("Lỗi hệ thống", data.error || "Không thể lưu buổi tập lúc này.");
      }
    } catch (err) {
      toast.error("Lỗi mạng", "Vui lòng kiểm tra lại kết nối internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Loại lớp tập
          </Label>
          <Input 
            placeholder="Vd: Vinyasa Flow, Hatha, Yin Yoga..." 
            value={form.class_type} 
            onChange={e => setForm({...form, class_type: e.target.value})}
            error={!!fieldErrors.class_type}
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
          />
          <FormError message={fieldErrors.class_type} />
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> Ngày thực hiện
          </Label>
          <Input 
            type="date"
            value={form.date} 
            onChange={e => setForm({...form, date: e.target.value})}
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Thời lượng (Phút)
          </Label>
          <Input 
            type="number"
            value={form.duration} 
            onChange={e => setForm({...form, duration: parseInt(e.target.value)})}
            error={!!fieldErrors.duration}
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
          />
          <FormError message={fieldErrors.duration} />
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Chỉ số dẻo dai (%)
          </Label>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 h-14">
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={form.flexibility_score} 
               onChange={e => setForm({...form, flexibility_score: parseInt(e.target.value)})}
               className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
             />
             <span className="text-sm font-black text-slate-900 min-w-[2.5rem]">{form.flexibility_score}%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" /> Chỉ số sức mạnh (%)
          </Label>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 h-14">
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={form.strength_score} 
               onChange={e => setForm({...form, strength_score: parseInt(e.target.value)})}
               className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
             />
             <span className="text-sm font-black text-slate-900 min-w-[2.5rem]">{form.strength_score}%</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Ghi chú & Nhận xét</Label>
          <Textarea 
            placeholder="Vd: Học viên hoàn thành tốt các tư thế thăng bằng..."
            value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})}
            className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium p-6"
          />
        </div>
      </div>

      <div className="pt-8 border-t border-slate-50 flex justify-end">
        <Button 
          disabled={loading}
          className="h-16 px-12 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </div>
          ) : (
            <span className="flex items-center gap-3">
              Lưu buổi tập <Sparkles className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
