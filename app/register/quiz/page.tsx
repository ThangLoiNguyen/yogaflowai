"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Heart, 
  Target, 
  Zap, 
  Clock, 
  Calendar,
  Activity,
  User2,
  ScrollText as Stretch,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const AGE_OPTIONS = [
  { value: "under_18", label: "Dưới 18" },
  { value: "18_25", label: "18 – 25" },
  { value: "26_35", label: "26 – 35" },
  { value: "36_45", label: "36 – 45" },
  { value: "above_45", label: "Trên 45" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác / Không muốn tiết lộ" }
];

const HEALTH_OPTIONS = [
  { value: "back_pain", label: "Đau lưng / cột sống" },
  { value: "joint_issues", label: "Vấn đề về khớp (gối, hông, vai)" },
  { value: "high_blood_pressure", label: "Huyết áp cao / tim mạch" },
  { value: "pregnancy", label: "Đang mang thai hoặc mới sinh" },
  { value: "none", label: "Không có vấn đề gì" },
  { value: "other", label: "Khác / Lưu ý khác" }
];

const EXPERIENCE_OPTIONS = [
  { value: "never", label: "Chưa bao giờ" },
  { value: "a_few", label: "Thử vài buổi nhưng chưa đều" },
  { value: "1_6_months", label: "Tập được 1–6 tháng" },
  { value: "above_6_months", label: "Tập trên 6 tháng" },
  { value: "above_2_years", label: "Tập trên 2 năm" }
];

const FITNESS_OPTIONS = [
  { value: "very_weak", label: "Rất yếu, ít vận động" },
  { value: "average", label: "Trung bình, thỉnh thoảng có đi bộ / tập nhẹ" },
  { value: "quite_good", label: "Khá tốt, tập thể dục đều đặn" },
  { value: "good", label: "Tốt, vận động cường độ cao thường xuyên" }
];

const FLEXIBILITY_OPTIONS = [
  { value: "very_stiff", label: "Rất cứng, cúi không chạm gối" },
  { value: "average", label: "Trung bình, cúi gần chạm ngón chân" },
  { value: "quite_flexible", label: "Khá dẻo, chạm được ngón chân" },
  { value: "very_flexible", label: "Rất dẻo, có thể xòe chân rộng / gập người sâu" }
];

const GOAL_OPTIONS = [
  { value: "stress_relief", label: "Giảm stress, thư giãn tinh thần", icon: "🧘" },
  { value: "weight_loss", label: "Giảm cân, tăng cơ", icon: "🔥" },
  { value: "flexibility", label: "Cải thiện độ linh hoạt", icon: "🤸" },
  { value: "back_pain_relief", label: "Giảm đau lưng / cải thiện tư thế", icon: "🛡️" },
  { value: "stamina", label: "Tăng sức bền, thể lực", icon: "⚡" },
  { value: "mindfulness", label: "Kết nối tâm – thân – hơi thở", icon: "✨" }
];

const STYLE_OPTIONS = [
  { value: "yin_restorative", label: "Nhẹ nhàng, phục hồi (Yin / Restorative)" },
  { value: "vinyasa_power", label: "Năng động, tăng nhịp tim (Vinyasa / Power)" },
  { value: "hatha_breathwork", label: "Chậm rãi, chú trọng hơi thở (Hatha / Breathwork)" },
  { value: "consult", label: "Chưa biết, cần giáo viên tư vấn" }
];

const FREQUENCY_OPTIONS = [
  { value: "1_2", label: "1–2 buổi / tuần" },
  { value: "3_4", label: "3–4 buổi / tuần" },
  { value: "5_plus", label: "5+ buổi / tuần" },
  { value: "unsure", label: "Chưa chắc, tùy lịch" }
];

const TIME_OPTIONS = [
  { value: "morning", label: "Buổi sáng (trước 9h)" },
  { value: "noon", label: "Buổi trưa (11h–13h)" },
  { value: "afternoon", label: "Buổi chiều (16h–18h)" },
  { value: "evening", label: "Buổi tối (sau 19h)" }
];

export default function RegisterQuizPage() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    health_issues: [] as string[],
    experience_level: "",
    fitness_level: "",
    flexibility: "",
    goals: [] as string[],
    style: "",
    available_days: [] as string[],
    preferred_time: "",
    health_issues_other: ""
  });

  const totalSteps = 10;
  const progress = (step / totalSteps) * 100;

  const handleSelect = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (step < totalSteps) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const handleMultiSelect = (field: keyof typeof answers, value: string, max: number = 99) => {
    setAnswers(prev => {
      let current = prev[field] as string[];
      if (value === "none") {
        return { ...prev, [field]: ["none"] };
      }
      if (current.includes("none")) {
        current = current.filter(v => v !== "none");
      }
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      if (current.length >= max) {
         toast.error(`Bạn chỉ có thể chọn tối đa ${max} mục`);
         return prev;
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          router.push("/login");
          return;
        }

        // Save to onboarding_quiz table (we assume it exists or use API)
        const cleanHealthIssues = answers.health_issues.filter(i => i !== "other");
        if (answers.health_issues.includes("other") && answers.health_issues_other) {
          cleanHealthIssues.push(`Lưu ý khác: ${answers.health_issues_other}`);
        } else if (answers.health_issues.includes("other")) {
          cleanHealthIssues.push(`Khác`);
        }

        const res = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            ...answers,
            health_issues: cleanHealthIssues.join(", "), // Existing API expects string or handles it
            student_id: user.id,
            timestamp: new Date().toISOString()
          })
        });

        if (res.ok) {
          toast.success("Tuyệt vời! Chúng tôi đã hiểu bạn hơn.");
          router.push("/student");
        } else {
          toast.error("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Lỗi kết nối. Vui lòng kiểm tra mạng.");
      }
    });
  };

  const canContinue = () => {
    switch (step) {
      case 1: return !!answers.age;
      case 2: return !!answers.gender;
      case 3: return answers.health_issues.length > 0;
      case 4: return !!answers.experience_level;
      case 5: return !!answers.fitness_level;
      case 6: return !!answers.flexibility;
      case 7: return answers.goals.length > 0;
      case 8: return !!answers.style;
      case 9: return answers.available_days.length > 0;
      case 10: return !!answers.preferred_time;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-sky)] flex flex-col font-ui relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-3xl mx-auto px-6 pt-10 pb-6">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-1.5">
             <span className="font-display text-2xl text-slate-900">Yog</span>
             <span className="text-2xl text-[var(--accent)] font-bold">AI</span>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Câu hỏi {step}/{totalSteps}
             </span>
             <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-[var(--accent)] transition-all duration-500 ease-out" 
                 style={{ width: `${progress}%` }}
               />
             </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 flex flex-col justify-center pb-24">
        <div key={step} className="animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both">
          
          {/* Section Indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-1 bg-[var(--accent)] rounded-full" />
            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">
              {step <= 3 ? "PHẦN A: Thông tin cơ bản" : step <= 6 ? "PHẦN B: Kinh nghiệm & Trình độ" : "PHẦN C: Mục tiêu & Lịch trình"}
            </span>
          </div>

          {/* Question Title */}
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-8">
            {step === 1 && "Bạn bao nhiêu tuổi?"}
            {step === 2 && "Giới tính của bạn?"}
            {step === 3 && "Bạn đang có vấn đề sức khỏe nào không?"}
            {step === 4 && "Bạn đã từng tập Yoga chưa?"}
            {step === 5 && "Bạn tự đánh giá thể lực hiện tại của mình ở mức nào?"}
            {step === 6 && "Độ linh hoạt cơ thể của bạn hiện tại?"}
            {step === 7 && "Mục tiêu chính khi tập Yoga của bạn là gì?"}
            {step === 8 && "Bạn muốn tập theo phong cách nào?"}
            {step === 9 && "Bạn có thể dành bao nhiêu thời gian mỗi tuần để tập?"}
            {step === 10 && "Thời điểm bạn thích tập nhất trong ngày?"}
          </h2>

          <p className="text-slate-500 text-sm mb-8 -mt-4">
            {step === 3 && "(Chọn tất cả những gì áp dụng với bạn)"}
            {step === 7 && "(Chọn tối đa 2 mục tiêu quan trọng nhất)"}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {step === 1 && AGE_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.age === opt.value} 
                onClick={() => handleSelect("age", opt.value)} 
              />
            ))}

            {step === 2 && GENDER_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.gender === opt.value} 
                onClick={() => handleSelect("gender", opt.value)} 
              />
            ))}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {HEALTH_OPTIONS.map(opt => (
                    <OptionCard 
                      key={opt.value} 
                      label={opt.label} 
                      selected={answers.health_issues.includes(opt.value)} 
                      onClick={() => handleMultiSelect("health_issues", opt.value)}
                      isMulti
                    />
                  ))}
                </div>
                {answers.health_issues.includes("other") && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <Textarea 
                      autoFocus
                      className="w-full p-4 rounded-xl border-2 border-[var(--accent)] outline-none min-h-[100px] bg-white shadow-inner"
                      placeholder="Hãy mô tả chi tiết vấn đề sức khỏe khác của bạn..."
                      value={answers.health_issues_other || ""}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswers({...answers, health_issues_other: e.target.value})}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 4 && EXPERIENCE_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.experience_level === opt.value} 
                onClick={() => handleSelect("experience_level", opt.value)} 
              />
            ))}

            {step === 5 && FITNESS_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.fitness_level === opt.value} 
                onClick={() => handleSelect("fitness_level", opt.value)} 
              />
            ))}

            {step === 6 && FLEXIBILITY_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.flexibility === opt.value} 
                onClick={() => handleSelect("flexibility", opt.value)} 
              />
            ))}

            {step === 7 && (
              <div className="grid grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleMultiSelect("goals", opt.value, 2)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all h-full flex flex-col gap-3 group ${answers.goals.includes(opt.value) ? "border-[var(--accent)] bg-white shadow-lg shadow-[var(--accent)]/10" : "border-slate-200 bg-white/50 hover:border-slate-300"}`}
                  >
                    <div className="text-2xl">{opt.icon}</div>
                    <div className="flex items-start justify-between">
                      <span className={`text-sm font-bold leading-snug ${answers.goals.includes(opt.value) ? "text-slate-900" : "text-slate-600"}`}>
                        {opt.label}
                      </span>
                      {answers.goals.includes(opt.value) && (
                        <div className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 8 && STYLE_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.style === opt.value} 
                onClick={() => handleSelect("style", opt.value)} 
              />
            ))}

            {step === 9 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"].map(day => (
                  <button
                    key={day}
                    onClick={() => handleMultiSelect("available_days", day)}
                    className={`h-14 rounded-2xl border-2 font-black transition-all ${answers.available_days.includes(day) ? "border-[var(--accent)] bg-white shadow-lg shadow-[var(--accent)]/10" : "border-slate-200 bg-white/50 text-slate-400"}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}

            {step === 10 && TIME_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.value} 
                label={opt.label} 
                selected={answers.preferred_time === opt.value} 
                onClick={() => handleSelect("preferred_time", opt.value)} 
              />
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-5 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isPending}
            className="rounded-full px-6 text-slate-500 font-bold hover:bg-slate-100 disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <Button 
            onClick={step === totalSteps ? handleSubmit : () => setStep(step + 1)}
            disabled={!canContinue() || isPending}
            className={`rounded-full px-8 h-12 font-bold shadow-lg transition-all ${isPending ? 'opacity-70' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            style={{ backgroundColor: canContinue() ? "var(--accent)" : "var(--border)", color: "white" }}
          >
            {step === totalSteps ? (
              <>
                {isPending ? "Đang xử lý..." : "Hoàn tất & Bắt đầu"}
                {!isPending && <CheckCircle2 className="w-5 h-5 ml-2" />}
              </>
            ) : (
              <>
                Tiếp tục
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function OptionCard({ label, selected, onClick, isMulti }: { label: string, selected: boolean, onClick: () => void, isMulti?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${selected ? "border-[var(--accent)] bg-white shadow-lg shadow-[var(--accent)]/10 ring-1 ring-[var(--accent)]/20" : "border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white"}`}
    >
      <span className={`text-base md:text-lg font-bold text-left ${selected ? "text-slate-900" : "text-slate-600"}`}>
        {label}
      </span>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-[var(--accent)] border-[var(--accent)]" : "border-slate-200 group-hover:border-slate-300"}`}>
        {selected && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
    </button>
  );
}
