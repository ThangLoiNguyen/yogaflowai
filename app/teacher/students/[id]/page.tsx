import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNav } from "@/components/dashboard-nav";
import { ArrowLeft, History, TrendingUp, Edit, MessageSquare, ClipboardCheck, Sparkles, UserCircle, Activity, PlusCircle, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { TeacherSessionForm } from "@/components/teacher-session-form";
import { ProgressChart } from "@/components/progress-chart";

export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch Student Profile
  const { data: profile } = await supabase
    .from("student_profiles")
    .select(`
      *,
      users:user_id (name, email)
    `)
    .eq("id", id)
    .single();

  if (!profile) notFound();

  // Fetch Session History
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("student_id", id)
    .order("date", { ascending: false });

  // Prepare Progress Data for Chart
  const progressData = sessions?.slice(0, 10).reverse().map((s) => ({
    date: new Date(s.date).toLocaleDateString(),
    flexibility: s.flexibility_score,
    strength: s.strength_score,
  })) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12 animate-soft-fade">
          
          <header className="space-y-6">
            <Link href="/teacher/students" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
               <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-xl shadow-indigo-50">
                    <UserCircle className="w-12 h-12 text-indigo-400" />
                 </div>
                 <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                       {(profile.users as any)?.name || (profile.users as any)?.email?.split("@")[0] || "Ẩn danh"}
                    </h1>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-sky-50 text-sky-600 border-none font-black uppercase tracking-widest text-[9px] px-2.5 py-1">
                         {profile.experience_level}
                      </Badge>
                      <span className="text-slate-200">|</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {profile.id.slice(0,8)}</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <Button variant="outline" className="h-14 px-8 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50">
                    <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                 </Button>
                 <Button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700">
                    <MessageSquare className="w-4 h-4 mr-2" /> Nhắn tin
                 </Button>
              </div>
            </div>
          </header>

          <div className="grid gap-12 lg:grid-cols-3">
             {/* Profile Highlights */}
             <div className="lg:col-span-1 space-y-8">
                <Card className="rounded-[2.5rem] p-8 bg-white border-slate-50 shadow-sm border-none">
                   <CardHeader className="px-0 pt-0 pb-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thông tin & Mục tiêu</p>
                   </CardHeader>
                   <CardContent className="px-0 pb-0 space-y-10">
                      <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">Mục tiêu hiện tại</p>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {(profile.goals as string[])?.map((goal) => (
                               <Badge key={goal} className="bg-emerald-50 text-emerald-600 border-none font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase">
                                  {goal.replace('_', ' ')}
                               </Badge>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4 pt-8 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-rose-500" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">Sức khỏe & Chấn thương</p>
                         </div>
                         <div className="flex flex-wrap gap-2">
                            {(profile.injuries as string[])?.map((injury) => (
                               <Badge key={injury} className="bg-rose-50 text-rose-600 border-none font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase">
                                  {injury.replace('_', ' ')}
                               </Badge>
                            ))}
                            {(!profile.injuries || (profile.injuries as string[]).length === 0) && (
                               <p className="text-xs text-slate-400 italic font-medium">Không có báo cáo.</p>
                            )}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                         <div className="p-4 bg-slate-50/50 rounded-2xl space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Độ tuổi</p>
                            <p className="text-xl font-black text-slate-900">{profile.age || "--"}</p>
                         </div>
                         <div className="p-4 bg-slate-50/50 rounded-2xl space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chỉ số BMI</p>
                            <p className="text-xl font-black text-slate-900">
                               {profile.weight && profile.height ? (profile.weight / ((profile.height/100)**2)).toFixed(1) : "--"}
                            </p>
                         </div>
                      </div>
                   </CardContent>
                </Card>
             </div>

             {/* Main Content Area */}
             <div className="lg:col-span-2 space-y-12">
                  {/* Progress Chart */}
                  <Card className="rounded-[3rem] p-10 bg-white border-slate-50 shadow-sm border-none">
                     <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                           <TrendingUp className="w-6 h-6 text-indigo-500" />
                           <CardTitle className="text-2xl font-black text-slate-900">Tiến độ luyện tập</CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent className="px-0 pb-0 min-h-[350px]">
                        {progressData.length > 0 ? (
                          <ProgressChart data={progressData} />
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                             <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                                <Activity className="w-10 h-10 text-slate-200" />
                             </div>
                             <p className="text-slate-400 font-medium">Chưa có dữ liệu cho học viên này.</p>
                          </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Session Report Form */}
                  <div className="relative group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-[3.1rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                     <Card className="relative rounded-[3rem] bg-white border-none shadow-xl overflow-hidden">
                        <CardHeader className="p-10 pb-0">
                           <div className="flex items-center gap-3 mb-2">
                              <PlusCircle className="w-6 h-6 text-emerald-500" />
                              <CardTitle className="text-2xl font-black text-slate-900">Ghi nhận buổi tập mới</CardTitle>
                           </div>
                           <p className="text-slate-400 font-medium text-sm">Cập nhật chỉ số và ghi chú chuyên môn sau mỗi buổi dạy.</p>
                        </CardHeader>
                        <CardContent className="p-10">
                           <TeacherSessionForm studentId={profile.id} />
                        </CardContent>
                     </Card>
                  </div>

                  {/* History of sessions */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <History className="w-6 h-6 text-amber-500" />
                        <h2 className="text-2xl font-black text-slate-900">Lịch sử buổi tập</h2>
                     </div>
                     
                     <div className="space-y-4">
                        {sessions?.length ? sessions.map((session) => (
                           <div key={session.id} className="p-8 rounded-[2rem] bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                 <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(session.date).toLocaleDateString()}</span>
                                       <Badge className="bg-slate-50 text-slate-600 border-none font-black uppercase text-[9px] px-2 py-0.5">{session.class_type}</Badge>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900">Báo cáo chuyên môn</h4>
                                    <p className="text-[13px] font-medium text-slate-400 leading-relaxed italic">"{session.notes || "Không có ghi chú thêm."}"</p>
                                 </div>
                                 <div className="flex gap-4">
                                    <ScoreBadge label="Dẻo dai" score={session.flexibility_score} color="text-emerald-500" bg="bg-emerald-50" />
                                    <ScoreBadge label="Sức mạnh" score={session.strength_score} color="text-indigo-500" bg="bg-indigo-50" />
                                 </div>
                              </div>
                           </div>
                        )) : (
                           <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-100">
                              <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Chưa có dữ liệu lịch sử</p>
                           </div>
                        )}
                     </div>
                  </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ScoreBadge({ label, score, color, bg }: { label: string, score: number, color: string, bg: string }) {
   return (
      <div className={`flex flex-col items-center justify-center p-4 rounded-2xl ${bg} min-w-[100px] border border-transparent hover:border-white transition-all`}>
         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
         <span className={`text-2xl font-black ${color}`}>{score}%</span>
      </div>
   );
}
