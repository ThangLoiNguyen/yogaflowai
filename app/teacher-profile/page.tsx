import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Star, Users, Clock, Award, BookOpen, 
  CalendarCheck, MessageCircle, TrendingUp, ExternalLink, Sparkles, Heart,
  ArrowRight, ShieldCheck, Instagram, Edit3, UserCircle
} from "lucide-react";
import { TeacherProfileForm } from "@/components/teacher-profile-form";

export default async function TeacherProfilePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id: searchId } = await searchParams;
  const targetId = searchId || user.id;

  // Fetch Public User Data for the target
  let { data: userData } = await supabase
    .from("users")
    .select("role, name, avatar_url")
    .eq("id", targetId)
    .single();

  if (!userData && targetId === user.id) {
    // If it's the current user and record is missing, use auth data for a basic profile
    userData = {
      role: user.user_metadata?.role || "student",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Người dùng",
      avatar_url: null
    };
  }

  if (!userData) {
    redirect("/onboarding");
  }

  // Fetch the current user's role to determine if they can edit
  const { data: currentUserData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // Fetch Teacher Profile
  const { data: profile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", targetId)
    .single();

  // A teacher can edit their own profile. 
  // A student visits to view.
  const isOwnProfile = user.id === targetId;
  const isTeacherView = isOwnProfile && currentUserData?.role === "teacher";
  const currentUserRole = currentUserData?.role || "student";

  // Fetch real stats
  const { count: classesCount } = await supabase
    .from("classes")
    .select("id", { count: 'exact', head: true })
    .eq("teacher_id", targetId);

  const { data: teacherSessions } = await supabase
    .from("training_sessions")
    .select("student_id")
    .eq("teacher_id", targetId);

  const uniqueStudentCount = new Set(teacherSessions?.map(s => s.student_id)).size;

  const stats = {
    students: uniqueStudentCount,
    classes: classesCount || 0,
    years: profile?.years_experience || 0,
    rating: profile?.rating || 5.0,
    reviews: profile?.review_count || 0,
  };

  const specialties = profile?.specialties || ["Hatha Yoga", "Vinyasa Flow"];
  const certifications = profile?.certifications || ["RYT-200"];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role={currentUserRole as "student" | "teacher"} />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16 animate-soft-fade">

          {/* ─── Profile Header ─── */}
          <div className="relative rounded-[3.5rem] bg-slate-900 p-1 bg-gradient-to-br from-slate-800 to-slate-950 shadow-2xl shadow-slate-200 border-none overflow-hidden">
             <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12">
                <Sparkles className="w-64 h-64 shadow-xl" />
             </div>
             
             <div className="bg-white rounded-[3.3rem] p-8 sm:p-14 relative z-10">
                <div className="flex flex-col lg:flex-row gap-14 items-start">
                   {/* Left Col: Avatar & Badge */}
                   <div className="shrink-0 space-y-8 flex flex-col items-center">
                      <div className="relative group">
                         <div className="w-40 h-40 rounded-[3rem] bg-slate-50 flex items-center justify-center overflow-hidden shadow-xl border-8 border-white group-hover:scale-105 transition-transform duration-700">
                            {userData.avatar_url ? (
                               <img src={userData.avatar_url} alt={userData.name || ""} className="w-full h-full object-cover" />
                            ) : (
                               <UserCircle className="w-20 h-20 text-slate-200" />
                            )}
                         </div>
                         <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl shadow-indigo-100 ring-4 ring-white">
                            <ShieldCheck className="w-6 h-6" />
                         </div>
                      </div>
                      <div className="space-y-4 text-center">
                         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase tracking-[0.2em] text-[10px] py-2 px-5 rounded-xl">
                            Senior Instructor
                         </Badge>
                         <div className="flex justify-center gap-3">
                            <button className="h-10 w-10 border border-slate-50 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-slate-300 hover:text-indigo-600">
                               <Instagram className="w-5 h-5" />
                            </button>
                            <button className="h-10 w-10 border border-slate-50 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all text-slate-300 hover:text-indigo-600">
                               <ExternalLink className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Right Col: Bio & Quick Stats */}
                   <div className="flex-1 space-y-8">
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-tight">{userData.name || "Giáo viên YogAI"}</h1>
                            {isTeacherView && (
                              <Badge className="bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest px-2 py-0.5">Chế độ xem cá nhân</Badge>
                            )}
                         </div>
                         <p className="text-xl font-bold text-indigo-600 tracking-tight">Giáo viên Yoga & Wellness Coach</p>
                         <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl italic">
                           "{profile?.bio || "Đang cập nhật tiểu sử giảng dạy của bạn để học viên biết thêm về bạn..."}"
                         </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-6 border-t border-slate-50">
                         <StatItem label="Học viên" value={stats.students} />
                         <StatItem label="Lớp dạy" value={stats.classes} />
                         <StatItem label="Kinh nghiệm" value={`${stats.years} Năm`} />
                         <StatItem label="Đánh giá" value={stats.rating} sub={<Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />} />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {!isTeacherView ? (
            /* ─── Student View (Public Profile Sections) ─── */
            <div className="space-y-16 animate-in fade-in duration-1000">
               <div className="grid lg:grid-cols-2 gap-12">
                  <SectionCard icon={Sparkles} title="Chuyên môn" color="text-indigo-500">
                    <div className="flex flex-wrap gap-3">
                        {specialties.map((s: string) => (
                          <Badge key={s} className="bg-slate-50 text-slate-500 border-none font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-tight">
                              {s}
                          </Badge>
                        ))}
                    </div>
                  </SectionCard>
                  <SectionCard icon={Award} title="Bằng cấp" color="text-amber-500">
                    <div className="space-y-4">
                        {certifications.map((c: string) => (
                          <div key={c} className="flex items-center gap-4 group">
                              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm group-hover:scale-150 transition-transform" />
                              <span className="text-sm font-black text-slate-600">{c}</span>
                          </div>
                        ))}
                    </div>
                  </SectionCard>
               </div>
               
               {/* Contact CTA for Students */}
               <div className="flex justify-center flex-col items-center gap-6 py-10">
                  <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Bạn muốn luyện tập cùng {userData.name}?</p>
                  <div className="flex gap-4">
                    <Button className="h-16 px-12 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all">
                       ĐĂNG KÝ LỚP HỌC <ArrowRight className="w-4 h-4 ml-3" />
                    </Button>
                    <Button variant="outline" className="h-16 px-10 border-slate-100 bg-white text-slate-900 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px]">
                       LIÊN HỆ TƯ VẤN
                    </Button>
                  </div>
               </div>
            </div>
          ) : (
            /* ─── Teacher Self View (Editor Interface) ─── */
            <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Badge className="bg-sky-50 text-sky-700 border-none font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl">Chỉnh sửa hồ sơ</Badge>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Công khai & Kết nối</h2>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Tình trạng hồ sơ</span>
                     <Badge className="bg-emerald-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest px-3 py-1.5">Trực tuyến</Badge>
                  </div>
               </div>

               <Card className="rounded-[3rem] border-none bg-white shadow-xl shadow-slate-100 p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12">
                     <Edit3 className="w-64 h-64" />
                  </div>
                  <CardHeader className="px-0 pt-0 pb-12 border-b border-slate-50 mb-12">
                     <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <UserCircle className="w-7 h-7 text-indigo-600" />
                        Thông tin chi tiết giảng dạy
                     </CardTitle>
                     <CardDescription className="text-slate-400 font-medium text-base">Học viên sẽ thấy thông tin này khi tìm kiếm lớp học của bạn.</CardDescription>
                  </CardHeader>
                  <TeacherProfileForm />
               </Card>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatItem({ label, value, sub }: { label: string, value: string | number, sub?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
         <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
         {sub}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, color }: { icon: any, title: string, children: React.ReactNode, color: string }) {
  return (
    <Card className="rounded-[3rem] p-12 bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
      <CardHeader className="px-0 pt-0 pb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900">{title}</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
          {children}
      </CardContent>
    </Card>
  );
}
