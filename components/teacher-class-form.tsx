"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { FormError } from "@/components/ui/form-error";
import { ErrorMessage } from "@/components/ui/error-message";
import { 
  PlusCircle, 
  Loader2, 
  Sparkles, 
  LayoutGrid, 
  Clock, 
  Calendar,
  Zap,
  Target
} from "lucide-react";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const INTENSITIES = ["Gentle", "Moderate", "Dynamic"];
const FOCUS_AREAS = ["Flexibility", "Strength", "Balance", "Relaxation", "Meditation", "Breathwork"];

export function TeacherClassForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: "",
    level: "Beginner",
    duration: "60 Phút",
    intensity: "Moderate",
    focus: [] as string[],
    max_capacity: 20,
    schedule: "Thứ 2, 4, 6 • 18:00",
  });

  const toggleFocus = (item: string) => {
    setForm(prev => ({
      ...prev,
      focus: prev.focus.includes(item) 
        ? prev.focus.filter(i => i !== item) 
        : [...prev.focus, item]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!form.name) errors.name = "Vui lòng nhập tên lớp học.";
    if (!form.schedule) errors.schedule = "Vui lòng nhập lịch học.";
    if (!form.duration) errors.duration = "Vui lòng nhập thời lượng.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Tạo lớp thành công", "Lớp học mới đã sẵn sàng cho học viên đăng ký.");
        router.push("/teacher-dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Giao thức truyền tải dữ liệu thất bại.");
        toast.error("Lỗi hệ thống", data.error || "Không thể khởi tạo lớp học lúc này.");
      }
    } catch (err) {
      setError("Mất kết nối với cơ sở dữ liệu trung tâm.");
      toast.error("Lỗi mạng", "Vui lòng kiểm tra lại kết nối internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10 animate-soft-fade">
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Tên lớp học</Label>
        <Input 
          placeholder="Vd: Vinyasa Flow Cơ Bản" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
          className={`h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 ${fieldErrors.name ? 'border-rose-200 bg-rose-50/20' : ''}`}
        />
        <FormError message={fieldErrors.name} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Cấp độ</Label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setForm({...form, level: l})}
                className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.level === l ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Cường độ</Label>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITIES.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setForm({...form, intensity: i})}
                className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.intensity === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                {i === 'Gentle' ? 'Nhẹ' : i === 'Moderate' ? 'Vừa' : 'Mạnh'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Thời lượng</Label>
          <Input 
            placeholder="Vd: 60 Phút" 
            value={form.duration} 
            onChange={e => setForm({...form, duration: e.target.value})}
            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Lịch học</Label>
          <Input 
            placeholder="Vd: Thứ 2, 4, 6 • 18:00" 
            value={form.schedule} 
            onChange={e => setForm({...form, schedule: e.target.value})}
            className={`h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6 ${fieldErrors.schedule ? 'border-rose-200 bg-rose-50/20' : ''}`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Mục tiêu tập trung</Label>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => toggleFocus(f)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${form.focus.includes(f) ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
         <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Sức chứa tối đa</Label>
         <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-50">
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5"
              value={form.max_capacity} 
              onChange={e => setForm({...form, max_capacity: parseInt(e.target.value)})}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" 
            />
            <span className="text-xl font-black text-slate-900 min-w-[3rem] text-center">{form.max_capacity} HV</span>
         </div>
      </div>

      <div className="pt-6">
        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
        
        <div className="flex justify-end pt-4 border-t border-slate-100">
           <Button 
            disabled={loading} 
            className="h-16 px-12 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-slate-100 transition-all active:scale-95 disabled:grayscale"
           >
             {loading ? (
               <div className="flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin" />
                 <span>Đang khởi tạo...</span>
               </div>
             ) : (
               <span className="flex items-center gap-3">
                 Khởi tạo lớp học <Sparkles className="w-4 h-4" />
               </span>
             ) }
           </Button>
        </div>
      </div>
    </form>
  );
}
