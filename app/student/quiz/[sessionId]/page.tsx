"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Award,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

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

const DISCOMFORT_PARTS = [
  { id: "neck_shoulder", label: "Cổ/Vai" },
  { id: "upper_back", label: "Lưng trên" },
  { id: "lower_back", label: "Lưng dưới" },
  { id: "wrists", label: "Cổ tay" },
  { id: "hip", label: "Hông" },
  { id: "knees", label: "Đầu gối" },
  { id: "feet", label: "Bàn chân" },
  { id: "thighs", label: "Đùi" }
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
    const skippedSteps = ["teacher_notes", "discomforts", "hardest_pose"];
    if (step < totalSteps && typeof value === 'string' && !skippedSteps.includes(field)) {
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

        const { error } = await supabase.from("session_feedback").insert({
          session_id: sessionId,
          student_id: user.id,
          ...answers,
          created_at: new Date().toISOString()
        });

        if (error) throw error;
        toast.success("Cảm ơn bạn đã phản hồi!");
        router.push("/student");
      } catch (error) {
        console.error("Error saving feedback:", error);
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
      case 7: return true;
      case 8: return true; 
      case 9: return !!answers.perceived_progress;
      case 10: return answers.next_focus.length > 0;
      case 11: return answers.rating > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" />
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Post-Session Quiz</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Step {step}/{totalSteps}</span>
          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          
          <div className="mb-2">
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Feedback Loop</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-8">
            {step === 1 && "Buổi học hôm nay với bạn như thế nào?"}
            {step === 2 && "Bạn cảm thấy thế nào sau buổi học?"}
            {step === 3 && "Bạn hoàn thành được bao nhiêu % bài tập?"}
            {step === 4 && "Động tác nào bạn thấy khó nhất hôm nay?"}
            {step === 5 && "Giáo viên hướng dẫn hôm nay rõ ràng không?"}
            {step === 6 && "Tốc độ buổi học có phù hợp không?"}
            {step === 7 && "Điều bạn muốn giáo viên chú ý hơn?"}
            {step === 8 && "Bạn có bị đau mỏi ở đâu không?"}
            {step === 9 && "So với buổi trước, bạn cảm thấy mình:"}
            {step === 10 && "Bạn muốn buổi tới tập trung vào gì?"}
            {step === 11 && "Bạn đánh giá buổi học hôm nay mấy sao?"}
          </h2>

          <div className="space-y-4">
            {step === 8 ? (
              <div className="flex flex-col md:flex-row gap-10 items-stretch min-h-[460px]">
                {/* Body Map on the Left */}
                <div className="flex-1 bg-slate-100/30 rounded-[3rem] p-8 flex items-center justify-center relative ring-1 ring-slate-200/40">
                   <div className="relative h-[380px] w-[180px] flex items-center justify-center">
                     <svg viewBox="0 0 200 600" className="w-full h-full drop-shadow-sm">
                        {/* Define Shapes and Bind Colors */}
                        {/* Head & Neck */}
                        <g 
                          className="cursor-pointer transition-all duration-300 group" 
                          onClick={() => handleMultiSelect("discomforts", "neck_shoulder")}
                        >
                          <circle 
                            cx="100" cy="50" r="45" 
                            className={cn(answers.discomforts.includes("neck_shoulder") ? "fill-red-500 shadow-xl" : "fill-slate-200 hover:fill-red-100")} 
                          />
                          <rect 
                            x="85" y="85" width="30" height="30" 
                            className={cn(answers.discomforts.includes("neck_shoulder") ? "fill-red-500" : "fill-slate-200 hover:fill-red-100")} 
                          />
                        </g>

                        {/* Upper Back / Chest Area */}
                        <g 
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => handleMultiSelect("discomforts", "upper_back")}
                        >
                          <path 
                            d="M60,115 L140,115 L150,220 L50,220 Z" 
                            className={cn("transition-colors", answers.discomforts.includes("upper_back") ? "fill-red-500" : "fill-slate-200 hover:fill-red-100")} 
                          />
                        </g>

                        {/* Lower Back / Belly Area */}
                        <g 
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => handleMultiSelect("discomforts", "lower_back")}
                        >
                          <path 
                            d="M50,225 L150,225 L150,300 L50,300 Z" 
                            className={cn("transition-colors", answers.discomforts.includes("lower_back") ? "fill-red-500" : "fill-slate-200 hover:fill-red-100")} 
                          />
                        </g>

                        {/* Wrists Left/Right */}
                        <circle 
                          cx="35" cy="205" r="15" 
                          className={cn("cursor-pointer transition-all", answers.discomforts.includes("wrists") ? "fill-red-500" : "fill-slate-100 hover:fill-red-100")} 
                          onClick={() => handleMultiSelect("discomforts", "wrists")}
                        />
                        <circle 
                          cx="165" cy="205" r="15" 
                          className={cn("cursor-pointer transition-all", answers.discomforts.includes("wrists") ? "fill-red-500" : "fill-slate-100 hover:fill-red-100")} 
                          onClick={() => handleMultiSelect("discomforts", "wrists")}
                        />

                        {/* Hips */}
                        <path 
                          d="M50,305 L150,305 L160,360 L40,360 Z" 
                          className={cn("cursor-pointer transition-colors", answers.discomforts.includes("hip") ? "fill-red-500" : "fill-slate-200 hover:fill-red-100")} 
                          onClick={() => handleMultiSelect("discomforts", "hip")}
                        />

                        {/* Thighs */}
                        <g 
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => handleMultiSelect("discomforts", "thighs")}
                        >
                          <path d="M45,365 L95,365 L85,480 L50,480 Z" className={cn(answers.discomforts.includes("thighs") ? "fill-red-500" : "fill-slate-200 hover:fill-red-100")} />
                          <path d="M105,365 L155,365 L150,480 L115,480 Z" className={cn(answers.discomforts.includes("thighs") ? "fill-red-500" : "fill-slate-200 hover:fill-red-100")} />
                        </g>

                        {/* Knees */}
                        <circle 
                          cx="67" cy="500" r="18" 
                          className={cn("cursor-pointer transition-all", answers.discomforts.includes("knees") ? "fill-red-500" : "fill-slate-100 hover:fill-red-100")} 
                          onClick={() => handleMultiSelect("discomforts", "knees")}
                        />
                         <circle 
                          cx="133" cy="500" r="18" 
                          className={cn("cursor-pointer transition-all", answers.discomforts.includes("knees") ? "fill-red-500" : "fill-slate-100 hover:fill-red-100")} 
                          onClick={() => handleMultiSelect("discomforts", "knees")}
                        />

                        {/* Feet */}
                        <g 
                          className="cursor-pointer transition-all duration-300"
                          onClick={() => handleMultiSelect("discomforts", "feet")}
                        >
                          <path d="M55,530 L85,530 L85,580 L45,580 Z" className={cn(answers.discomforts.includes("feet") ? "fill-red-500" : "fill-slate-100 hover:fill-red-100")} />
                          <path d="M115,530 L145,530 L155,580 L115,580 Z" className={cn(answers.discomforts.includes("feet") ? "fill-red-500" : "fill-slate-100 hover:fill-red-100")} />
                        </g>

                        {/* Arms (Visual only) */}
                        <path d="M55,120 L35,200" stroke="#e2e8f0" strokeWidth="15" strokeLinecap="round" />
                        <path d="M145,120 L165,200" stroke="#e2e8f0" strokeWidth="15" strokeLinecap="round" />
                        <path d="M60,515 L60,530" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                        <path d="M140,515 L140,530" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                     </svg>
                   </div>
                </div>

                {/* Buttons on the Right */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                   {DISCOMFORT_PARTS.map(opt => (
                     <button
                       key={opt.id}
                       onClick={() => handleMultiSelect("discomforts", opt.id)}
                       className={cn(
                         "min-h-[50px] flex items-center px-6 rounded-2xl border-2 text-[14px] font-bold transition-all text-left",
                         answers.discomforts.includes(opt.id) ? "border-red-500 bg-red-50 text-red-700 shadow-md scale-[1.02]" : "border-slate-100 bg-white hover:border-slate-200 text-slate-500"
                       )}
                     >
                       {opt.label}
                       {answers.discomforts.includes(opt.id) && <Check className="w-4 h-4 ml-auto" />}
                     </button>
                   ))}
                   <button 
                      type="button" 
                      onClick={() => setAnswers({...answers, discomforts: []})}
                      className={cn(
                        "mt-4 text-[11px] font-black uppercase tracking-widest transition-all text-center h-10 flex items-center justify-center",
                        answers.discomforts.length === 0 ? "text-emerald-500" : "text-slate-300 hover:text-slate-400"
                      )}
                   >
                     {answers.discomforts.length === 0 ? "Cơ thể tôi bình thường" : "Bỏ chọn tất cả"}
                   </button>
                </div>
              </div>
            ) : (
              // Handle other steps
              <div className="space-y-4">
                 {step === 1 && DIFFICULTY_OPTIONS.map(opt => (
                    <OptionCard key={opt.value} label={opt.label} selected={answers.difficulty === opt.value} onClick={() => handleSelect("difficulty", opt.value)} />
                 ))}
                 
                 {step === 2 && (
                    <div className="grid grid-cols-2 gap-4">
                      {FEELING_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleMultiSelect("feelings", opt.value)}
                          className={cn(
                            "p-8 rounded-[2rem] border-2 text-left flex flex-col gap-4 transition-all",
                            answers.feelings.includes(opt.value) ? "border-indigo-500 bg-white shadow-xl" : "border-slate-100 bg-white/50"
                          )}
                        >
                          <span className="text-4xl">{opt.icon}</span>
                          <span className="font-bold text-slate-700 leading-tight">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                 )}

                 {step === 3 && COMPLETION_OPTIONS.map(opt => (
                    <OptionCard key={opt.value} label={opt.label} selected={answers.completion === opt.value} onClick={() => handleSelect("completion", opt.value)} />
                 ))}

                 {step === 4 && (
                    <textarea autoFocus className="w-full p-8 rounded-[2.5rem] border-2 border-slate-100 focus:border-indigo-500 outline-none min-h-[160px] text-lg font-medium" placeholder="VD: Tư thế Chó úp mặt..." value={answers.hardest_pose} onChange={(e) => setAnswers({...answers, hardest_pose: e.target.value})} />
                 )}

                 {step === 5 && TEACHER_CLARITY_OPTIONS.map(opt => (
                    <OptionCard key={opt.value} label={opt.label} selected={answers.teacher_clarity === opt.value} onClick={() => handleSelect("teacher_clarity", opt.value)} />
                 ))}

                 {step === 6 && SESSION_SPEED_OPTIONS.map(opt => (
                    <OptionCard key={opt.value} label={opt.label} selected={answers.session_speed === opt.value} onClick={() => handleSelect("session_speed", opt.value)} />
                 ))}

                 {step === 7 && (
                    <textarea autoFocus className="w-full p-8 rounded-[2.5rem] border-2 border-slate-100 focus:border-indigo-500 outline-none min-h-[160px] text-lg font-medium" placeholder="VD: Sửa thêm tư thế tay..." value={answers.teacher_notes} onChange={(e) => setAnswers({...answers, teacher_notes: e.target.value})} />
                 )}

                 {step === 9 && (
                    <div className="grid grid-cols-2 gap-4">
                       {PROGRESS_OPTIONS.map(opt => (
                          <button key={opt.value} onClick={() => handleSelect("perceived_progress", opt.value)} className={cn("p-8 rounded-[2rem] border-2 text-center flex flex-col items-center gap-4 transition-all", answers.perceived_progress === opt.value ? "border-indigo-500 bg-white shadow-xl" : "border-slate-100 bg-white/50")}>
                             <span className="text-4xl">{opt.icon}</span>
                             <span className="text-xs font-black uppercase text-slate-800 tracking-wider font-bold">{opt.label}</span>
                          </button>
                       ))}
                    </div>
                 )}

                 {step === 10 && NEXT_FOCUS_OPTIONS.map(opt => (
                    <OptionCard key={opt.value} label={opt.label} selected={answers.next_focus.includes(opt.value)} onClick={() => handleMultiSelect("next_focus", opt.value, 2)} />
                 ))}

                 {step === 11 && (
                    <div className="flex flex-col items-center gap-12 py-12">
                       <div className="flex gap-4">
                          {[1, 2, 3, 4, 5].map(star => (
                             <button key={star} onClick={() => handleSelect("rating", star)} className={`transition-all duration-300 ${answers.rating >= star ? 'scale-125' : 'scale-100 opacity-20 grayscale'}`}>
                                <Star className={`w-16 h-16 ${answers.rating >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                             </button>
                          ))}
                       </div>
                       <div className="h-4">
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Cảm ơn bạn đã đồng hành hôm nay!</span>
                       </div>
                    </div>
                 )}
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="p-8 bg-white border-t border-slate-100 flex items-center justify-between shadow-2xl sticky bottom-0 z-50">
        <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1 || isPending} className="rounded-[1.25rem] px-8 h-12 text-slate-400 font-bold hover:bg-slate-50 disabled:opacity-0 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>

        <Button onClick={step === totalSteps ? handleSubmit : () => setStep(step + 1)} disabled={!canContinue() || isPending} className={cn("rounded-[1.25rem] px-12 h-12 font-black uppercase tracking-widest transition-all", canContinue() ? "bg-slate-900 text-white shadow-xl hover:bg-indigo-600 active:scale-95" : "bg-slate-100 text-slate-300")}>
          {step === totalSteps ? (isPending ? "Đang gửi..." : "Hoàn tất") : "Tiếp theo"}
          {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </footer>
    </div>
  );
}

function OptionCard({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group", selected ? "border-indigo-500 bg-indigo-50/30 ring-4 ring-indigo-50 shadow-sm" : "border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-white")}>
      <span className={cn("text-base font-bold text-left", selected ? "text-indigo-900" : "text-slate-600")}>{label}</span>
      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", selected ? "bg-indigo-500 border-indigo-500 shadow-md" : "border-slate-200 group-hover:border-slate-300")}>
        {selected && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
    </button>
  );
}
