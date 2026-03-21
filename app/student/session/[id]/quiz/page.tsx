"use client";

import React, { useState, useTransition } from "react";
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

// SVG Body Parts for the interactive diagram
const BODY_PARTS = [
  { id: "neck", label: "Cổ/Vai", path: "M 100 45 L 85 55 L 85 70 L 115 70 L 115 55 Z" }, // Rough neck
  { id: "upper_back", label: "Lưng trên", path: "M 80 75 L 120 75 L 125 110 L 75 110 Z" },
  { id: "lower_back", label: "Lưng dưới", path: "M 75 115 L 125 115 L 120 150 L 80 150 Z" },
  { id: "wrists", label: "Cổ tay", path: "M 50 120 L 65 120 L 65 130 L 50 130 Z" }, // Right
  { id: "wrists_2", label: "Cổ tay", path: "M 135 120 L 150 120 L 150 130 L 135 130 Z" }, // Left
  { id: "hips", label: "Hông", path: "M 80 155 L 120 155 L 125 180 L 75 180 Z" },
  { id: "knees", label: "Đầu gối", path: "M 85 240 L 95 240 L 95 255 L 85 255 Z" }, // Right
  { id: "knees_2", label: "Đầu gối", path: "M 105 240 L 115 240 L 115 255 L 105 255 Z" }, // Left
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
        console.log("Submitting quiz for session:", sessionId, answers);
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
        console.log("API Response:", data);
        
        if (!response.ok) {
          throw new Error(data.error || `Server responded with ${response.status}`);
        }
        
        if (data.error) throw new Error(data.error);

        toast.success("Đã gửi phản hồi cho giáo viên!");
        router.push("/student");
      } catch (err: any) {
        console.error("Submission error:", err);
        toast.error("Lỗi gửi feedback: " + err.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center font-ui text-[var(--text-primary)]">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4 px-5 border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
             </div>
             <div className="font-display text-xl">Feedback loop</div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
            Bước {step} của {totalSteps}
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-4 px-2">
           <Progress value={progress} className="h-1 bg-[var(--bg-muted)]" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl px-6 py-12 md:py-20 flex flex-col justify-center">
        {/* Step 1: Fatigue Level */}
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-4">
              <label className="label-mono">Mức độ mệt mỏi</label>
              <h2 className="text-2xl md:text-3xl leading-tight">Sau buổi tập, bạn cảm thấy mệt thế nào?</h2>
            </div>
            <div className="space-y-20 py-10">
              <div className="flex justify-center text-8xl transition-all duration-300 transform hover:scale-110">
                {answers.fatigue_level <= 2 ? "😌" : answers.fatigue_level <= 5 ? "🙂" : answers.fatigue_level <= 8 ? "😤" : "🥵"}
              </div>
              <div className="space-y-6">
                <input 
                  type="range" min="1" max="10" step="1"
                  className="w-full h-3 bg-[var(--bg-muted)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                  value={answers.fatigue_level}
                  onChange={(e) => setAnswers({...answers, fatigue_level: parseInt(e.target.value)})}
                />
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  <span className={answers.fatigue_level === 1 ? "text-[var(--accent)] font-bold" : ""}>Vẫn còn khoẻ</span>
                  <span className={answers.fatigue_level === 10 ? "text-[var(--danger)] font-bold" : ""}>Kiệt sức hoàn toàn</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pain Areas */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <label className="label-mono">Vùng đau mỏi</label>
              <h2 className="text-2xl">Bạn có bị đau mỏi ở đâu không?</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="relative w-48 h-80 bg-[var(--bg-sky)] rounded-3xl p-4 flex justify-center border border-[var(--accent-light)] shadow-sm">
                <svg viewBox="0 0 200 350" className="w-full h-full fill-[var(--accent-light)] opacity-60">
                   {/* Simplistic body outline */}
                   <circle cx="100" cy="30" r="20" /> {/* Head */}
                   {BODY_PARTS.map(part => (
                     <path 
                      key={part.id} 
                      d={part.path} 
                      className={`cursor-pointer transition-colors ${answers.pain_areas.includes(part.label) ? "fill-[var(--danger)]" : "hover:fill-[var(--accent)]"}`}
                      onClick={() => toggleArray('pain_areas', part.label)}
                     />
                   ))}
                </svg>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                {["Cổ/Vai", "Lưng trên", "Lưng dưới", "Cổ tay", "Hông", "Đầu gối", "Bàn chân", "Đùi"].map(part => (
                  <button
                    key={part}
                    onClick={() => toggleArray('pain_areas', part)}
                    className={`p-4 rounded-[var(--r-md)] border-2 text-left transition-all ${answers.pain_areas.includes(part) ? "border-[var(--danger)] bg-red-50 text-red-700" : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-[var(--accent-light)]"}`}
                  >
                    <span className="text-sm font-medium">{part}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Hardest Pose */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <label className="label-mono">Tư thế khó nhất</label>
              <h2 className="text-2xl">Tư thế nào là thử thách nhất với bạn hôm nay?</h2>
            </div>
            <div className="space-y-6">
              <input 
                type="text"
                placeholder="Nhập tên tư thế..."
                className="w-full p-4 text-xl rounded-[var(--r-lg)] border-2 border-[var(--border-medium)] focus:border-[var(--accent)] outline-none transition-all"
                value={answers.hardest_pose}
                onChange={(e) => setAnswers({...answers, hardest_pose: e.target.value})}
              />
              <div className="space-y-3">
                <p className="text-sm text-[var(--text-muted)]">Gợi ý:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_POSES.map(pose => (
                    <button
                      key={pose}
                      onClick={() => setAnswers({...answers, hardest_pose: pose})}
                      className="px-4 py-2 rounded-full border border-[var(--border)] text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all bg-white"
                    >
                      {pose}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Improvement Noticed */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <label className="label-mono">Sự tiến bộ</label>
              <h2 className="text-2xl">Bạn có thấy mình cải thiện ở điểm nào không?</h2>
            </div>
            <textarea 
              placeholder="Vd: Tôi thấy giữ thăng bằng tốt hơn, hoặc hơi thở đều hơn..."
              className="w-full p-4 h-48 text-xl rounded-[var(--r-lg)] border-2 border-[var(--border-medium)] focus:border-[var(--accent)] outline-none transition-all resize-none"
              value={answers.improvement_noticed}
              onChange={(e) => setAnswers({...answers, improvement_noticed: e.target.value})}
            />
          </div>
        )}

        {/* Step 5: Motivation Level */}
        {step === 5 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <label className="label-mono">Động lực</label>
              <h2 className="text-2xl">Bạn cảm thấy thế nào về buổi tập tiếp theo?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 px-2">
              {MOTIVATIONS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setAnswers({...answers, motivation_level: m.id})}
                  className={`flex flex-col items-center gap-3 p-4 rounded-[var(--r-lg)] border-2 transition-all group ${answers.motivation_level === m.id ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-[var(--border)] bg-white hover:border-[var(--accent-light)]"}`}
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">{m.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-center">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Focus Next */}
        {step === 6 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <label className="label-mono">Mục tiêu tới</label>
              <h2 className="text-2xl">Bạn muốn tập trung vào điều gì trong buổi tới?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FOCUS_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleArray('focus_next', tag)}
                  className={`p-4 rounded-[var(--r-lg)] border-2 text-left flex items-center justify-between transition-all ${answers.focus_next.includes(tag) ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-[var(--border)] bg-white hover:border-[var(--accent-light)]"}`}
                >
                  <span className="font-bold text-lg">{tag}</span>
                  {answers.focus_next.includes(tag) && <div className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center"><Check className="text-white w-3 h-3" /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Final Note */}
        {step === 7 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="space-y-2">
              <label className="label-mono">Ghi chú riêng</label>
              <h2 className="text-2xl">Lời nhắn riêng cho giáo viên (nếu có)?</h2>
              <p className="text-[var(--text-secondary)]">Thông tin này chỉ giáo viên mới có thể xem.</p>
            </div>
            <textarea 
              placeholder="Ghi chú thêm về sức khỏe hoặc yêu cầu đặc biệt..."
              className="w-full p-4 h-48 text-xl rounded-[var(--r-lg)] border-2 border-[var(--border-medium)] focus:border-[var(--accent)] outline-none transition-all resize-none"
              value={answers.free_notes}
              onChange={(e) => setAnswers({...answers, free_notes: e.target.value})}
            />
            <div className="p-4 bg-sky-50 rounded-xl flex gap-3 text-sky-700 text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <span>AI sẽ dựa trên toàn bộ feedback này để gợi ý lộ trình phù hợp nhất cho giáo viên của bạn.</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="w-full bg-white border-t border-[var(--border)] py-8 px-6 mt-auto">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 1 || isPending}
            className="h-10 px-5 rounded-[var(--r-pill)] text-[var(--text-secondary)] disabled:opacity-0"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Quay lại
          </Button>

          {step < totalSteps ? (
            <Button 
              onClick={nextStep}
              className="btn-primary h-10 px-6 group"
            >
              Tiếp tục
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="btn-primary h-16 px-6 text-lg shadow-sky"
            >
              {isPending ? "Đang gửi đi..." : "Hoàn tất feedback loop"}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
