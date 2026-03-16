"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Activity, 
  Calendar, 
  HeartPulse, 
  UserCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap,
  Dumbbell
} from "lucide-react";

const GOALS = [
  { id: "lose_weight", label: "Giảm cân" },
  { id: "flexibility", label: "Dẻo dai" },
  { id: "stress_relief", label: "Giảm căng thẳng" },
  { id: "rehabilitation", label: "Phục hồi" },
  { id: "strength", label: "Sức mạnh" },
];

const EXPERIENCES = [
  { id: "beginner", label: "Mới bắt đầu", desc: "Chưa có kinh nghiệm" },
  { id: "intermediate", label: "Trung bình", desc: "Đã tập trên 6 tháng" },
  { id: "advanced", label: "Nâng cao", desc: "Tập luyện hàng ngày" },
];

const HEALTH_CONDITIONS = [
  { id: "back_pain", label: "Đau lưng" },
  { id: "knee_pain", label: "Đau đầu gối" },
  { id: "neck_pain", label: "Đau cổ" },
  { id: "injury_history", label: "Tiền sử chấn thương" },
  { id: "none", label: "Không có" },
];

const DAYS = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"];

export function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    experience_level: "beginner",
    goals: [] as string[],
    injuries: [] as string[],
    available_days: [] as string[],
    available_time: "",
    preferred_intensity: "Moderate",
  });

  const toggleGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));
  };

  const toggleInjury = (id: string) => {
    setForm((prev) => ({
      ...prev,
      injuries: prev.injuries.includes(id)
        ? prev.injuries.filter((i) => i !== id)
        : [...prev.injuries, id],
    }));
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/student-dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (step === 1) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Tuổi</Label>
            <Input type="number" placeholder="25" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Giới tính</Label>
            <select className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold appearance-none"
                    value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}>
              <option value="">Chọn</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Chiều cao (cm)</Label>
            <Input type="number" placeholder="170" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" value={form.height} onChange={(e) => setForm({...form, height: e.target.value})} />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Cân nặng (kg)</Label>
            <Input type="number" placeholder="65" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="button" onClick={() => setStep(2)} className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-100 transition-transform active:scale-95">
            Tiếp tục <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Trình độ của bạn</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXPERIENCES.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setForm({ ...form, experience_level: exp.id })}
                className={`p-5 text-left rounded-2xl border-2 transition-all ${
                  form.experience_level === exp.id
                    ? "border-indigo-600 bg-white shadow-lg shadow-indigo-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-100"
                }`}
              >
                <p className={`font-black text-sm ${form.experience_level === exp.id ? "text-indigo-600" : "text-slate-900"}`}>{exp.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">{exp.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Tình trạng sức khỏe</Label>
          <div className="flex flex-wrap gap-3">
            {HEALTH_CONDITIONS.map((cond) => (
              <button
                key={cond.id}
                type="button"
                onClick={() => toggleInjury(cond.id)}
                className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all ${
                  form.injuries.includes(cond.id)
                    ? "border-rose-500 bg-white text-rose-600 shadow-md shadow-rose-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white"
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={() => setStep(1)} className="h-14 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
            <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
          </Button>
          <Button type="button" onClick={() => setStep(3)} className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-100 transition-transform active:scale-95">
            Tiếp tục <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );

    if (step === 3) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Mục tiêu tập luyện</Label>
          <div className="flex flex-wrap gap-3">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all animate-soft-fade ${
                  form.goals.includes(goal.id)
                    ? "border-emerald-500 bg-white text-emerald-600 shadow-md shadow-emerald-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Lịch rảnh của bạn
          </Label>
          <div className="flex justify-between gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                  form.available_days.includes(day)
                    ? "border-indigo-600 bg-white text-indigo-600 shadow-md shadow-indigo-50"
                    : "border-slate-50 bg-slate-50/50 hover:bg-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Khung giờ rảnh</Label>
              <Input placeholder="Vd: 6:00 - 8:00 sáng" className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold px-6" value={form.available_time} onChange={(e) => setForm({...form, available_time: e.target.value})} />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Cường độ mong muốn</Label>
              <select className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold appearance-none"
                      value={form.preferred_intensity} onChange={(e) => setForm({...form, preferred_intensity: e.target.value})}>
                <option value="Gentle">Nhẹ nhàng</option>
                <option value="Moderate">Vừa phải</option>
                <option value="Vigorous">Mạnh mẽ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-50">
          <Button type="button" variant="ghost" onClick={() => setStep(2)} className="h-14 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
            <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
          </Button>
          <Button type="submit" disabled={loading} className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-100 transition-transform active:scale-95">
            {loading ? "Đang xử lý..." : "Hoàn tất khảo sát"} <Sparkles className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-12 overflow-hidden h-1.5 w-full bg-slate-100 rounded-full">
        <div className="h-full bg-indigo-600 transition-all duration-700 ease-in-out" style={{ width: `${(step/3)*100}%` }} />
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0" />
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>
      </div>
    </div>
  );
}
