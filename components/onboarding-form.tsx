"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Calendar, HeartPulse, UserCircle2, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const GOALS = ["Dẻo dai", "Giảm cân", "Giảm căng thẳng", "Phục hồi", "Sức mạnh", "Thiền định"];
const DIFFICULTY = [
  { id: "Nhẹ nhàng", emoji: "🌿", desc: "Thư giãn, nhịp chậm" },
  { id: "Trung bình", emoji: "⚡", desc: "Cân bằng & tập trung" },
  { id: "Năng động", emoji: "🔥", desc: "Thử thách & nâng cao" },
];
const GENDERS = ["Nam", "Nữ", "Khác"];
const EXPERIENCES = [
  { id: "Mới bắt đầu", desc: "Chưa từng tập yoga trước đây" },
  { id: "Đã tập 1-6 tháng", desc: "Đã quen với một số tư thế cơ bản" },
  { id: "Thường xuyên", desc: "Tập đều đặn hơn 6 tháng" },
  { id: "Nâng cao", desc: "Thành thạo nhiều phong cách yoga" },
];

const STEPS = [
  { label: "Thông tin", icon: UserCircle2, color: "text-sky-500" },
  { label: "Cơ thể", icon: HeartPulse, color: "text-rose-500" },
  { label: "Mục tiêu", icon: Activity, color: "text-emerald-500" },
];

export type StudentOnboardingPayload = {
  age: number | null;
  gender: string | null;
  yoga_experience: string | null;
  health_conditions: string | null;
  goals: string[];
  availability: string | null;
  difficulty: string | null;
};

export function OnboardingForm({
  onRecommended,
}: {
  onRecommended?: (courses: any[]) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    age: "",
    gender: "",
    yoga_experience: "",
    health_conditions: "",
    goals: [] as string[],
    availability: "",
    difficulty: "",
  });

  const toggleGoal = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let isSuccess = false;
    try {
      const payload: StudentOnboardingPayload = {
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        yoga_experience: form.yoga_experience || null,
        health_conditions: form.health_conditions || null,
        goals: form.goals,
        availability: form.availability || null,
        difficulty: form.difficulty || null,
      };
      const res = await fetch("/api/recommend-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        isSuccess = true;
        const data = await res.json();
        onRecommended?.(data.courses ?? []);
      }
      router.push("/recommendation");
    } finally {
      if (!isSuccess) setLoading(false);
    }
  };

  const renderStep = () => {
    if (step === 1) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-500/10">
              <UserCircle2 className="w-5 h-5 text-sky-500" />
            </div>
            Xin chào! Bạn là ai?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">
            Thông tin cơ bản giúp AI của chúng tôi xác định mức độ tập luyện phù hợp và đảm bảo an toàn cho bạn.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tuổi của bạn</Label>
            <Input
              id="age"
              type="number"
              placeholder="Ví dụ: 28"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              className="h-12 max-w-[180px] text-lg font-semibold shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Giới tính</Label>
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gender: g }))}
                  className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.gender === g
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="button" onClick={() => setStep(2)} size="lg"
            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-semibold shadow-md active:scale-95">
            Tiếp theo <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10">
              <HeartPulse className="w-5 h-5 text-rose-500" />
            </div>
            Cơ thể & Kinh nghiệm
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">
            Giúp AI loại bỏ các tư thế nguy hiểm và chọn lớp phù hợp với mức độ hiện tại của bạn.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kinh nghiệm yoga</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPERIENCES.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, yoga_experience: exp.id }))}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    form.yoga_experience === exp.id
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <p className={`text-sm font-semibold ${form.yoga_experience === exp.id ? "text-indigo-700 dark:text-indigo-300" : "text-slate-800 dark:text-slate-200"}`}>{exp.id}</p>
                  <p className={`text-xs mt-0.5 ${form.yoga_experience === exp.id ? "text-indigo-500 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}>{exp.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tình trạng sức khỏe & chấn thương <span className="font-normal text-slate-400">(tùy chọn)</span>
            </Label>
            <Textarea
              id="health"
              placeholder="Ví dụ: đau lưng dưới, đầu gối yếu, vừa phẫu thuật..."
              value={form.health_conditions || ""}
              onChange={(e) => setForm((f) => ({ ...f, health_conditions: e.target.value }))}
              className="min-h-[100px] resize-none text-sm shadow-sm"
            />
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 p-3">
              <span className="text-amber-500 text-sm">⚠️</span>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">AI sẽ tự động tránh đề xuất các lớp học có thể gây hại cho những vùng này.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Button type="button" onClick={() => setStep(1)} variant="ghost"
            className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button type="button" onClick={() => setStep(3)} size="lg"
            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-semibold shadow-md active:scale-95">
            Tiếp theo <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );

    if (step === 3) return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-400">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            Mục tiêu & Phong cách
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">
            Bạn muốn đạt được gì qua yoga? AI sẽ ưu tiên đề xuất dựa trên điều này.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mục tiêu chính <span className="font-normal text-slate-400">(chọn nhiều)</span></Label>
            <div className="flex flex-wrap gap-2.5">
              {GOALS.map((goal) => {
                const active = form.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all border-2 ${
                      active
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cường độ ưa thích</Label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY.map(({ id, emoji, desc }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, difficulty: id }))}
                  className={`p-4 text-center rounded-xl border-2 transition-all ${
                    form.difficulty === id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-2xl block mb-1">{emoji}</span>
                  <p className={`text-xs font-semibold ${form.difficulty === id ? "text-amber-700 dark:text-amber-300" : "text-slate-800 dark:text-slate-200"}`}>{id}</p>
                  <p className={`text-[10px] mt-0.5 ${form.difficulty === id ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`}>{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Lịch tập <span className="font-normal text-slate-400">(tùy chọn)</span>
            </Label>
            <Input
              id="days"
              placeholder="Ví dụ: 3 buổi mỗi tuần, chủ yếu buổi sáng"
              value={form.availability || ""}
              onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
              className="h-12 shadow-sm"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <Button type="button" onClick={() => setStep(2)} variant="ghost"
            className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium mt-4" disabled={loading}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button type="submit" size="lg"
            className="bg-gradient-to-r mt-4 from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all active:scale-95 border-0 font-semibold"
            disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang phân tích...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Xem gợi ý của AI
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === i + 1;
            const isDone = step > i + 1;
            return (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all text-xs font-bold ${
                  isDone ? "bg-emerald-500 text-white" : isActive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`hidden sm:inline text-xs font-semibold transition-colors ${isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 w-8 sm:w-16 mx-1 rounded-full transition-colors ${step > i + 1 ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-700 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>
      </div>
    </div>
  );
}
