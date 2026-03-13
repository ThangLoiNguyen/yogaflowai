"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Calendar, HeartPulse, UserCircle2, ArrowRight, ArrowLeft } from "lucide-react";

const GOALS = ["Dẻo dai", "Giảm cân", "Giảm căng thẳng", "Phục hồi", "Sức mạnh"];
const DIFFICULTY = ["Nhẹ nhàng", "Trung bình", "Năng động"];
const GENDERS = ["Nam", "Nữ", "Khác"];
const EXPERIENCES = ["Mới bắt đầu", "Đã tập 1-6 tháng", "Thường xuyên", "Nâng cao"];

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
      }
      const data = await res.json();
      onRecommended?.(data.courses ?? []);
      router.push("/recommendation");
    } finally {
      // Intentionally not setting loading to false if we route away to avoid flashing
      if (!isSuccess) setLoading(false); 
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <UserCircle2 className="w-6 h-6 text-sky-500" />
              Who are you?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Basic details help the AI calibrate safety thresholds for common poses.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g. 28"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                className="h-12 max-w-[200px] text-lg"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">Gender</Label>
              <div className="grid grid-cols-3 gap-3">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, gender: g }))}
                    className={`h-12 rounded-xl border-2 transition-all font-medium ${
                      form.gender === g
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => setStep(2)}
              size="lg"
              className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-md transition-transform active:scale-95"
            >
              Next: Experience & Body
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-rose-500" />
              Body & Experience
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tell us about your yoga background and any physical limitations so we can filter out dangerous poses.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Yoga Experience Level</Label>
              <div className="grid grid-cols-2 gap-3">
                {EXPERIENCES.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, yoga_experience: exp }))}
                    className={`p-3 text-sm rounded-xl border-2 transition-all font-medium ${
                      form.yoga_experience === exp
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Medical Conditions & Injuries</Label>
              <Textarea
                id="health"
                placeholder="E.g., lower back pain, tight hamstrings, recent knee surgery..."
                value={form.health_conditions || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, health_conditions: e.target.value }))
                }
                className="min-h-[100px] resize-none text-base"
              />
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                * AI will strictly avoid recommending classes that aggravate these areas.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button
              type="button"
              onClick={() => setStep(1)}
              variant="ghost"
              className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(3)}
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-md transition-transform active:scale-95"
            >
              Next: Goals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              Your Goals & Vibe
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              What do you want to achieve with your practice?
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-base">Primary Goals</Label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((goal) => {
                  const active = form.goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors border-2 ${
                        active
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Preferred Intensity</Label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY.map((level) => {
                  const active = form.difficulty === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, difficulty: level }))
                      }
                      className={`p-3 text-sm rounded-xl border-2 transition-all font-medium ${
                        active
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Schedule (Optional)
              </Label>
              <Input
                id="days"
                placeholder="e.g. 3 days a week, mostly mornings"
                value={form.availability || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, availability: e.target.value }))
                }
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              onClick={() => setStep(2)}
              variant="ghost"
              className="text-slate-500 hover:text-slate-900 mt-4"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r mt-4 from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 hover:opacity-90 transition-transform active:scale-95 border-0"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Details...
                </div>
              ) : (
                "Get AI Recommendations"
              )}
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto border-0 sm:border border-slate-100 sm:bg-white sm:shadow-xl sm:shadow-slate-200/40 p-0 sm:p-10 rounded-3xl dark:border-slate-800 dark:sm:bg-slate-900/50 dark:shadow-none">
      <div className="mb-10">
        <div className="flex justify-between text-sm font-medium text-slate-400 dark:text-slate-500 mb-3">
          <span>Step {step} of 3</span>
          <span>{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-900 dark:bg-white transition-all duration-700 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
      </form>
    </div>
  );
}

