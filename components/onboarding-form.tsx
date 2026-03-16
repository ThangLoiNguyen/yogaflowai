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
  CheckCircle2,
  Dumbbell
} from "lucide-react";

const GOALS = [
  { id: "lose_weight", label: "Lose Weight" },
  { id: "flexibility", label: "Flexibility" },
  { id: "stress_relief", label: "Stress Relief" },
  { id: "rehabilitation", label: "Rehabilitation" },
  { id: "strength", label: "Strength" },
];

const EXPERIENCES = [
  { id: "beginner", label: "Beginner", desc: "No experience" },
  { id: "intermediate", label: "Intermediate", desc: "Practicing 6+ months" },
  { id: "advanced", label: "Advanced", desc: "Daily practice" },
];

const HEALTH_CONDITIONS = [
  { id: "back_pain", label: "Back Pain" },
  { id: "knee_pain", label: "Knee Pain" },
  { id: "neck_pain", label: "Neck Pain" },
  { id: "injury_history", label: "Injury History" },
  { id: "none", label: "None" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STEPS = [
  { label: "Basic Info", icon: UserCircle2 },
  { label: "Experience", icon: HeartPulse },
  { label: "Goals & Schedule", icon: Activity },
];

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
      // API call to save student profile (should be implemented)
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
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Age</Label>
            <Input type="number" placeholder="25" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <select className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent"
                    value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input type="number" placeholder="170" value={form.height} onChange={(e) => setForm({...form, height: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input type="number" placeholder="65" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="button" onClick={() => setStep(2)}>
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Experience Level</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {EXPERIENCES.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setForm({ ...form, experience_level: exp.id })}
                className={`p-4 text-left rounded-xl border-2 transition-all ${
                  form.experience_level === exp.id
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 shadow-sm"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <p className="font-bold">{exp.label}</p>
                <p className="text-xs text-slate-500">{exp.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Health Conditions</Label>
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map((cond) => (
              <button
                key={cond.id}
                type="button"
                onClick={() => toggleInjury(cond.id)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  form.injuries.includes(cond.id)
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={() => setStep(1)}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <Button type="button" onClick={() => setStep(3)}>
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );

    if (step === 3) return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Yoga Goals</Label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  form.goals.includes(goal.id)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Schedule Availability
          </Label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  form.available_days.includes(day)
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Time of Day</Label>
              <Input placeholder="e.g. 6:00 AM - 8:00 AM" value={form.available_time} onChange={(e) => setForm({...form, available_time: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Preferred Intensity</Label>
              <select className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent"
                      value={form.preferred_intensity} onChange={(e) => setForm({...form, preferred_intensity: e.target.value})}>
                <option value="Gentle">Gentle</option>
                <option value="Moderate">Moderate</option>
                <option value="Vigorous">Vigorous</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={() => setStep(2)}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            {loading ? "Generating..." : "Generate AI Recommendation"} <Sparkles className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 overflow-hidden h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
        <div className="h-full bg-sky-500 transition-all duration-500 ease-out" style={{ width: `${(step/3)*100}%` }} />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>
      </div>
    </div>
  );
}
