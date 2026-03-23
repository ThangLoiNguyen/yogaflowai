"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Smile, 
  Frown, 
  Meh, 
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  Heart,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const DIFFICULTY_OPTIONS = [
  { value: "too_easy", label: "Quá dễ, tôi cần thử thách hơn" },
  { value: "perfect", label: "Vừa sức, phù hợp" },
  { value: "hard_but_ok", label: "Hơi khó nhưng cố được" },
  { value: "too_hard", label: "Quá khó, tôi bị quá sức" }
];

const FEELING_OPTIONS = [
  { value: "relaxed", label: "Thư giãn, nhẹ nhàng", icon: "🍃" },
  { value: "energized", label: "Phấn chấn, tràn năng lượng", icon: "⚡" },
  { value: "tired_happy", label: "Mệt mỏi nhưng vui", icon: "😅" },
  { value: "unusual_pain", label: "Đau nhức bất thường", icon: "⚠️" },
  { value: "dizzy", label: "Chóng mặt / khó chịu", icon: "😵" }
];

const COMPLETION_OPTIONS = [
  { value: "100", label: "100% — theo được toàn bộ" },
  { value: "75", label: "75% — bỏ qua 1–2 động tác" },
  { value: "50", label: "50% — bỏ qua khá nhiều" },
  { value: "under_50", label: "Dưới 50% — không theo kịp" }
];

const TEACHER_CLARITY_OPTIONS = [
  { value: "very_clear", label: "Rất rõ, dễ theo" },
  { value: "clear", label: "Tương đối rõ" },
  { value: "confusing", label: "Đôi chỗ khó hiểu" },
  { value: "hard_to_follow", label: "Khó theo, cần giải thích thêm" }
];

const SESSION_SPEED_OPTIONS = [
  { value: "too_slow", label: "Quá chậm" },
  { value: "balanced", label: "Vừa phải" },
  { value: "a_bit_fast", label: "Hơi nhanh" },
  { value: "too_fast", label: "Quá nhanh" }
];

const BODY_DISCOMFORT_OPTIONS = [
  { value: "none", label: "Không có gì" },
  { value: "neck_shoulder", label: "Vai / cổ" },
  { value: "upper_back", label: "Lưng trên" },
  { value: "lower_back", label: "Lưng dưới" },
  { value: "hip_thigh", label: "Hông / đùi" },
  { value: "knee_ankle", label: "Gối / mắt cá" }
];

const PROGRESS_OPTIONS = [
  { value: "significant", label: "Tiến bộ rõ rệt", icon: "🚀" },
  { value: "slight", label: "Tiến bộ chút ít", icon: "📈" },
  { value: "same", label: "Giữ nguyên", icon: "⚖️" },
  { value: "worse", label: "Có vẻ kém hơn", icon: "🔻" }
];

const NEXT_FOCUS_OPTIONS = [
  { value: "flexibility", label: "Tăng độ linh hoạt" },
  { value: "strength", label: "Tăng sức mạnh cơ bắp" },
  { value: "relaxation", label: "Thư giãn / giảm stress" },
  { value: "balance", label: "Cải thiện thăng bằng" },
  { value: "breathwork", label: "Hơi thở & thiền định" },
  { value: "ai_suggest", label: "Để giáo viên / AI tự gợi ý" }
];

export default function PostSessionQuizPage() {
  const { sessionId } = useParams();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const [answers, setAnswers] = useState({
    difficulty: "",
    feelings: [] as string[],
    completion: "",
    hardest_pose: "",
    teacher_clarity: "",
    session_speed: "",
    teacher_notes: "",
    discomforts: [] as string[],
    perceived_progress: "",
    next_focus: [] as string[],
    rating: 0
  });

  const totalSteps = 11;
  const progress = (step / totalSteps) * 100;

  const handleSelect = (field: keyof typeof answers, value: string | number) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (step < totalSteps && typeof value === 'string') {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const handleMultiSelect = (field: keyof typeof answers, value: string, max: number = 99) => {
    setAnswers(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Vui lòng đăng nhập.");
          return;
        }

        // Save session feedback
        const { error } = await supabase.from("session_feedback").insert({
          session_id: sessionId,
          student_id: user.id,
          ...answers,
          created_at: new Date().toISOString()
        });

        if (error) throw error;

        toast.success("Cảm ơn bạn đã phản hồi! Hẹn gặp lại buổi sau.");
        router.push("/student");
      } catch (error) {
        console.error("Error saving feedback:", error);
        // Fallback if table doesn't exist yet but we want to let user continue
        toast.info("Cảm ơn phản hồi của bạn! (Dev: Đảm bảo bảng session_feedback đã tồn tại)");
        router.push("/student");
      }
    });
  };

  const canContinue = () => {
    switch (step) {
      case 1: return !!answers.difficulty;
      case 2: return answers.feelings.length > 0;
      case 3: return !!answers.completion;
      case 4: return !!answers.hardest_pose;
      case 5: return !!answers.teacher_clarity;
      case 6: return !!answers.session_speed;
      case 7: return true; // optional
      case 8: return answers.discomforts.length > 0;
      case 9: return !!answers.perceived_progress;
      case 10: return answers.next_focus.length > 0;
      case 11: return answers.rating > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500" />
          <h1 className="text-sm font-bold text-slate-900">Hoàn thành buổi tập!</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bước {step}/{totalSteps}</span>
          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          
          <h2 className="text-2xl font-black text-slate-900 leading-tight mb-8">
            {step === 1 && "Buổi học hôm nay với bạn như thế nào?"}
            {step === 2 && "Bạn cảm thấy thế nào sau buổi học?"}
            {step === 3 && "Bạn hoàn thành được bao nhiêu % bài tập?"}
            {step === 4 && "Động tác nào bạn thấy khó nhất hôm nay?"}
            {step === 5 && "Giáo viên hướng dẫn hôm nay rõ ràng không?"}
            {step === 6 && "Tốc độ buổi học có phù hợp không?"}
            {step === 7 && "Điều bạn muốn giáo viên chú ý hơn?"}
            {step === 8 && "Cơ thể bạn có chỗ nào khó chịu không?"}
            {step === 9 && "So với buổi trước, bạn cảm thấy mình:"}
            {step === 10 && "Bạn muốn buổi tới tập trung vào gì?"}
            {step === 11 && "Bạn đánh giá buổi học hôm nay mấy sao?"}
          </h2>

          <div className="space-y-3">
            {step === 1 && DIFFICULTY_OPTIONS.map(opt => (
              <Option key={opt.value} label={opt.label} selected={answers.difficulty === opt.value} onClick={() => handleSelect("difficulty", opt.value)} />
            ))}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {FEELING_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleMultiSelect("feelings", opt.value)}
                    className={`p-4 rounded-xl border-2 text-left flex flex-col gap-2 transition-all ${answers.feelings.includes(opt.value) ? "border-emerald-500 bg-white" : "border-slate-200 bg-white/50"}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && COMPLETION_OPTIONS.map(opt => (
              <Option key={opt.value} label={opt.label} selected={answers.completion === opt.value} onClick={() => handleSelect("completion", opt.value)} />
            ))}

            {step === 4 && (
              <textarea 
                autoFocus
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none min-h-[120px]"
                placeholder="Vd: Tư thế Chiến binh, Tư thế Chó úp mặt..."
                value={answers.hardest_pose}
                onChange={(e) => setAnswers({...answers, hardest_pose: e.target.value})}
              />
            )}

            {step === 5 && TEACHER_CLARITY_OPTIONS.map(opt => (
              <Option key={opt.value} label={opt.label} selected={answers.teacher_clarity === opt.value} onClick={() => handleSelect("teacher_clarity", opt.value)} />
            ))}

            {step === 6 && SESSION_SPEED_OPTIONS.map(opt => (
              <Option key={opt.value} label={opt.label} selected={answers.session_speed === opt.value} onClick={() => handleSelect("session_speed", opt.value)} />
            ))}

            {step === 7 && (
              <textarea 
                autoFocus
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none min-h-[120px]"
                placeholder="Vd: Mong thầy sửa kỹ hơn tư thế tay..."
                value={answers.teacher_notes}
                onChange={(e) => setAnswers({...answers, teacher_notes: e.target.value})}
              />
            )}

            {step === 8 && BODY_DISCOMFORT_OPTIONS.map(opt => (
              <Option key={opt.value} label={opt.label} selected={answers.discomforts.includes(opt.value)} onClick={() => handleMultiSelect("discomforts", opt.value)} isMulti />
            ))}

            {step === 9 && (
              <div className="grid grid-cols-2 gap-3">
                {PROGRESS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect("perceived_progress", opt.value)}
                    className={`p-6 rounded-2xl border-2 text-center flex flex-col items-center gap-3 transition-all ${answers.perceived_progress === opt.value ? "border-emerald-500 bg-white shadow-lg" : "border-slate-200 bg-white/50"}`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 10 && NEXT_FOCUS_OPTIONS.map(opt => (
              <Option key={opt.value} label={opt.label} selected={answers.next_focus.includes(opt.value)} onClick={() => handleMultiSelect("next_focus", opt.value, 2)} isMulti />
            ))}

            {step === 11 && (
              <div className="flex flex-col items-center gap-8 py-8">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => handleSelect("rating", star)}
                      className={`transition-all ${answers.rating >= star ? 'scale-125' : 'scale-100 opacity-30 grayscale'}`}
                    >
                      <Star className={`w-12 h-12 ${answers.rating >= star ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  {answers.rating === 1 && "Không hài lòng"}
                  {answers.rating === 2 && "Tạm được"}
                  {answers.rating === 3 && "Ổn, phù hợp"}
                  {answers.rating === 4 && "Tốt, hài lòng"}
                  {answers.rating === 5 && "Xuất sắc, tuyệt vời!"}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Button 
          variant="ghost" 
          onClick={() => setStep(step - 1)}
          disabled={step === 1 || isPending}
          className="rounded-full px-6 h-11 text-slate-400 font-bold disabled:opacity-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <Button 
          onClick={step === totalSteps ? handleSubmit : () => setStep(step + 1)}
          disabled={!canContinue() || isPending}
          className={`rounded-full px-10 h-11 font-black uppercase tracking-widest transition-all ${isPending ? 'opacity-50' : 'active:scale-95'}`}
          style={{ backgroundColor: canContinue() ? "#10b981" : "#e2e8f0", color: canContinue() ? "white" : "#94a3b8" }}
        >
          {step === totalSteps ? (isPending ? "Đang gửi..." : "Hoàn tất") : "Tiếp theo"}
          {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </footer>
    </div>
  );
}

function Option({ label, selected, onClick, isMulti }: { label: string, selected: boolean, onClick: () => void, isMulti?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${selected ? "border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300 hover:bg-white"}`}
    >
      <span className={`text-sm md:text-base font-bold text-left ${selected ? "text-emerald-900" : "text-slate-600"}`}>
        {label}
      </span>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "bg-emerald-500 border-emerald-500 shadow-sm" : "border-slate-200 group-hover:border-slate-300"}`}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}
