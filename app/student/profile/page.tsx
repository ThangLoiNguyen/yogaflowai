import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  User, Heart, Zap, Calendar, ArrowRight, Sparkles, Activity, Ruler, Weight, Target, Edit, Mail, ShieldCheck, CheckCircle, Clock, Waves, ListChecks, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { StudentEditDialog } from "@/components/profile/student-edit-dialog";
import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: quiz } = await supabase.from("onboarding_quiz").select("*").eq("student_id", user.id).single();

  const fullName = userData?.full_name || user.email?.split("@")[0] || "Học viên";

  // Helper to map values to labels for display
  const getLabel = (value: string, type: string) => {
    if (!value) return "---";
    const labels: Record<string, string> = {
      // Age
      "under_18": "Dưới 18", "18_25": "18–25 tuổi", "26_35": "26–35 tuổi", "36_45": "36–45 tuổi", "above_45": "Trên 45 tuổi",
      // Experience
      "never": "Chưa tập", "a_few": "Mới tập", "1_6_months": "1–6 tháng", "above_6_months": "Trên 6 tháng", "above_2_years": "Trên 2 năm",
      // Fitness
      "very_weak": "Yếu", "average": "Vừa sức", "quite_good": "Khá tốt", "good": "Rất tốt",
      // Flexibility
      "very_stiff": "Rất cứng", "quite_flexible": "Khá dẻo", "very_flexible": "Rất dẻo",
      // Style
      "yin_restorative": "Yin / Phục hồi", "vinyasa_power": "Vinyasa / Power", "hatha_breathwork": "Hatha / Hơi thở", "consult": "Cần tư vấn",
      // Health
      "back_pain": "Đau lưng", "joint_issues": "Các khớp", "high_blood_pressure": "Huyết áp", "pregnancy": "Mới sinh/Thai", "none": "Khỏe mạnh",
      // Goals
      "stress_relief": "Giảm Stress", "weight_loss": "Giảm cân", "flexibility": "Linh hoạt", "back_pain_relief": "Trị liệu lưng", "stamina": "Sức bền", "mindfulness": "Tĩnh tâm",
      // Time
      "morning": "Sáng", "noon": "Trưa", "afternoon": "Chiều", "evening": "Tối"
    };
    return labels[value] || value;
  };

  // Process Health Issues
  const rawHealth = quiz?.health_issues ? quiz.health_issues.split(", ").map((i: string) => i.trim()).filter(Boolean) : [];
  const healthTags = rawHealth.filter((i: string) => !i.startsWith("Lưu ý khác:")).map((i: string) => getLabel(i, "health"));
  const healthOther = rawHealth.find((i: string) => i.startsWith("Lưu ý khác:"))?.replace("Lưu ý khác: ", "");

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
         
         {/* Sidebar Profile Card */}
         <div className="lg:col-span-4 space-y-4">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-50 border-[6px] border-white shadow-2xl flex items-center justify-center text-4xl mb-6 relative group overflow-hidden">
                     {userData?.avatar_url ? (
                       <img src={userData.avatar_url} className="w-full h-full object-cover rounded-[2rem]" alt="Avatar" />
                     ) : (
                       <span className="group-hover:scale-110 transition-transform duration-500">🧘‍♂️</span>
                     )}
                     <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-2xl font-black text-indigo-900 leading-tight mb-1">{fullName}</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                     <Mail className="w-3.5 h-3.5 text-indigo-400" /> {userData?.email}
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-50 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Gói tập</div>
                      <Badge className="bg-indigo-600 text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl shadow-lg shadow-indigo-200">
                         {userData?.subscription_tier?.toUpperCase() || 'FREE MEMBER'}
                      </Badge>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Đã tham gia</div>
                      <div className="text-sm font-bold text-slate-600">
                         {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : 'Mới tham gia'}
                      </div>
                   </div>
               </div>

               <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
                  <StudentEditDialog mode="profile" fullWidth />
                  <LogoutButton className="lg:hidden w-full h-11 rounded-2xl bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 transition-all" showFullText />
               </div>
            </div>

            {/* AI Insight Teaser */}
            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
               <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-indigo-500/20 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
               <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><Target className="w-4 h-4 text-indigo-400" /></div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Recommendation</span>
                   </div>
                   <p className="text-xl font-black leading-tight mb-6">Bạn đã sẵn sàng vượt ngưỡng hôm nay?</p>
                   <Link href="/student/explore" className="block w-full">
                     <Button className="w-full h-11 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg group-hover:shadow-indigo-50/10">
                       Khám phá lớp mới <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                   </Link>
               </div>
            </div>
         </div>

         {/* Detailed Information Area */}
         <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hồ sơ Chi tiết</h2>
               <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                 <CheckCircle className="w-3.5 h-3.5" /> Đồng bộ AI thành công
               </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
               <InfoCard 
                 title="Mục tiêu Luyện tập" 
                 icon={<Activity className="text-rose-500" />} 
                 tags={Array.isArray(quiz?.goals) ? quiz.goals.map((g: string) => getLabel(g, "goal")) : []}
                 color="rose"
               />
               <InfoCard 
                 title="Thông tin Sức khỏe" 
                 icon={<Heart className="text-red-500" />} 
                 tags={healthTags}
                 color="red"
                 subText={healthOther ? `Lưu ý thêm: ${healthOther}` : undefined}
               />
            </div>

            {/* Performance Stats */}
            <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center"><Zap className="w-5 h-5 text-amber-500" /></div>
                     <h4 className="text-lg font-black text-slate-800 tracking-tight">Thông số Thể trạng (Quiz)</h4>
                  </div>
                  <Link href="/register/quiz">
                    <Button variant="ghost" className="h-8 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 rounded-xl px-4 tracking-widest">Làm lại Quiz</Button>
                  </Link>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatItem label="Trình độ" value={getLabel(quiz?.experience_level, "experience")} icon={<Zap className="w-3 h-3" />} />
                  <StatItem label="Thể lực" value={getLabel(quiz?.fitness_level, "fitness")} icon={<Activity className="w-3 h-3" />} />
                  <StatItem label="Độ dẻo" value={getLabel(quiz?.flexibility, "flexibility")} icon={<Waves className="w-3 h-3" />} />
                  <StatItem label="Độ tuổi" value={getLabel(quiz?.age, "age")} icon={<User className="w-3 h-3" />} />
               </div>

               <div className="pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center"><Calendar className="w-5 h-5 text-indigo-500" /></div>
                     <h4 className="text-lg font-black text-slate-800 tracking-tight">Kế hoạch Luyện tập</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <StatItem label="Phong cách" value={getLabel(quiz?.style, "style")} />
                     <StatItem label="Lịch rảnh" value={Array.isArray(quiz?.available_days) && quiz.available_days.length > 0 ? quiz.available_days.join(", ") : "Chưa chọn"} />
                     <StatItem label="Thời điểm" value={getLabel(quiz?.preferred_time, "time")} />
                  </div>
               </div>
            </div>

            {/* Expectations / AI Notes */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-white border-2 border-indigo-100/50 border-dashed rounded-[3rem] p-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-30" />
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-14 h-14 bg-white rounded-[1.25rem] shadow-xl flex items-center justify-center shrink-0 border border-indigo-50 group-hover:scale-110 transition-transform duration-500">
                     <ListChecks className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                     <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3">Kỳ vọng & Ghi chú cho giáo viên</h4>
                     <p className="text-lg font-bold text-indigo-900/80 leading-relaxed italic pr-4">
                       "{quiz?.expectations || "Chưa có ghi chú đặc biệt dành cho lộ trình AI của bạn..."}"
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, tags, color, subText }: { title: string, icon: React.ReactNode, tags: string[], color: "rose" | "red" | "indigo", subText?: string }) {
  const colorMap = {
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    red: "bg-red-50 text-red-600 border-red-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  return (
    <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-5 hover:shadow-md transition-shadow h-full flex flex-col">
       <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">{icon}</div>
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h4>
       </div>
       <div className="flex flex-wrap gap-2 flex-1 items-start">
          {tags.length > 0 ? tags.map((tag, idx) => (
            <span key={idx} className={cn("px-4 py-1.5 rounded-xl text-xs font-bold border", colorMap[color])}>
               {tag}
            </span>
          )) : <span className="text-slate-300 text-xs italic">Chưa cập nhật</span>}
       </div>
       {subText && (
         <div className="pt-4 border-t border-slate-50 flex items-start gap-2 text-[11px] font-bold text-slate-500 leading-relaxed italic">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            {subText}
         </div>
       )}
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
       <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em] flex items-center gap-1.5">
          {icon}{label}
       </div>
       <div className="text-base font-black text-indigo-900 leading-tight">
          {value}
       </div>
    </div>
  );
}
