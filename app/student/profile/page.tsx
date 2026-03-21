import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  User, Heart, Zap, Calendar, ArrowRight, Sparkles, Activity, Ruler, Weight, Target, Edit, Mail, ShieldCheck, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { StudentEditDialog } from "@/components/profile/student-edit-dialog";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: quiz } = await supabase.from("onboarding_quiz").select("*").eq("student_id", user.id).single();

  const fullName = userData?.full_name || user.email?.split("@")[0] || "Học viên";

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-4 space-y-4">
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-8">
               <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-3xl mb-4 relative border-8 border-white shadow-xl">
                     {userData?.avatar_url ? (
                       <img src={userData.avatar_url} className="w-full h-full object-cover rounded-[2rem]" alt="Avatar" />
                     ) : "🧘‍♂️"}
                     <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                        <ShieldCheck className="w-4 h-4" />
                     </div>
                  </div>
                  <h3 className="txt-title text-indigo-900 border-none mb-0.5">{fullName}</h3>
                  <div className="flex items-center gap-2 txt-action text-slate-300">
                     <Mail className="w-3.5 h-3.5" /> {userData?.email}
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-50 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="txt-action text-slate-300">Thành viên</div>
                      <Badge className="bg-indigo-50 text-indigo-600 border-none txt-action px-2 py-0.5 rounded-lg">
                         {userData?.subscription_tier === 'pro' ? 'Pro' : 'Free'}
                      </Badge>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="txt-action text-slate-300">Ngày tham gia</div>
                      <div className="txt-content font-bold text-slate-600">
                         {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('vi-VN') : 'Mới'}
                      </div>
                   </div>
               </div>

               <div className="pt-4 border-t border-slate-50 flex justify-center">
                  <StudentEditDialog mode="profile" />
               </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-indigo-600 text-white shadow-lg relative overflow-hidden group border-none">
               <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4 shrink-0">
                      <Target className="w-4 h-4 text-white/70" />
                      <span className="txt-action text-white/70">Mục tiêu AI</span>
                   </div>
                   <p className="txt-title leading-tight mb-6 text-white border-none">Sẵn sàng cùng YogAI?</p>
                   <Link href="/student/explore" className="block w-full">
                     <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-indigo-600 hover:border-white h-8 rounded-xl txt-action bg-transparent transition-all">Khám phá</Button>
                   </Link>
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 space-y-6">
             <h2 className="txt-title px-2 border-none mb-0 leading-tight">Dữ liệu & Mục tiêu</h2>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-4">
                   <div className="flex items-center gap-3 mb-1">
                      <Activity className="w-4 h-4 text-rose-500" />
                      <h4 className="txt-action text-slate-700 opacity-60">Mục tiêu</h4>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {(quiz?.goals)?.map((goal: string) => (
                         <div key={goal} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl txt-action truncate">{goal}</div>
                      )) || <span className="txt-content italic opacity-50">Trống</span>}
                   </div>
               </div>
               <div className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-4">
                   <div className="flex items-center gap-3 mb-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <h4 className="txt-action text-slate-700 opacity-60">Sức khỏe</h4>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {quiz?.health_issues ? quiz.health_issues.split(',').map((issue: string) => (
                         <div key={issue} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-xl txt-action truncate">{issue.trim()}</div>
                      )) : <span className="txt-content italic opacity-50">Trống</span>}
                   </div>
               </div>
               <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h4 className="font-bold text-sm text-slate-700">Thông số Onboarding</h4>
                     </div>
                     <Link href="/register/quiz"><Button variant="ghost" className="text-indigo-600 font-black text-[9px] uppercase hover:bg-indigo-50 rounded-xl px-4">Thiết lập lại</Button></Link>
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                         <div className="txt-action text-slate-300 mb-1">Trình độ</div>
                         <div className="txt-content font-bold text-slate-600">Level {quiz?.experience_level || 1}</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                         <div className="txt-action text-slate-300 mb-1">Thể lực</div>
                         <div className="txt-content font-bold text-slate-600">{quiz?.fitness_level || 3}/5</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
                         <div className="txt-action text-slate-300 mb-1">Lịch</div>
                         <div className="txt-content font-bold text-slate-600 truncate">{(quiz?.available_days as string[])?.join("-") || "---"}</div>
                      </div>
                   </div>
               </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-[2.5rem] p-8 mt-4 shadow-sm border-dashed">
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0"><ArrowRight className="w-5 h-5 text-indigo-500" /></div>
                   <div>
                      <h4 className="txt-action text-indigo-900 mb-1 opacity-60">Kỳ vọng</h4>
                      <p className="txt-content text-indigo-600/70 italic leading-relaxed pr-4">"{quiz?.expectations || "Chưa điền..."}"</p>
                   </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
