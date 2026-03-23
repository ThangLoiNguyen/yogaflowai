"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// More detailed SVG Body Paths
const BODY_PARTS = [
  { id: "neck", label: "Cổ/Vai", path: "M 100 20 C 80 20 80 60 100 60 C 120 60 120 20 100 20 Z" }, // Head/Neck
  { id: "upper_back", label: "Lưng trên", path: "M 60 65 L 140 65 L 145 120 L 55 120 Z" },
  { id: "lower_back", label: "Lưng dưới", path: "M 55 125 L 145 125 L 140 180 L 60 180 Z" },
  { id: "wrists", label: "Cổ tay", path: "M 25 110 L 45 110 L 45 130 L 25 130 Z M 155 110 L 175 110 L 175 130 L 155 130 Z" },
  { id: "hips", label: "Hông", path: "M 60 185 L 140 185 L 145 220 L 55 220 Z" },
  { id: "knees", label: "Đầu gối", path: "M 65 290 L 85 290 L 85 310 L 65 310 Z M 115 290 L 135 290 L 135 310 L 115 310 Z" },
  { id: "thighs", label: "Đùi", path: "M 55 225 L 95 225 L 85 285 L 65 285 Z M 105 225 L 145 225 L 135 285 L 115 285 Z" },
  { id: "feet", label: "Bàn chân", path: "M 65 320 L 85 320 L 85 340 L 55 340 Z M 115 320 L 135 320 L 145 340 L 115 340 Z" }
];

const MOTIVATIONS = [
  { id: 1, emoji: "😫", label: "Kiệt sức" },
  { id: 2, emoji: "😕", label: "Hơi mệt" },
  { id: 3, emoji: "😐", label: "Bình thường" },
  { id: 4, emoji: "🙂", label: "Hứng khởi" },
  { id: 5, emoji: "🤩", label: "Tuyệt vời" },
];

const FOCUS_TAGS = ["Dẻo dai", "Sức mạnh", "Thăng bằng", "Hơi thở", "Tĩnh tâm", "Phục hồi"];

const SUGGESTED_POSES = ["Downward Dog", "Warrior I", "Warrior II", "Tree Pose", "Plank", "Cobra", "Child's Pose", "Crow Pose"];

export default function SessionQuizPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params?.id;
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [answers, setAnswers] = useState({
    fatigue_level: 5,
    pain_areas: [] as string[],
    hardest_pose: "",
    improvement_noticed: "",
    motivation_level: 3,
    focus_next: [] as string[],
    free_notes: ""
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const toggleArray = (field: 'pain_areas' | 'focus_next', value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
    }));
  };

  const nextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/ai/analyze-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            session_id: sessionId, 
            answers: {
              ...answers,
              focus_next: answers.focus_next.join(", ")
            } 
          })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Lỗi máy chủ");

        toast.success("Cảm ơn bạn đã gửi phản hồi!");
        router.push("/student");
      } catch (err: any) {
        console.error("Submission error:", err);
        toast.error("Lỗi gửi feedback: " + err.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center font-sans text-slate-900">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 py-4 px-6 flex flex-col gap-4 shadow-sm">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Sparkles className="w-4 h-4" />
             </div>
             <div className="font-black text-lg tracking-tight">Feedback loop</div>
          </div>
          <div className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-300">
            Bước {step} / {totalSteps}
          </div>
        </div>
        <div className="max-w-2xl mx-auto w-full">
           <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
           </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl px-6 py-12 md:py-16 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Mức độ mệt mỏi</span>
              <h2 className="text-3xl font-black leading-tight">Bạn cảm thấy mệt thế nào sau buổi tập?</h2>
            </div>
            <div className="space-y-16 py-8 flex flex-col items-center">
              <div className="text-9xl transition-all duration-500 transform hover:scale-110 drop-shadow-2xl">
                {answers.fatigue_level <= 2 ? "😌" : answers.fatigue_level <= 5 ? "🙂" : answers.fatigue_level <= 8 ? "😤" : "🥵"}
              </div>
              <div className="w-full space-y-6">
                <input 
                  type="range" min="1" max="10" step="1"
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  value={answers.fatigue_level}
                  onChange={(e) => setAnswers({...answers, fatigue_level: parseInt(e.target.value)})}
                />
                <div className="flex justify-between font-black text-[10px] uppercase tracking-widest text-slate-300">
                  <span className={answers.fatigue_level <= 3 ? "text-indigo-500" : ""}>Vẫn còn khoẻ</span>
                  <span className={answers.fatigue_level >= 8 ? "text-rose-500" : ""}>Kiệt sức</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Vùng đau mỏi</span>
              <h2 className="text-3xl font-black leading-tight">Cơ thể bạn có bị đau ở đâu không?</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-10 items-stretch h-[420px]">
              <div className="w-full md:w-[220px] bg-indigo-50/50 rounded-[2.5rem] p-6 flex justify-center border border-indigo-100/50">
                <svg viewBox="0 0 200 350" className="w-full h-full drop-shadow-sm">
                   {BODY_PARTS.map(part => (
                     <path 
                      key={part.id} 
                      d={part.path} 
                      className="cursor-pointer transition-all duration-300"
                      style={{ fill: answers.pain_areas.includes(part.label) ? "#ef4444" : "#cbd5e1" }}
                      onClick={() => toggleArray('pain_areas', part.label)}
                     />
                   ))}
                   {/* Decorative arms */}
                   <path d="M60,70 L30,120" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
                   <path d="M140,70 L170,120" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 overflow-y-auto pr-1 custom-scrollbar">
                {["Cổ/Vai", "Lưng trên", "Lưng dưới", "Cổ tay", "Hông", "Đầu gối", "Bàn chân", "Đùi"].map(part => (
                  <button
                    key={part}
                    onClick={() => toggleArray('pain_areas', part)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm h-14",
                      answers.pain_areas.includes(part) ? "border-red-500 bg-red-50 text-red-700 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200 text-slate-500"
                    )}
                  >
                    {part}
                  </button>
                ))}
                <button 
                  onClick={() => setAnswers({...answers, pain_areas: []})}
                  className="col-span-2 text-[10px] font-black uppercase tracking-widest text-slate-300 py-3"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Thử thách</span>
              <h2 className="text-3xl font-black leading-tight">Động tác nào là khó nhất hôm nay?</h2>
            </div>
            <div className="space-y-6">
              <input 
                type="text"
                autoFocus
                placeholder="Nhập tên tư thế..."
                className="w-full p-6 text-xl rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all shadow-sm font-bold text-indigo-900"
                value={answers.hardest_pose}
                onChange={(e) => setAnswers({...answers, hardest_pose: e.target.value})}
              />
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Gợi ý nhanh:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_POSES.map(pose => (
                    <button
                      key={pose}
                      onClick={() => setAnswers({...answers, hardest_pose: pose})}
                      className={cn(
                        "px-5 py-2.5 rounded-full border-2 text-xs font-bold transition-all",
                        answers.hardest_pose === pose ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                      )}
                    >
                      {pose}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Sự cải thiện</span>
              <h2 className="text-3xl font-black leading-tight">Bạn có thấy mình tiến bộ hơn không?</h2>
            </div>
            <textarea 
              autoFocus
              placeholder="VD: Tôi thấy giữ thăng bằng tốt hơn, hơi thở đều hơn..."
              className="w-full p-8 h-56 text-lg rounded-[2.5rem] border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm font-medium text-slate-600 italic"
              value={answers.improvement_noticed}
              onChange={(e) => setAnswers({...answers, improvement_noticed: e.target.value})}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Động lực</span>
              <h2 className="text-3xl font-black leading-tight">Năng lượng cho buổi tập tiếp theo?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {MOTIVATIONS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setAnswers({...answers, motivation_level: m.id})}
                  className={cn(
                    "flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all group",
                    answers.motivation_level === m.id ? "border-indigo-500 bg-white shadow-xl shadow-indigo-100" : "border-slate-50 bg-white hover:border-slate-100"
                  )}
                >
                  <span className="text-4xl group-hover:scale-125 transition-transform">{m.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Kế hoạch tới</span>
              <h2 className="text-3xl font-black leading-tight">Bạn muốn chú trọng điều gì tiếp theo?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FOCUS_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleArray('focus_next', tag)}
                  className={cn(
                    "p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all",
                    answers.focus_next.includes(tag) ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >
                  <span className="font-black text-lg text-slate-700">{tag}</span>
                  {answers.focus_next.includes(tag) && (
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
                      <Check className="text-white w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Tư vấn AI</span>
              <h2 className="text-3xl font-black leading-tight">Ghi chú riêng cho giáo viên & AI?</h2>
            </div>
            <textarea 
              autoFocus
              placeholder="Ghi chú thêm về sức khỏe hoặc yêu cầu đặc biệt..."
              className="w-full p-8 h-56 text-lg rounded-[2.5rem] border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm font-medium"
              value={answers.free_notes}
              onChange={(e) => setAnswers({...answers, free_notes: e.target.value})}
            />
            <div className="p-6 bg-indigo-900 text-white rounded-[2rem] flex gap-5 items-center relative overflow-hidden shadow-xl shadow-indigo-200">
                <Sparkles className="w-8 h-8 text-indigo-400 shrink-0 opacity-80" />
                <div className="text-[11px] font-medium leading-relaxed italic opacity-90">
                  Phản hồi của bạn sẽ giúp YogAI cá nhân hóa lộ trình luyện tập phù hợp nhất với thể trạng và mục tiêu hiện tại.
                </div>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full" />
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="w-full bg-white border-t border-slate-100 py-10 px-8 sticky bottom-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 1 || isPending}
            className="h-12 px-8 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all disabled:opacity-0"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Quay lại
          </Button>

          {step < totalSteps ? (
            <Button 
              onClick={nextStep}
              className="h-12 px-12 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-indigo-600 active:scale-95 shadow-xl shadow-slate-200 transition-all flex items-center gap-2"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="h-14 px-12 rounded-[2rem] bg-indigo-600 text-white font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {isPending ? "Đang phân tích..." : "Gửi Feedback Loop"}
              <Sparkles className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
