import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Star, Users, Clock, Award, BookOpen, 
  CalendarCheck, MessageCircle, TrendingUp, ExternalLink, Sparkles, Heart,
  ArrowRight, ShieldCheck, Instagram, Edit3, UserCircle, Mail, MapPin, Plus,
  CheckCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TeacherEditDialog } from "@/components/profile/teacher-edit-dialog";


export default async function TeacherProfilePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id: searchId } = await searchParams;
  const targetId = searchId || user.id;

  // Fetch Public User Data
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", targetId)
    .single();

  if (!userData) {
    redirect("/teacher");
  }

  // Fetch Teacher Profile Details
  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", targetId)
    .single();

  const isOwnProfile = user.id === targetId;
  const fullName = userData?.full_name || "Giáo viên YogAI";

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-2 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Hồ sơ chuyên môn</span>
          </div>
          <h1 className="text-3xl font-display text-[var(--text-primary)]">
            GV. <span className="italic text-emerald-600">{fullName.split(" ").pop()}</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl">
             Thấu hiểu học viên và tối ưu hóa giáo trình thông qua hệ thống AI Insight chuyên sâu.
          </p>
        </div>
        
        <div className="flex gap-4">
           {isOwnProfile && (
             <>
               <Button variant="outline" className="h-10 px-5 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50">
                  Cài đặt tài khoản
               </Button>
               <TeacherEditDialog />
             </>
           )}
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
         {/* Left Col: Teacher Identity */}
         <div className="lg:col-span-4 space-y-8">
            <div className="p-10 rounded-[var(--r-xl)] bg-white border border-[var(--border)] shadow-sm space-y-8">
               <div className="flex flex-col items-center text-center">
                  <div className="w-40 h-40 rounded-[3rem] bg-emerald-50 flex items-center justify-center text-6xl mb-8 relative border-8 border-white shadow-xl group overflow-hidden">
                     {userData?.avatar_url ? (
                       <img src={userData.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                     ) : <UserCircle className="w-24 h-24 text-emerald-100" />}
                     <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white translate-x-12 group-hover:translate-x-0 transition-transform">
                        <ShieldCheck className="w-4 h-4" />
                     </div>
                  </div>
                  <h3 className="text-2xl mb-1">{fullName}</h3>
                  <div className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-black uppercase tracking-widest mb-6">Verified Instructor</div>
                  <div className="flex gap-4">
                     <button className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-xl hover:bg-emerald-50 transition-all text-slate-300 hover:text-emerald-600">
                        <Instagram className="w-5 h-5" />
                     </button>
                     <button className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-xl hover:bg-emerald-50 transition-all text-slate-300 hover:text-emerald-600">
                        <ExternalLink className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               <div className="pt-8 border-t border-[var(--bg-muted)] grid grid-cols-2 gap-5">
                  <div>
                     <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">142</div>
                     <div className="text-[10px] label-mono opacity-50 uppercase font-black">Học viên</div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-amber-500 mb-1 flex items-center gap-1">4.9 <Star className="w-4 h-4 fill-amber-400 border-none" /></div>
                     <div className="text-[10px] label-mono opacity-50 uppercase font-black">Rating</div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-emerald-600 mb-1">{profile?.years_experience || 5} Năm</div>
                     <div className="text-[10px] label-mono opacity-50 uppercase font-black">Kinh nghiệm</div>
                  </div>
                  <div>
                     <div className="text-2xl font-bold text-blue-500 mb-1">98%</div>
                     <div className="text-[10px] label-mono opacity-50 uppercase font-black">Retention</div>
                  </div>
               </div>
            </div>

            <div className="p-10 rounded-[var(--r-xl)] bg-emerald-900 text-white shadow-xl relative overflow-hidden group border border-emerald-800">
               <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                     <TrendingUp className="w-5 h-5 text-emerald-400" />
                     <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">Teacher Insight</span>
                  </div>
                  <p className="text-lg font-display italic leading-relaxed mb-8">
                    "Tỷ lệ học viên quay lại sau các lớp Vinyasa của bạn cao hơn 15% so với trung bình hệ thống."
                  </p>
                  <Button variant="outline" className="w-full border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 h-9 rounded-xl text-xs font-bold uppercase tracking-widest ring-0">Duyệt Báo Cáo Tháng</Button>
               </div>
            </div>
         </div>

         {/* Right Col: Bio & Specializations */}
         <div className="lg:col-span-8 space-y-10">
            <h2 className="text-xl font-display px-2">Chuyên môn & Bio</h2>
            
            <div className="p-5 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-8">
               <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                     <Edit3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-lg mb-2">Tiểu sử giảng dạy</h4>
                     <p className="text-[var(--text-secondary)] leading-relaxed italic">
                        "{profile?.teaching_style || "Chưa cập nhật phong cách giảng dạy cá nhân. Điều này sẽ giúp học viên dễ tìm thấy bạn hơn!"}"
                     </p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <h4 className="font-bold text-[var(--text-primary)]">Bằng cấp & Chứng chỉ</h4>
                     </div>
                     <div className="space-y-2">
                        {(profile?.certifications as string[])?.map(cert => (
                           <div key={cert} className="flex items-center gap-3 p-3 rounded-xl border border-dotted border-slate-200 text-sm font-medium">
                              <CheckCircle className="w-4 h-4 text-emerald-500" /> {cert}
                           </div>
                        )) || <div className="text-sm text-[var(--text-hint)] italic">Đang cập nhật chứng chỉ...</div>}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        <h4 className="font-bold text-[var(--text-primary)]">Chuyên môn chính</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {(profile?.specializations as string[])?.map(spec => (
                           <Badge key={spec} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold uppercase text-[10px] tracking-wider">
                              {spec}
                           </Badge>
                        )) || <div className="text-sm text-[var(--text-hint)] italic">Dành cho mọi trình độ.</div>}
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions for Teacher */}
            {isOwnProfile && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { icon: Plus, label: "Tạo lớp mới", href: "/teacher/classes/new", color: "text-emerald-600", bg: "bg-emerald-50" },
                   { icon: CalendarCheck, label: "Lịch dạy", href: "/teacher/classes", color: "text-blue-600", bg: "bg-blue-50" },
                   { icon: Users, label: "Học viên", href: "/teacher/students", color: "text-indigo-600", bg: "bg-indigo-50" },
                   { icon: MessageCircle, label: "Tin nhắn", href: "/teacher/messages", color: "text-amber-600", bg: "bg-amber-50" },
                 ].map((action, idx) => (
                   <Link key={idx} href={action.href} className="group">
                     <div className="p-4 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm hover:border-emerald-500 transition-all text-center space-y-4">
                        <div className={`w-9 h-9 ${action.bg} mx-auto rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                           <action.icon className={`w-6 h-6 ${action.color}`} />
                        </div>
                        <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[var(--text-muted)] group-hover:text-emerald-600">{action.label}</div>
                     </div>
                   </Link>
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
