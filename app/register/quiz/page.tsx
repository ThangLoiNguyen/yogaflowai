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
  CheckCircle2,
  Star,
  PlayCircle,
  BrainCircuit,
  ArrowUpRight,
  ShieldCheck,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

// STANDARDIZED OPTIONS (Consistent with OnboardingForm)
const AGE_OPTIONS = [
  { value: "under_18", label: "Dưới 18" },
  { value: "18_25", label: "Từ 18 – 25" },
  { value: "26_35", label: "Từ 26 – 35" },
  { value: "36_45", label: "Từ 36 – 45" },
  { value: "above_45", label: "Trên 45" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác / Không muốn tiết lộ" }
];

const HEALTH_OPTIONS = [
  { value: "back_pain", label: "Đau mỏi lưng / cột sống" },
  { value: "joint_issues", label: "Các vấn đề về xương khớp" },
  { value: "high_blood_pressure", label: "Huyết áp cao / Tim mạch" },
  { value: "pregnancy", label: "Đang mang thai / Sau sinh" },
  { value: "none", label: "Cơ thể hoàn toàn bình thường" },
  { value: "other", label: "Lưu ý sức khỏe khác..." }
];

const EXPERIENCE_OPTIONS = [
  { value: "never", label: "Chưa tập bao giờ / Người mới" },
  { value: "a_few", label: "Đã thử vài buổi nhưng chưa đều" },
  { value: "1_6_months", label: "Đã tập từ 1 đến 6 tháng" },
  { value: "above_6_months", label: "Đã tập trên 6 tháng" },
  { value: "above_2_years", label: "Người tập lâu năm (trên 2 năm)" }
];

const FITNESS_OPTIONS = [
  { value: "very_weak", label: "Yếu, ít vận động thể chất" },
  { value: "average", label: "Trung bình, thỉnh thoảng tập luyện" },
  { value: "quite_good", label: "Khá tốt, vận động thường xuyên" },
  { value: "good", label: "Tốt, vận động cường độ cao" }
];

const FLEXIBILITY_OPTIONS = [
  { value: "very_stiff", label: "Rất cứng, khó gập người" },
  { value: "average", label: "Trung bình, cúi gần chạm mũi chân" },
  { value: "quite_flexible", label: "Khá dẻo, chạm được mũi chân" },
  { value: "very_flexible", label: "Rất dẻo, cơ thể linh hoạt cao" }
];

const GOAL_OPTIONS = [
  { value: "stress_relief", label: "Giảm stress, thư giãn", icon: "🧘" },
  { value: "weight_loss", label: "Giảm cân, săn chắc cơ", icon: "🔥" },
  { value: "flexibility", label: "Cải thiện sự linh hoạt", icon: "🤸" },
  { value: "back_pain_relief", label: "Giảm đau lưng, vai gáy", icon: "🛡️" },
  { value: "stamina", label: "Tăng sức bền, thể lực", icon: "⚡" },
  { value: "mindfulness", label: "Tỉnh thức & Thiền định", icon: "✨" }
];

const STYLE_OPTIONS = [
  { value: "yin_restorative", label: "Nhẹ nhàng, phục hồi (Yin)" },
  { value: "vinyasa_power", label: "Năng động, mạnh mẽ (Vinyasa)" },
  { value: "hatha_breathwork", label: "Chậm rãi, chú trọng hơi thở" },
  { value: "consult", label: "Tôi muốn nhờ giáo viên tư vấn" }
];

const TIME_OPTIONS = [
  { value: "morning", label: "Buổi sáng sớm" },
  { value: "noon", label: "Buổi trưa / Nghỉ trưa" },
  { value: "afternoon", label: "Buổi chiều tối" },
  { value: "evening", label: "Buổi tối muộn" }
];

export default function RegisterQuizPage() {
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<any[] | null>(null);
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

  // AUTO-ADVANCE ONLY FOR SINGLE SELECT
  const handleSelect = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (step < totalSteps) {
      // Small delay for visual feedback before auto-advancing
      setTimeout(() => setStep(prev => prev + 1), 400);
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
    // NO AUTO-ADVANCE FOR MULTI-SELECT
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

        const cleanHealthIssuesArr = answers.health_issues.filter(i => i !== "other" && i !== "none");
        if (answers.health_issues.includes("other") && answers.health_issues_other) {
           cleanHealthIssuesArr.push(`Lưu ý khác: ${answers.health_issues_other}`);
        }
        if (cleanHealthIssuesArr.length === 0) cleanHealthIssuesArr.push("none");

        const payload = {
            ...answers,
            health_issues: cleanHealthIssuesArr.join(", "),
            student_id: user.id
        };

        const res = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommended || []);
          toast.success("AI đã hoàn tất lộ trình tối ưu cho bạn!");
        } else {
          const errData = await res.json();
          toast.error(errData.error || "Gặp lỗi khi lưu kết quả.");
        }
      } catch (error) {
        toast.error("Lỗi kết nối máy chủ.");
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

  if (recommendations) {
    return <RecommendationView courses={recommendations} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-ui relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[500px] bg-sky-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Modern Header */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-8 pb-4 relative z-10">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2">
             <span className="font-display text-xl text-slate-900 font-black tracking-tight uppercase">Yog<span className="text-indigo-600">AI</span></span>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Tiến độ phân tích</span>
                 <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}% Hoàn thành</span>
              </div>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                 <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
              </div>
           </div>
        </div>
      </header>

      {/* Quiz Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 flex flex-col justify-center pb-32">
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both space-y-8">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Step {step} of {totalSteps}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {step === 1 && "Bạn thuộc nhóm độ tuổi nào?"}
              {step === 2 && "Giới tính của bạn là gì?"}
              {step === 3 && "Bạn có đang gặp vấn đề sức khỏe nào không?"}
              {step === 4 && "Trải nghiệm tập Yoga của bạn hiện tại?"}
              {step === 5 && "Bạn đánh giá thể lực hiện tại của mình thế nào?"}
              {step === 6 && "Độ linh hoạt / dẻo dai cơ thể của bạn?"}
              {step === 7 && "Mục tiêu quan trọng nhất bạn muốn đạt được?"}
              {step === 8 && "Phong cách tập luyện bạn yêu thích?"}
              {step === 9 && "Những ngày nào bạn có thể dành thời gian tập?"}
              {step === 10 && "Thời điểm vàng bạn muốn tập luyện?"}
            </h2>
            <p className="text-sm text-slate-400 font-medium">
               {[3, 7, 9].includes(step) ? "Bạn có thể chọn nhiều đáp án để phù hợp nhất." : "Vui lòng chọn 1 đáp án phù hợp nhất."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {step === 1 && AGE_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.age === opt.value} onClick={() => handleSelect("age", opt.value)} />)}
            {step === 2 && GENDER_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.gender === opt.value} onClick={() => handleSelect("gender", opt.value)} />)}
            
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {HEALTH_OPTIONS.map(opt => (
                    <OptionCard 
                      key={opt.value} 
                      label={opt.label} 
                      selected={answers.health_issues.includes(opt.value)} 
                      onClick={() => handleMultiSelect("health_issues", opt.value)} 
                    />
                  ))}
                </div>
                {answers.health_issues.includes("other") && (
                  <div className="animate-in zoom-in-95 duration-300">
                    <Textarea 
                      autoFocus
                      className="w-full p-5 rounded-2xl border-2 border-indigo-100 bg-white shadow-inner focus:border-indigo-600 transition-all outline-none min-h-[120px] font-medium"
                      placeholder="Chúng tôi cần biết chi tiết để AI đảm bảo an toàn cho bạn..."
                      value={answers.health_issues_other}
                      onChange={e => setAnswers({...answers, health_issues_other: e.target.value})}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 4 && EXPERIENCE_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.experience_level === opt.value} onClick={() => handleSelect("experience_level", opt.value)} />)}
            {step === 5 && FITNESS_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.fitness_level === opt.value} onClick={() => handleSelect("fitness_level", opt.value)} />)}
            {step === 6 && FLEXIBILITY_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.flexibility === opt.value} onClick={() => handleSelect("flexibility", opt.value)} />)}
            
            {step === 7 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GOAL_OPTIONS.map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => handleMultiSelect("goals", opt.value, 3)} 
                    className={cn(
                        "p-5 rounded-2xl border-2 text-left transition-all h-full flex flex-col gap-4 group",
                        answers.goals.includes(opt.value) ? "border-indigo-600 bg-white shadow-xl shadow-indigo-100" : "border-slate-100 bg-white hover:border-indigo-200"
                    )}
                  >
                    <div className="text-3xl">{opt.icon}</div>
                    <div className="flex items-center justify-between mt-auto">
                        <span className={cn("text-sm font-black", answers.goals.includes(opt.value) ? "text-slate-900" : "text-slate-500")}>{opt.label}</span>
                        {answers.goals.includes(opt.value) && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 8 && STYLE_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.style === opt.value} onClick={() => handleSelect("style", opt.value)} />)}
            
            {step === 9 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"].map(day => (
                  <button 
                    key={day} 
                    onClick={() => handleMultiSelect("available_days", day)} 
                    className={cn(
                        "h-16 rounded-2xl border-2 font-black transition-all text-xs uppercase tracking-widest",
                        answers.available_days.includes(day) ? "border-indigo-600 bg-indigo-600 text-white shadow-lg" : "border-slate-100 bg-white text-slate-400 hover:border-indigo-200"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
            
            {step === 10 && TIME_OPTIONS.map(opt => <OptionCard key={opt.value} label={opt.label} selected={answers.preferred_time === opt.value} onClick={() => handleSelect("preferred_time", opt.value)} />)}
          </div>
        </div>
      </main>

      {/* Fixed Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-5 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep(prev => prev - 1)} 
            disabled={step === 1 || isPending} 
            className="rounded-2xl h-12 px-6 text-slate-400 font-bold hover:bg-slate-50 disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          
          <Button 
            onClick={step === totalSteps ? handleSubmit : () => setStep(step + 1)} 
            disabled={!canContinue() || isPending} 
            className="flex-1 sm:flex-none rounded-2xl h-12 px-10 font-bold shadow-2xl transition-all active:scale-95 disabled:grayscale"
            style={{ backgroundColor: canContinue() ? "#4f46e5" : "#e2e8f0", color: "white" }}
          >
            {isPending ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 <span>AI Đang Phân Tích...</span>
               </div>
            ) : step === totalSteps ? (
              <span className="flex items-center gap-2">Hoàn tất <Zap className="w-4 h-4" /></span>
            ) : (
              <span className="flex items-center gap-2">Tiếp tục <ArrowRight className="w-4 h-4" /></span>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function OptionCard({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button 
        onClick={onClick} 
        className={cn(
            "w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group", 
            selected ? "border-indigo-600 bg-white shadow-xl shadow-indigo-100" : "border-slate-50 bg-white/50 hover:bg-white hover:border-slate-200"
        )}
    >
      <span className={cn("text-sm lg:text-base font-bold text-left", selected ? "text-slate-900" : "text-slate-500")}>{label}</span>
      <div className={cn(
          "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all", 
          selected ? "bg-indigo-600 border-indigo-600 shadow-md" : "border-slate-100 group-hover:border-slate-200"
      )}>
        {selected && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
    </button>
  );
}

function RecommendationView({ courses }: { courses: any[] }) {
   return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-ui pb-20 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-indigo-600 to-transparent opacity-10" />
      <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
      
      <header className="max-w-4xl mx-auto w-full px-6 pt-16 pb-12 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-4 animate-soft-bounce">
             <BrainCircuit className="w-5 h-5 text-indigo-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Phân tích hoàn tất</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Lộ trình được thiết kế <br /> <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent italic">cho riêng bạn</span></h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto font-medium">Chúng tôi đã chọn lọc ra những khóa học tối ưu nhất dựa trên dữ liệu sức khỏe và mục tiêu của bạn.</p>
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {courses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 italic">
             Hiện tại chưa tìm thấy khóa học khớp hoàn toàn, hãy khám phá tất cả các lớp của giáo viên nhé!
          </div>
        ) : (
          courses.map((course, i) => (
            <div 
              key={course.id} 
              className={cn(
                "group bg-white rounded-[2.5rem] border-2 transition-all duration-500 p-6 flex flex-col hover:shadow-2xl hover:shadow-indigo-100 h-full",
                i === 0 ? "border-indigo-600 shadow-xl shadow-indigo-100/50 lg:scale-105" : "border-white hover:border-slate-100 shadow-sm"
              )}
            >
              {i === 0 && (
                <div className="self-start px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Award className="w-3 h-3" /> Lựa chọn tối ưu
                </div>
              )}
              <div className="aspect-[16/10] bg-slate-50 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center text-indigo-100 border border-slate-100">
                 <PlayCircle className="w-12 h-12 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                 <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 border text-[9px] font-black uppercase tracking-widest text-slate-700">LVL {course.level || 1}</div>
              </div>
              <div className="txt-action text-[8px] text-slate-300 uppercase tracking-widest mb-2 font-black">{course.style || "Hatha Yoga"}</div>
              <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">{course.title}</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                 <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-slate-600">5.0</span>
                 </div>
                 <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600">60m</span>
                 </div>
              </div>

              <div className="mt-auto space-y-3">
                 <Link href={`/student/course/${course.id}`} className="block">
                    <Button className={cn(
                      "w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
                      i === 0 ? "bg-indigo-600 text-white hover:bg-slate-900" : "bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                    )}>
                      Đăng ký ngay <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                 </Link>
                 {i === 0 && (
                   <p className="text-[9px] text-center text-indigo-400 font-bold uppercase tracking-wider">Phù hợp nhất với mục tiêu của bạn</p>
                 )}
              </div>
            </div>
          ))
        )}
      </main>

      <div className="max-w-4xl mx-auto w-full px-6 mt-16 text-center">
         <Link href="/student" className="inline-flex items-center gap-3 py-4 px-8 rounded-full bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
            Bỏ qua để vào Dashboard <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
    </div>
   );
}
