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
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 py-1.5 md:py-2 px-3 md:px-6 shadow-sm z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
             <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-sky-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
             </div>
             <div className="font-black text-xs md:text-sm tracking-tight italic">Nhật ký buổi tập</div>
          </div>
          <div className="font-black text-[9px] md:text-[10px] uppercase text-slate-400">
            Bước {step} / {totalSteps}
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-1.5 md:mt-2">
           <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${progress}%` }} />
           </div>
        </div>
      </header>

      {/* Nội dung chính - Centered & High Density */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3 md:px-6 py-4 md:py-10 overflow-y-auto flex flex-col justify-center gap-4 md:gap-8">
        {step === 1 && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-sky-500">Mức độ mệt mỏi</span>
              <h2 className="text-xl md:text-2xl font-black leading-tight italic text-slate-900">Bạn thấy mỏi thế nào?</h2>
            </div>
            <div className="grid grid-cols-5 gap-1.5 md:gap-3 py-1">
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
                      "group p-1.5 md:p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1.5 text-center min-h-[60px] md:min-h-[100px]",
                      cardSelected 
                        ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm translate-y-[-2px]" 
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-400"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 md:w-6 md:h-6 transition-transform group-hover:scale-110", cardSelected ? "text-sky-500" : "text-slate-400")} />
                    <span className={cn("text-[7px] md:text-[9px] uppercase font-black tracking-tighter leading-none", cardSelected ? "text-sky-700" : "text-slate-400")}>{level.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase tracking-widest text-sky-500">Vùng đau mỏi</span>
              <h2 className="text-xl md:text-2xl font-black leading-tight italic text-slate-900">Có vùng nào bị đau không?</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[100px] md:w-[140px] bg-slate-100 rounded-xl p-2 shrink-0 border border-slate-200 shadow-sm">
                <svg viewBox="0 0 200 350" className="w-full h-full">
                   {BODY_PARTS.map(part => (
                     <path 
                      key={part.id} d={part.path} 
                      className="cursor-pointer transition-colors duration-300"
                      style={{ fill: answers.pain_areas.includes(part.label) ? "#0ea5e9" : "#e2e8f0" }}
                      onClick={() => toggleArray('pain_areas', part.label)}
                     />
                   ))}
                </svg>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-1.5">
                {["Cổ/Vai", "Lưng trên", "Lưng dưới", "Cổ tay", "Hông", "Đầu gối", "Bàn chân", "Đùi"].map(part => (
                  <button
                    key={part}
                    onClick={() => toggleArray('pain_areas', part)}
                    className={cn(
                      "p-1.5 rounded-md border text-[9px] md:text-[11px] font-bold h-8 md:h-10 transition-all",
                      answers.pain_areas.includes(part) 
                        ? "border-sky-400 bg-sky-50 text-sky-700 shadow-sm" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                    )}
                  >
                    {part}
                  </button>
                ))}
                <button 
                  onClick={() => setAnswers({...answers, pain_areas: []})}
                  className="col-span-2 text-[8px] font-black uppercase tracking-widest text-slate-400 py-1 hover:text-sky-500 transition-colors"
                >
                  Xoá vùng chọn
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-black italic text-slate-900">Động tác khó nhất?</h2>
            <input 
              autoFocus
              placeholder="Nhập tên tư thế..."
              className="w-full p-3 md:p-4 text-sm md:text-base rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none font-bold shadow-sm transition-all"
              value={answers.hardest_pose}
              onChange={(e) => setAnswers({...answers, hardest_pose: e.target.value})}
            />
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_POSES.map(pose => (
                <button
                  key={pose}
                  onClick={() => setAnswers({...answers, hardest_pose: pose})}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all",
                    answers.hardest_pose === pose 
                      ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-500"
                  )}
                >
                  {pose}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-black italic text-slate-900">Cải thiện nhận thấy?</h2>
            <textarea 
              autoFocus
              placeholder="VD: Hơi thở đều hơn, giữ thăng bằng tốt hơn..."
              className="w-full p-4 h-28 md:h-40 text-xs md:text-sm rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none resize-none font-medium italic shadow-sm text-slate-700 bg-white"
              value={answers.improvement_noticed}
              onChange={(e) => setAnswers({...answers, improvement_noticed: e.target.value})}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-black italic text-center text-slate-900">Năng lượng tiếp theo?</h2>
            <div className="grid grid-cols-5 gap-1.5 md:gap-3">
              {MOTIVATIONS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setAnswers({...answers, motivation_level: m.id})}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border h-16 md:h-24 justify-center transition-all group",
                    answers.motivation_level === m.id 
                      ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm translate-y-[-2px]" 
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-400"
                  )}
                >
                  <span className="text-xl md:text-3xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                  <span className="text-[7px] md:text-[9px] font-black uppercase text-center leading-none tracking-tighter">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-black italic text-slate-900">Trọng tâm buổi tới?</h2>
            <div className="grid grid-cols-2 gap-2">
              {FOCUS_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleArray('focus_next', tag)}
                  className={cn(
                    "p-3 rounded-xl border flex items-center justify-between transition-all group",
                    answers.focus_next.includes(tag) 
                      ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                  )}
                >
                  <span className="font-bold text-xs md:text-sm text-slate-700">{tag}</span>
                  {answers.focus_next.includes(tag) && <Check className="text-sky-500 w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-black italic text-slate-900">Ghi chú cho AI & GV?</h2>
            <textarea 
              autoFocus
              placeholder="Ghi chú thêm về sức khỏe hoặc yêu cầu đặc biệt..."
              className="w-full p-4 h-28 md:h-40 text-xs md:text-sm rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none resize-none shadow-sm text-slate-700 bg-white"
              value={answers.free_notes}
              onChange={(e) => setAnswers({...answers, free_notes: e.target.value})}
            />
            <div className="p-3 bg-sky-500 text-white rounded-lg flex gap-3 items-center shadow-md">
                <Sparkles className="w-4 h-4 text-sky-200 shrink-0" />
                <p className="text-[10px] font-medium leading-tight opacity-90 italic">
                  Phản hồi của bạn giúp AI tinh chỉnh lộ trình chính xác nhất.
                </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Cố định và Gọn */}
      <footer className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200 py-2 md:py-3 px-3 md:px-8 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 1 || isPending}
            className="h-8 md:h-10 px-3 md:px-5 rounded-lg text-slate-400 font-bold hover:bg-slate-50 transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="mr-1 w-3.5 h-3.5" /> <span className="hidden md:inline">Quay lại</span>
          </Button>

          {step < totalSteps ? (
            <Button 
              onClick={nextStep}
              className="h-8 md:h-10 flex-1 md:flex-none px-6 md:px-12 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm shadow-sky-100"
            >
              Tiếp tục <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="h-9 md:h-11 flex-1 md:flex-none px-6 md:px-12 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-widest shadow-md shadow-sky-100 active:scale-95 transition-all text-xs md:text-sm"
            >
              {isPending ? "Đang xử lý..." : "Gửi Phản hồi"}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
