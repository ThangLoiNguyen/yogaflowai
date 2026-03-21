import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
  Target,
  Edit,
  Mail,
  ShieldCheck,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { StudentEditDialog } from "@/components/profile/student-edit-dialog";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Public User Data
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch Onboarding Quiz (the new profile table)
  const { data: quiz } = await supabase
    .from("onboarding_quiz")
    .select("*")
    .eq("student_id", user.id)
    .single();

  const fullName = userData?.full_name || user.email?.split("@")[0] || "Học viên";

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-2 shadow-sm">
             <User className="w-4 h-4 text-[var(--accent)]" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Hồ sơ cá nhân</span>
          </div>
          <h1 className="text-5xl font-display text-[var(--text-primary)]">
            Chào <span className="italic text-[var(--accent)]">{fullName.split(" ").pop()}</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl">
            Quản lý thông tin cá nhân và các chỉ số sức khỏe để AI tối ưu hóa lộ trình tập luyện của bạn.
          </p>
        </div>
        
        <div className="flex gap-4">
           <StudentEditDialog mode="avatar" />
           <StudentEditDialog mode="profile" />
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
         {/* Left Col: Account Info */}
         <div className="lg:col-span-4 space-y-8">
            <div className="p-10 rounded-[var(--r-xl)] bg-white border border-[var(--border)] shadow-sm space-y-8">
               <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-3xl bg-[var(--bg-muted)] flex items-center justify-center text-5xl mb-6 relative">
                     {userData?.avatar_url ? (
                       <img src={userData.avatar_url} className="w-full h-full object-cover rounded-3xl" alt="Avatar" />
                     ) : "🧘‍♂️"}
                     <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center shadow-lg border-4 border-white">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                  </div>
                  <h3 className="text-2xl mb-1">{fullName}</h3>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-medium">
                     <Mail className="w-3.5 h-3.5" /> {userData?.email}
                  </div>
               </div>

               <div className="pt-8 border-t border-[var(--bg-muted)] space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="label-mono opacity-60">Thành viên</div>
                     <Badge className="bg-[var(--accent-tint)] text-[var(--accent)] border-none font-bold px-3 py-1 rounded-lg text-[10px] uppercase">
                        {userData?.subscription_tier === 'pro' ? 'Pro Member' : 'Free Tier'}
                     </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="label-mono opacity-60">Join Date</div>
                     <div className="text-sm font-bold text-[var(--text-primary)]">
                        {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('vi-VN') : 'Mới tham gia'}
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-10 rounded-[var(--r-xl)] bg-slate-900 text-white shadow-xl relative overflow-hidden group border border-slate-800">
               <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                     <Target className="w-5 h-5 text-blue-400" />
                     <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-blue-400">AI Recommendation</span>
                  </div>
                  <p className="text-lg font-display italic leading-relaxed mb-8">
                    "Bạn đang tiến triển rất tốt với mục tiêu dẻo dai. Hãy thử một lớp Ashtanga để tăng sức bền."
                  </p>
                  <Button variant="outline" className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest ring-0">Xác nhận mục tiêu</Button>
               </div>
            </div>
         </div>

         {/* Right Col: Health & Goals Recap */}
         <div className="lg:col-span-8 space-y-10">
            <h2 className="text-3xl font-display px-2">Chỉ số & Mục tiêu sức khỏe</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                     <Activity className="w-5 h-5 text-rose-500" />
                     <h4 className="font-bold text-[var(--text-primary)]">Mục tiêu luyện tập</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {(quiz?.goals)?.map((goal: string) => (
                        <div key={goal} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold">
                           {goal.toUpperCase()}
                        </div>
                     )) || <span className="text-sm text-[var(--text-hint)] italic">Chưa xác định mục tiêu cụ thể.</span>}
                  </div>
               </div>

               <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                     <Heart className="w-5 h-5 text-red-500" />
                     <h4 className="font-bold text-[var(--text-primary)]">Tình trạng sức khỏe</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {quiz?.health_issues ? quiz.health_issues.split(',').map((issue: string) => (
                        <div key={issue} className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold">
                           {issue.trim()}
                        </div>
                     )) : <span className="text-sm text-[var(--text-hint)] italic">Không có vấn đề sức khỏe lưu ý.</span>}
                  </div>
               </div>

               <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-6 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <h4 className="font-bold text-[var(--text-primary)]">Thông tin Onboarding khác</h4>
                     </div>
                     <Link href="/register/quiz">
                        <Button variant="ghost" className="text-[var(--accent)] font-bold text-[10px] uppercase hover:bg-[var(--bg-muted)]">Thiết lập lại Quiz</Button>
                     </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     <div>
                        <div className="label-mono opacity-50 mb-1">Kinh nghiệm</div>
                        <div className="font-bold text-[var(--text-primary)]">Cấp độ {quiz?.experience_level || 1}</div>
                     </div>
                     <div>
                        <div className="label-mono opacity-50 mb-1">Thể lực</div>
                        <div className="font-bold text-[var(--text-primary)]">{quiz?.fitness_level || 3}/5</div>
                     </div>
                     <div>
                        <div className="label-mono opacity-50 mb-1">Lịch rảnh</div>
                        <div className="font-bold text-[var(--text-primary)]">{(quiz?.available_days as string[])?.join(", ") || "Chưa cập nhật"}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm p-10 mt-12">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                     <ArrowRight className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                     <h4 className="font-bold text-lg mb-2">Kỳ vọng của bạn</h4>
                     <p className="text-[var(--text-secondary)] italic">
                        "{quiz?.expectations || "Bạn chưa điền kỳ vọng cụ thể sau khóa học. Điều này giúp AI tốt hơn trong việc chọn lớp đấy!"}"
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
