"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const GOALS = ["Dẻo dai", "Giảm cân", "Giảm căng thẳng", "Phục hồi"];
const DIFFICULTY = ["Nhẹ nhàng", "Trung bình", "Năng động"];

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
      const data = await res.json();
      onRecommended?.(data.courses ?? []);
      router.push("/recommendation");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Bước 1: Thông tin cơ bản</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cho chúng tôi biết một chút về bạn để cá nhân hóa lớp học.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="age">Tuổi</Label>
              <Input
                id="age"
                type="number"
                placeholder="VD: 32"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Giới tính</Label>
              <Input
                id="gender"
                placeholder="Tùy chọn"
                value={form.gender}
                onChange={(e) =>
                  setForm((f) => ({ ...f, gender: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setStep(2)}
            className="w-full bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:w-auto"
          >
            Tiếp theo: Tình trạng sức khỏe
          </Button>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Bước 2: Tình trạng sức khỏe</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">An toàn là trên hết. Hãy cho biết tình trạng cơ thể hiện tại của bạn.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experience">Kinh nghiệm tập Yoga</Label>
            <Input
              id="experience"
              placeholder="Người mới bắt đầu, trung bình, nâng cao"
              value={form.yoga_experience}
              onChange={(e) =>
                setForm((f) => ({ ...f, yoga_experience: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="health">Tình trạng y tế</Label>
            <Textarea
              id="health"
              placeholder="Chấn thương, đau mãn tính, mang thai, lưu ý y tế..."
              value={form.health_conditions}
              onChange={(e) =>
                setForm((f) => ({ ...f, health_conditions: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setStep(1)}
              variant="outline"
              className="border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Quay lại
            </Button>
            <Button
              type="button"
              onClick={() => setStep(3)}
              className="w-full bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:w-auto"
            >
              Tiếp theo: Mục tiêu
            </Button>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Bước 3: Mục tiêu</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bạn muốn đạt được điều gì cùng YogaFlow AI?</p>
          </div>
          <div className="space-y-2">
            <Label>Mục tiêu</Label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((goal) => {
                const active = form.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      active
                        ? "border-sky-400 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="days">Lịch tập mong muốn</Label>
              <Input
                id="days"
                placeholder="VD: 3 ngày mỗi tuần"
                value={form.availability}
                onChange={(e) =>
                  setForm((f) => ({ ...f, availability: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Độ khó lớp học</Label>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY.map((level) => {
                  const active = form.difficulty === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, difficulty: level }))
                      }
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-indigo-400 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setStep(2)}
              variant="outline"
              className="border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              disabled={loading}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              className="w-full bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 sm:w-auto"
              disabled={loading}
            >
              {loading ? "Đang tìm lớp học..." : "Nhận đề xuất từ AI"}
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-2xl border border-slate-200 bg-slate-50 p-6 rounded-xl dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>Bước {step} trên 4</span>
          <span>{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sky-500 dark:bg-sky-400 transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
      </form>
    </div>
  );
}

