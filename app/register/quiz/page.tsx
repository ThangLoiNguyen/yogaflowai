"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const GOALS = [
  { id: "flexibility", label: "Dẻo dai", icon: "🧘" },
  { id: "stress", label: "Giảm stress", icon: "✨" },
  { id: "strength", label: "Tăng sức mạnh", icon: "💪" },
  { id: "weight_loss", label: "Giảm cân", icon: "🔥" },
  { id: "meditation", label: "Thiền định", icon: "🌙" }
];

const EXPERIENCE_LEVELS = [
  { level: 1, label: "Chưa bao giờ", desc: "Tôi là người mới hoàn toàn" },
  { level: 2, label: "Mới tập", desc: "Đã tập vài buổi" },
  { level: 3, label: "Trung bình", desc: "Tập được 6 tháng - 1 năm" },
  { level: 4, label: "Nâng cao", desc: "Tập trên 2 năm" },
  { level: 5, label: "Chuyên nghiệp", desc: "Tôi là giáo viên/vđv" }
];

const HEALTH_TAGS = ["Đau lưng", "Huyết áp", "Đau cổ", "Chấn thương gối", "Tim mạch", "Mang thai"];

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function OnboardingQuiz() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const [answers, setAnswers] = useState({
    goals: [] as string[],
    experience_level: 1,
    health_issues: "",
    available_days: [] as string[],
    fitness_level: 3,
    expectations: "",
    contraindications: [] as string[]
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const toggleGoal = (id: string) => {
    setAnswers(prev => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter(g => g !== id) : [...prev.goals, id]
    }));
  };

  const toggleDay = (day: string) => {
    setAnswers(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day) ? prev.available_days.filter(d => d !== day) : [...prev.available_days, day]
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Vui lòng đăng nhập để lưu kết quả.");
          router.push("/login");
          return;
        }

        // 1. Generate embedding (Mocked for now, usually done via API)
        // In a real app, you'd call an API route like /api/ai/onboarding-embedding
        const rawText = `${answers.goals.join(", ")} | Exp: ${answers.experience_level} | Health: ${answers.health_issues}`;
        
        // Let's assume the API saves the quiz and generates embedding
        const res = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...answers, student_id: user.id })
        });

        if (res.ok) {
          toast.success("Thông tin đã được lưu. AI đang tìm lớp phù hợp cho bạn!");
          router.push("/student/explore");
        } else {
          toast.error("Có lỗi xảy ra khi lưu thông tin.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Lỗi kết nối hệ thống.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-5 font-ui">
      {/* Top Banner & Progress */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
           <div className="font-display text-2xl">Yog<span className="text-[var(--accent)] font-ui font-medium">AI</span></div>
           <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Bước {step} của {totalSteps}</div>
        </div>
        <Progress value={progress} className="h-1.5 bg-[var(--bg-muted)]" />
      </div>

      {/* Question Content */}
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center py-12">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-8">Mục tiêu của bạn khi tập yoga là gì?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-[var(--r-lg)] border-2 text-left transition-all flex items-center gap-4 ${answers.goals.includes(goal.id) ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-[var(--border)] hover:border-[var(--accent-light)]"}`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-medium text-[var(--text-primary)]">{goal.label}</span>
                  {answers.goals.includes(goal.id) && <Check className="ml-auto w-5 h-5 text-[var(--accent)]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-8">Bạn đã có kinh nghiệm tập yoga chưa?</h2>
            <div className="space-y-4">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  key={exp.level}
                  onClick={() => setAnswers({...answers, experience_level: exp.level})}
                  className={`w-full p-4 rounded-[var(--r-lg)] border-2 text-left transition-all flex items-center gap-4 ${answers.experience_level === exp.level ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-[var(--border)] hover:border-[var(--accent-light)]"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${answers.experience_level === exp.level ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"}`}>
                    {exp.level}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">{exp.label}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{exp.desc}</div>
                  </div>
                  {answers.experience_level === exp.level && <Check className="ml-auto w-5 h-5 text-[var(--accent)]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4">Bạn có vấn đề sức khỏe nào cần lưu ý?</h2>
            <p className="text-[var(--text-secondary)] mb-8">Điều này giúp giáo viên điều chỉnh tư thế an toàn cho bạn.</p>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                 {HEALTH_TAGS.map(tag => (
                   <button 
                     key={tag}
                     onClick={() => {
                        const current = answers.health_issues;
                        setAnswers({...answers, health_issues: current.includes(tag) ? current.replace(tag + ", ", "").replace(tag, "") : current + (current ? ", " : "") + tag});
                     }}
                     className={`px-4 py-2 rounded-full border text-sm transition-colors ${answers.health_issues.includes(tag) ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-white text-[var(--text-secondary)] border-[var(--border)]"}`}
                   >
                     {tag}
                   </button>
                 ))}
              </div>
              <textarea 
                className="w-full p-4 rounded-[var(--r-lg)] border-[var(--border-medium)] focus:border-[var(--accent)] outline-none min-h-[150px] text-lg"
                placeholder="Ghi chú thêm về sức khỏe của bạn (nếu có)..."
                value={answers.health_issues}
                onChange={(e) => setAnswers({...answers, health_issues: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4">Bạn thường rảnh vào những ngày nào?</h2>
            <p className="text-[var(--text-secondary)] mb-12">Chúng tôi sẽ gợi ý lịch học phù hợp nhất.</p>
            <div className="flex justify-between gap-2 max-w-lg mx-auto">
               {DAYS.map(day => (
                 <button
                   key={day}
                   onClick={() => toggleDay(day)}
                   className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-bold transition-all ${answers.available_days.includes(day) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-light)]"}`}
                 >
                   {day}
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <h2 className="mb-4">Thể lực hiện tại của bạn?</h2>
            <p className="text-[var(--text-secondary)] mb-16">Trung thực với bản thân để AI tìm lớp đúng sức nhé!</p>
            <div className="px-6">
               <div className="mb-12 text-6xl">
                 {answers.fitness_level === 1 && "😌"}
                 {answers.fitness_level === 2 && "🙂"}
                 {answers.fitness_level === 3 && "😐"}
                 {answers.fitness_level === 4 && "😤"}
                 {answers.fitness_level === 5 && "🥇"}
               </div>
               <input 
                 type="range" 
                 min="1" max="5" 
                 className="w-full h-2 bg-[var(--bg-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                 value={answers.fitness_level}
                 onChange={(e) => setAnswers({...answers, fitness_level: parseInt(e.target.value)})}
               />
               <div className="flex justify-between mt-4 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                 <span>Rất yếu</span>
                 <span>Vận động viên</span>
               </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-8">Kỳ vọng của bạn sau khóa học?</h2>
            <textarea 
                className="w-full p-4 rounded-[var(--r-lg)] border-[var(--border-medium)] focus:border-[var(--accent)] outline-none min-h-[150px] text-lg"
                placeholder="Vd: Tôi muốn chạm được tay xuống đất, hoặc giảm đau mỏi vai gáy..."
                value={answers.expectations}
                onChange={(e) => setAnswers({...answers, expectations: e.target.value})}
              />
          </div>
        )}

        {step === 7 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4">Chống chỉ định (nếu có)?</h2>
            <p className="text-[var(--text-secondary)] mb-10">Những điều bạn tuyệt đối không được làm theo chỉ định bác sĩ.</p>
            <div className="space-y-4">
               {["Phẫu thuật gần đây (dưới 6 tháng)", "Thoát vị đĩa đệm nặng", "Tăng nhãn áp", "Đang có vết thương hở"].map(item => (
                 <button
                   key={item}
                   onClick={() => {
                     setAnswers(prev => ({
                       ...prev,
                       contraindications: prev.contraindications.includes(item) ? prev.contraindications.filter(c => c !== item) : [...prev.contraindications, item]
                     }));
                   }}
                   className={`w-full p-5 rounded-[var(--r-md)] border-2 text-left flex items-center gap-4 transition-all ${answers.contraindications.includes(item) ? "border-red-400 bg-red-50" : "border-[var(--border)] hover:border-[var(--accent-light)]"}`}
                 >
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers.contraindications.includes(item) ? "border-red-500 bg-red-500" : "border-[var(--border)]"}`}>
                     {answers.contraindications.includes(item) && <Check className="w-4 h-4 text-white" />}
                   </div>
                   <span className={answers.contraindications.includes(item) ? "text-red-700 font-medium" : "text-[var(--text-secondary)]"}>{item}</span>
                 </button>
               ))}
               <div className="flex gap-2 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm mt-8">
                 <Info className="w-5 h-5 shrink-0" />
                 <span>Nếu bạn không có chống chỉ định nào, vui lòng bỏ qua bước này và nhấn Hoàn tất.</span>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="w-full max-w-2xl py-8 border-t border-[var(--border)] flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          disabled={step === 1 || isPending}
          className="h-9 px-6 rounded-full text-[var(--text-secondary)] disabled:opacity-0"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Quay lại
        </Button>

        <div className="flex gap-4">
          {step < totalSteps ? (
            <Button 
              onClick={nextStep}
              className="btn-primary px-6 h-9"
            >
              Tiếp tục
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="btn-primary px-6 h-10 text-lg"
            >
              {isPending ? "Đang xử lý..." : "Hoàn tất & Nhận gợi ý"}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
