"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Smile, 
  Meh, 
  Frown, 
  Battery, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const MOODS = [
  { label: "Tuyệt vời", icon: <Smile className="w-10 h-10 text-emerald-500" /> },
  { label: "Bình thường", icon: <Meh className="w-10 h-10 text-amber-500" /> },
  { label: "Mệt mỏi", icon: <Frown className="w-10 h-10 text-red-500" /> },
];

const BODY_PARTS = ["Cổ/Vai", "Lưng trên", "Lưng dưới", "Cổ tay", "Hông", "Đầu gối", "Bàn chân"];

import { useParams } from "next/navigation";

export default function SessionQuizPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params?.id;
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [aiInsight, setAiInsight] = useState("");
  const router = useRouter();

  const [answers, setAnswers] = useState({
    mood: "Bình thường",
    energy: 3,
    pain_areas: [] as string[],
    fatigue: 4,
    improvements: ""
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const togglePain = (area: string) => {
    setAnswers(prev => ({
      ...prev,
      pain_areas: prev.pain_areas.includes(area) ? prev.pain_areas.filter(p => p !== area) : [...prev.pain_areas, area]
    }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/ai/analyze-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, answers })
        });
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        setAiInsight(data.ai_insight);
        toast.success("Feedback đã được gửi. AI đang gửi gợi ý cho GV của bạn!");
        setStep(5); // Success step
      } catch (err: any) {
        toast.error("Gửi feedback thất bại: " + err.message);
      }
    });
  };


  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 hero-section">
      <div className="w-full max-w-xl space-y-12">
        
        {step <= 4 && (
          <header className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-display">Buổi tập vừa rồi thế nào?</h2>
               <div className="label-mono text-[var(--accent)] text-[10px] uppercase tracking-widest">Feedback Loop attivo</div>
            </div>
            <Progress value={progress} className="h-1.5" />
          </header>
        )}

        <main className="min-h-[400px] flex flex-col justify-center">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center space-y-12">
               <h3 className="text-3xl">Tâm trạng của bạn hiện tại?</h3>
               <div className="flex justify-center gap-12">
                  {MOODS.map(m => (
                    <button 
                      key={m.label}
                      onClick={() => { setAnswers({...answers, mood: m.label}); setStep(2); }}
                      className={`flex flex-col items-center gap-4 group transition-all p-6 rounded-[var(--r-lg)] border-2 ${answers.mood === m.label ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-transparent hover:border-[var(--bg-muted)]"}`}
                    >
                       <div className="transition-transform group-hover:scale-125 duration-300">
                          {m.icon}
                       </div>
                       <span className="text-sm font-bold text-[var(--text-primary)]">{m.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
               <h3 className="text-3xl text-center">Năng lượng còn lại của bạn?</h3>
               <div className="px-10 space-y-12">
                   <div className="flex justify-center">
                      <div className="w-24 h-48 border-4 border-[var(--border-strong)] rounded-2xl p-1 relative overflow-hidden flex flex-col justify-end">
                         <div 
                           className={`w-full transition-all duration-1000 ${answers.energy > 3 ? "bg-emerald-500" : answers.energy > 1 ? "bg-amber-500" : "bg-red-500"}`}
                           style={{ height: `${answers.energy * 20}%` }}
                         />
                         <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-8 h-2 bg-[var(--border-strong)] rounded-t-sm" />
                      </div>
                   </div>
                   <div className="flex flex-col gap-6">
                      <input 
                        type="range" 
                        min="1" max="5" 
                        className="w-full h-2 bg-[var(--bg-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                        value={answers.energy}
                        onChange={(e) => setAnswers({...answers, energy: parseInt(e.target.value)})}
                      />
                      <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
                        <span>Cạn kiệt</span>
                        <span>Tràn trề</span>
                      </div>
                   </div>
                   <Button onClick={() => setStep(3)} className="btn-primary w-full h-14">Tiếp tục</Button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
               <h3 className="text-3xl">Bạn có cảm thấy đau mỏi ở đâu không?</h3>
               <p className="text-[var(--text-secondary)]">Chọn các vị trí trên cơ thể của bạn (nếu có).</p>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {BODY_PARTS.map(part => (
                    <button
                      key={part}
                      onClick={() => togglePain(part)}
                      className={`p-4 rounded-[var(--r-md)] border-2 transition-all flex items-center justify-between group ${answers.pain_areas.includes(part) ? "border-red-400 bg-red-50 text-red-700" : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-red-200"}`}
                    >
                       <span className="text-sm font-bold">{part}</span>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers.pain_areas.includes(part) ? "border-red-500 bg-red-500" : "border-[var(--border)] group-hover:border-red-300"}`}>
                          {answers.pain_areas.includes(part) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                       </div>
                    </button>
                  ))}
               </div>
               <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 text-amber-800 text-xs">
                  <Info className="w-5 h-5 shrink-0" />
                  <span>Dữ liệu này sẽ được AI tổng hợp để cảnh báo giáo viên về cường độ buổi tập tiếp theo.</span>
               </div>
               <Button onClick={() => setStep(4)} className="btn-primary w-full h-14">Tiếp tục</Button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
               <h3 className="text-3xl">Có gì bạn muốn cải thiện không?</h3>
               <textarea 
                  className="w-full p-6 h-40 rounded-[var(--r-lg)] border-2 border-[var(--border-medium)] focus:border-[var(--accent)] outline-none text-lg resize-none"
                  placeholder="Vd: Tôi thấy tư thế Downward Dog hôm nay hơi khó giữ..."
                  value={answers.improvements}
                  onChange={(e) => setAnswers({...answers, improvements: e.target.value})}
               />
               <Button onClick={handleSubmit} disabled={isPending} className="btn-primary w-full h-16 text-lg group">
                  {isPending ? "Đang gửi phân tích..." : (
                    <>
                      Hoàn tất & Lưu lộ trình
                      <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
               </Button>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in zoom-in fade-in duration-700 text-center space-y-12">
               <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-emerald-600 animate-pulse" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl">Tuyệt vời!</h2>
                  <p className="text-xl text-[var(--text-secondary)] max-w-sm mx-auto">
                     Dữ liệu của bạn đã được gửi. AI đang tạo gợi ý hành động cụ thể cho giáo viên để chuẩn bị cho buổi học tới.
                  </p>
               </div>
               <div className="p-8 bg-[var(--bg-sky)] border-2 border-[var(--accent-light)] rounded-[var(--r-xl)] shadow-sky max-w-sm mx-auto">
                  <div className="text-[10px] label-mono uppercase text-[var(--accent)] mb-4 font-bold">AI Insight cho buổi tới</div>
                  <p className="text-sm italic text-blue-800">
                     "{aiInsight || "Tập trung vào phục hồi cơ Lưng dưới và giảm cường độ động tác vặn xoắn."}"
                  </p>
               </div>
               <Button onClick={() => router.push("/student")} className="btn-primary px-12 h-14">
                  Về Dashboard
               </Button>
            </div>
          )}
        </main>

        {step < 5 && (
          <footer className="text-center">
             <p className="text-[10px] label-mono text-[var(--text-hint)] uppercase tracking-widest">
                Bước {step} trên 4 · Hồ sơ của bạn sẽ được AI cá nhân hóa ngay lập tức
             </p>
          </footer>
        )}
      </div>
    </div>
  );
}
