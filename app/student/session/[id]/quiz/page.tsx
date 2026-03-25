"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Check,
  Smile,
  SmilePlus,
  Meh,
  Frown,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// More detailed SVG Body Paths
const BODY_PARTS = [
  { id: "neck", label: "Cổ/Vai", path: "M 100 20 C 80 20 80 60 100 60 C 120 60 120 20 100 20 Z" }, 
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
            answers: { ...answers, focus_next: answers.focus_next.join(", ") } 
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Lỗi máy chủ");
        toast.success("Cảm ơn bạn đã gửi phản hồi!");
        router.push("/student");
      } catch (err: any) {
        toast.error("Lỗi gửi feedback: " + err.message);
      }
    });
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 overflow-hidden">
      {/* Header - Phẳng và Gọn */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 py-1.5 md:py-3 px-3 md:px-6 shadow-sm z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 md:w-7 md:h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-sky-400" />
             </div>
             <div className="font-black text-xs md:text-base tracking-tight italic text-slate-900">Nhật ký buổi tập</div>
          </div>
          <div className="font-mono text-[9px] md:text-[11px] uppercase text-slate-300 font-bold tracking-widest">
            {step} / {totalSteps}
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-2">
           <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 transition-all duration-700 ease-out shadow-lg shadow-sky-500/20" style={{ width: `${progress}%` }} />
           </div>
        </div>
      </header>

      {/* Nội dung chính - Centered & High Density */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-12 overflow-y-auto flex flex-col justify-center gap-6 md:gap-10">
        {step === 1 && (
          <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 font-mono italic">Mức độ mệt mỏi</span>
              <h2 className="text-2xl md:text-3xl font-black leading-tight italic text-slate-900">Bạn mỏi thế nào?</h2>
            </div>
            <div className="grid grid-cols-5 gap-2 md:gap-4 py-2">
              {[
                { id: 1, label: "Rất nhẹ", icon: Smile },
                { id: 2, label: "Nhẹ nhàng", icon: SmilePlus },
                { id: 3, label: "Vừa sức", icon: Meh },
                { id: 4, label: "Thách thức", icon: Frown },
                { id: 5, label: "Kiệt sức", icon: Zap },
              ].map((level) => {
                const Icon = level.icon;
                const cardSelected = answers.fatigue_level === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setAnswers({...answers, fatigue_level: level.id})}
                    className={cn(
                      "group p-2 md:p-5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 text-center min-h-[70px] md:min-h-[120px] shadow-sm",
                      cardSelected 
                        ? "bg-sky-50 border-sky-400 text-sky-700 scale-105 shadow-xl shadow-sky-100" 
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-white text-slate-400"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 md:w-8 md:h-8 transition-transform group-hover:scale-110", cardSelected ? "text-sky-500" : "text-slate-300")} />
                    <span className={cn("text-[8px] md:text-[10px] uppercase font-black tracking-widest font-mono leading-none", cardSelected ? "text-sky-700" : "text-slate-300")}>{level.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 font-mono italic">Vùng đau mỏi</span>
              <h2 className="text-2xl md:text-3xl font-black leading-tight italic text-slate-900">Vùng nào bị đau mỏi?</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
              <div className="w-[140px] md:w-[180px] bg-slate-50 rounded-3xl p-4 shrink-0 border border-slate-100 shadow-inner">
                <svg viewBox="0 0 200 350" className="w-full h-full">
                   {BODY_PARTS.map(part => (
                     <path 
                      key={part.id} d={part.path} 
                      className="cursor-pointer transition-colors duration-500"
                      style={{ fill: answers.pain_areas.includes(part.label) ? "#0ea5e9" : "#f1f5f9" }}
                      onClick={() => toggleArray('pain_areas', part.label)}
                     />
                   ))}
                </svg>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2.5 w-full">
                {["Cổ/Vai", "Lưng trên", "Lưng dưới", "Cổ tay", "Hông", "Đầu gối", "Bàn chân", "Đùi"].map(part => (
                  <button
                    key={part}
                    onClick={() => toggleArray('pain_areas', part)}
                    className={cn(
                      "p-3 rounded-xl border text-[10px] md:text-xs font-black uppercase tracking-widest font-mono h-10 md:h-12 transition-all",
                      answers.pain_areas.includes(part) 
                        ? "border-sky-400 bg-sky-50 text-sky-700 shadow-lg shadow-sky-100" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-400"
                    )}
                  >
                    {part}
                  </button>
                ))}
                <button 
                  onClick={() => setAnswers({...answers, pain_areas: []})}
                  className="col-span-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 py-3 hover:text-sky-500 transition-colors font-mono italic mt-4"
                >
                  Xoá vùng chọn
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 leading-tight">Động tác khó nhất?</h2>
            <div className="relative group">
               <input 
                 autoFocus
                 placeholder="Nhập tên tư thế..."
                 className="w-full h-16 md:h-20 px-6 md:px-10 text-lg md:text-2xl rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 bg-white focus:border-sky-400 outline-none font-black italic shadow-xl shadow-slate-100/50 transition-all placeholder:text-slate-200"
                 value={answers.hardest_pose}
                 onChange={(e) => setAnswers({...answers, hardest_pose: e.target.value})}
               />
               <Sparkles className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-100 group-focus-within:text-sky-200 transition-all" />
            </div>
            <div className="flex flex-wrap gap-2.5 pt-4">
              {SUGGESTED_POSES.map(pose => (
                <button
                  key={pose}
                  onClick={() => setAnswers({...answers, hardest_pose: pose})}
                  className={cn(
                    "px-4 py-2 rounded-2xl border text-[10px] md:text-xs font-black uppercase tracking-widest font-mono transition-all",
                    answers.hardest_pose === pose 
                      ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-100" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                  )}
                >
                  {pose}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 leading-tight">Sự tiến bộ?</h2>
            <textarea 
              autoFocus
              placeholder="VD: Hơi thở đều hơn, giữ thăng bằng tốt hơn..."
              className="w-full p-8 md:p-12 h-48 md:h-64 text-sm md:text-lg rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-100 focus:border-sky-400 outline-none resize-none font-bold italic shadow-2xl shadow-slate-100/50 text-slate-700 bg-white placeholder:text-slate-200"
              value={answers.improvement_noticed}
              onChange={(e) => setAnswers({...answers, improvement_noticed: e.target.value})}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10 animate-in fade-in duration-500 text-center">
            <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 border-none leading-none">Năng lượng hiện tại?</h2>
            <div className="grid grid-cols-5 gap-3 md:gap-5 max-w-xl mx-auto">
              {MOTIVATIONS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setAnswers({...answers, motivation_level: m.id})}
                  className={cn(
                    "flex flex-col items-center gap-3 p-3 md:p-6 rounded-2xl border h-20 md:h-36 justify-center transition-all group shadow-sm",
                    answers.motivation_level === m.id 
                      ? "bg-white border-sky-400 text-sky-700 scale-110 shadow-2xl shadow-sky-100" 
                      : "bg-white border-slate-100 text-slate-400"
                  )}
                >
                  <span className="text-2xl md:text-5xl group-hover:scale-110 transition-transform drop-shadow-sm">{m.emoji}</span>
                  <span className="text-[8px] md:text-[10px] font-black uppercase text-center leading-none tracking-widest font-mono mt-2">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 leading-tight">Trọng tâm buổi tập tới?</h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {FOCUS_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleArray('focus_next', tag)}
                  className={cn(
                    "p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border flex items-center justify-between transition-all group shadow-sm",
                    answers.focus_next.includes(tag) 
                      ? "bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-100" 
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                  )}
                >
                  <span className={cn("font-black text-xs md:text-base uppercase tracking-widest font-mono italic", answers.focus_next.includes(tag) ? "text-white" : "text-slate-400")}>{tag}</span>
                  {answers.focus_next.includes(tag) && <Check className="text-white w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl md:text-3xl font-black italic text-slate-900 leading-tight">Ghi chú cho AI & GV?</h2>
            <textarea 
              autoFocus
              placeholder="Ghi chú thêm về sức khỏe hoặc yêu cầu đặc biệt..."
              className="w-full p-8 md:p-12 h-48 md:h-64 text-sm md:text-lg rounded-[2.5rem] md:rounded-[3rem] border-2 border-slate-100 focus:border-sky-400 outline-none resize-none shadow-2xl shadow-slate-100/50 text-slate-700 bg-white placeholder:text-slate-200 mb-6"
              value={answers.free_notes}
              onChange={(e) => setAnswers({...answers, free_notes: e.target.value})}
            />
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex gap-5 items-center shadow-2xl border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                   <Sparkles className="w-5 h-5 text-sky-400" />
                </div>
                <p className="text-[11px] md:text-xs font-medium leading-relaxed opacity-80 italic">
                  Phản hồi của bạn giúp AI tinh chỉnh lộ trình chính xác nhất. Mọi dữ liệu đều được mã hóa và bảo mật.
                </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Cố định và Gọn */}
      <footer className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200 py-4 md:py-6 px-6 md:px-12 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 1 || isPending}
            className="h-10 md:h-12 px-6 md:px-10 rounded-xl text-slate-300 font-black uppercase tracking-widest font-mono text-[10px] hover:text-slate-900 transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> <span className="hidden md:inline">Quay lại</span>
          </Button>

          {step < totalSteps ? (
            <Button 
              onClick={nextStep}
              className="h-10 md:h-12 flex-1 md:flex-none px-8 md:px-16 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl hover:bg-black font-mono text-[10px]"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="h-12 md:h-14 flex-1 md:flex-none px-10 md:px-20 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-sky-500/20 active:scale-95 transition-all text-xs font-mono"
            >
              {isPending ? "Đang xử lý..." : "Gửi Phản hồi"}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
