import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User, 
  Heart, 
  Zap, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Activity,
  Ruler,
  Weight,
  Target
} from "lucide-react";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Public User Data
  let { data: userData } = await supabase
    .from("users")
    .select("role, name, avatar_url")
    .eq("id", user.id)
    .single();

  if (!userData) {
    // If it's the current user and record is missing, use auth data for a basic profile
    userData = {
      role: user.user_metadata?.role || "student",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Người dùng",
      avatar_url: null
    };
  }

  // Fetch Student Profile
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  const bmi = (profile.weight && profile.height) 
    ? (profile.weight / ((profile.height/100)**2)).toFixed(1) 
    : "--";

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="student" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16 animate-soft-fade">

          {/* ─── Profile Header ─── */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4">
              <Badge className="bg-indigo-50 text-indigo-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-xl">
                 Thông tin cá nhân học viên
              </Badge>
              <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
                Hồ sơ của <span className="text-indigo-600">{userData.name || "bạn"}</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium max-w-xl">
                Quản lý các chỉ số cơ thể và mục tiêu luyện tập để YogAI luôn mang đến lộ trình tối ưu nhất.
              </p>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm">
               <div className="h-16 w-16 rounded-[1.8rem] bg-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">
                  🧘‍♂️
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Trạng thái rèn luyện</p>
                  <p className="text-xl font-black text-slate-900">Năng nổ</p>
               </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
             {/* Left Column: Quick Metrics & Onboarding Recap */}
             <div className="lg:col-span-4 space-y-8">
                <Card className="rounded-[3rem] border-none bg-white shadow-xl shadow-slate-100 p-10 space-y-8">
                   <div className="space-y-6">
                      <MetricRow icon={Ruler} label="Chiều cao" value={`${profile.height} cm`} color="text-sky-500" />
                      <MetricRow icon={Weight} label="Cân nặng" value={`${profile.weight} kg`} color="text-emerald-500" />
                      <MetricRow icon={Activity} label="Chỉ số BMI" value={bmi} color="text-rose-500" detail="Bình thường" />
                   </div>
                   
                   <div className="pt-8 border-t border-slate-50 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Mục tiêu hiện tại</p>
                      <div className="flex flex-wrap gap-2">
                        {(profile.goals as string[])?.map(goal => (
                          <Badge key={goal} className="bg-slate-50 text-slate-600 border-none font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase">
                             {goal === 'lose_weight' ? 'Giảm cân' : goal === 'flexibility' ? 'Dẻo dai' : goal}
                          </Badge>
                        ))}
                      </div>
                   </div>
                </Card>

                <div className="p-10 rounded-[3rem] bg-indigo-600 text-white space-y-6 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                   <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Lời khuyên từ YogAI</p>
                   <p className="text-lg font-bold leading-relaxed">
                     "Bạn đang tiến triển rất tốt với mục tiêu dẻo dai. Hãy thử cập nhật cân nặng mới để chúng tôi tính toán lại năng lượng tiêu thụ nhé!"
                   </p>
                </div>
             </div>

             {/* Right Column: Editor (Reusing Onboarding Form for editing) */}
             <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-indigo-600" />
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cập nhật chỉ số</h2>
                   </div>
                </div>
                
                <Card className="rounded-[3.5rem] border-none bg-white shadow-xl shadow-slate-100 p-12">
                   <p className="text-slate-400 font-medium mb-10">Chỉnh sửa thông tin bên dưới để thay đổi hồ sơ sức khỏe của bạn.</p>
                   <OnboardingForm />
                </Card>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function MetricRow({ icon: Icon, label, value, color, detail }: { icon: any, label: string, value: string, color: string, detail?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 border border-slate-50">
       <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm`}>
             <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-none mb-1">{label}</p>
             <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
          </div>
       </div>
       {detail && <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase">{detail}</Badge>}
    </div>
  );
}
