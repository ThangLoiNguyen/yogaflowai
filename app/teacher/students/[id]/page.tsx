import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Zap, 
  Target,
  History,
  Clock,
  ArrowRight,
  TrendingDown,
  LayoutGrid
} from "lucide-react";
import { ProgressChart } from "@/components/progress-chart";
import Link from "next/link";

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify role
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'teacher') redirect("/student-dashboard");

  // Fetch student profile with user data
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*, users:user_id(name, email)")
    .eq("id", params.id)
    .single();

  if (!profile) redirect("/teacher/students");

  // Fetch training history
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("student_id", params.id)
    .order("date", { ascending: false });

  // Prepare Progress Data
  const progressData = sessions?.slice(0, 10).reverse().map((s) => ({
    date: new Date(s.date).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' }),
    flexibility: s.flexibility_score,
    strength: s.strength_score,
  })) || [];

  const name = (profile.users as any)?.name || "Học viên";
  const email = (profile.users as any)?.email || "";

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10 animate-soft-fade">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
             <Link href="/teacher/students" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Danh sách học viên
            </Link>
            <div className="flex gap-3">
               <Button variant="outline" className="h-11 px-6 border-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-500 hover:bg-slate-50">Ghi chú AI</Button>
               <Button className="h-11 px-6 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-slate-200">Giao bài tập</Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
             
             {/* Profile Sidebar */}
             <div className="lg:col-span-4 space-y-8">
                <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden p-10 flex flex-col items-center text-center">
                   <div className="w-32 h-32 rounded-[3.5rem] bg-indigo-50 flex items-center justify-center text-4xl font-black text-indigo-300 uppercase shadow-inner mb-6 relative">
                      {name.charAt(0)}
                      <div className="absolute bottom-1 right-1 w-8 h-8 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center shadow-sm">
                         <Activity className="w-4 h-4 text-white" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h2>
                      <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-2"><Mail size={14} /> {email}</p>
                   </div>
                   <div className="w-full grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-slate-50">
                      <div className="text-left space-y-1">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Trình độ</p>
                         <Badge className="bg-sky-50 text-sky-600 border-none font-black text-[9px] uppercase">{profile.experience_level}</Badge>
                      </div>
                      <div className="text-left space-y-1">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sức mạnh</p>
                         <p className="text-xl font-black text-slate-900">{sessions?.[0]?.strength_score || 0}%</p>
                      </div>
                      <div className="text-left space-y-1">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Dẻo dai</p>
                         <p className="text-xl font-black text-indigo-600">{sessions?.[0]?.flexibility_score || 0}%</p>
                      </div>
                      <div className="text-left space-y-1">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Buổi tập</p>
                         <p className="text-xl font-black text-slate-900">{sessions?.length || 0}</p>
                      </div>
                   </div>
                </Card>

                <Card className="rounded-[3rem] border-none shadow-sm bg-white p-10 space-y-6">
                   <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                      <Target className="w-5 h-5 text-indigo-600" /> Mục tiêu ưu tiên
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {profile.goals?.map((goal: string) => (
                        <Badge key={goal} className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase px-3 py-1.5 rounded-xl">
                           {goal.replace('_', ' ')}
                        </Badge>
                      ))}
                   </div>
                </Card>

                <div className="p-8 rounded-[3rem] bg-indigo-900 text-white space-y-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Zap className="w-24 h-24 rotate-12" />
                   </div>
                   <div className="relative z-10 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">AI Recommendation</p>
                      <p className="text-sm font-medium leading-relaxed italic">
                         "Học viên có tiềm năng lớn về sức bền nhưng cần cải thiện khả năng giữ thăng bằng. Hãy tập trung vào các bài tập thăng bằng trong 2 tuần tới."
                      </p>
                      <Button variant="link" className="text-white font-black text-[10px] uppercase p-0 h-auto tracking-widest opacity-60 hover:opacity-100">Tìm lớp phù hợp <ArrowRight className="w-3.5 h-3.5 ml-2" /></Button>
                   </div>
                </div>
             </div>

             {/* Progress Content */}
             <div className="lg:col-span-8 space-y-10">
                <Card className="rounded-[3rem] border-none shadow-sm bg-white p-10">
                   <div className="flex items-center justify-between mb-10">
                      <div className="space-y-1">
                         <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-emerald-500" /> Phân tích sự tăng trưởng
                         </CardTitle>
                         <p className="text-xs font-bold text-slate-400">Diễn biến chỉ số trong 10 buổi tập gần nhất</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                           <span className="text-[10px] font-black uppercase text-slate-400">Dẻo dai</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                           <span className="text-[10px] font-black uppercase text-slate-400">Sức mạnh</span>
                        </div>
                      </div>
                   </div>
                   <div className="h-[400px]">
                      {progressData.length > 0 ? (
                        <ProgressChart data={progressData} />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                              <LayoutGrid className="w-10 h-10 text-slate-200" />
                           </div>
                           <p className="text-sm text-slate-300 font-bold uppercase tracking-widest">Chưa có dữ liệu tiến độ</p>
                        </div>
                      )}
                   </div>
                </Card>

                <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                   <CardHeader className="p-10 pb-6 border-b border-slate-50">
                      <div className="flex items-center justify-between">
                         <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <History className="w-6 h-6 text-amber-500" /> Lịch sử buổi tập
                         </CardTitle>
                         <Link href={`/teacher/students/${params.id}/history`}>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">tất cả <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
                         </Link>
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50/50">
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày tập</th>
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Loại lớp</th>
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Thời lượng</th>
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Hiệu suất</th>
                              </tr>
                           </thead>
                           <tbody>
                              {sessions?.slice(0, 5).map((session) => (
                                 <tr key={session.id} className="border-b border-slate-50 hover:bg-slate-50/20 transition-colors">
                                    <td className="px-10 py-6">
                                       <div className="flex items-center gap-3">
                                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                          <span className="text-sm font-bold text-slate-600">{new Date(session.date).toLocaleDateString('vi-VN')}</span>
                                       </div>
                                    </td>
                                    <td className="px-10 py-6">
                                       <span className="text-sm font-black text-slate-900">{session.class_type}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                       <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                          <Clock className="w-3.5 h-3.5" /> {session.duration} Phút
                                       </div>
                                    </td>
                                    <td className="px-10 py-6">
                                       <div className="flex items-center gap-1.5">
                                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                          <span className="text-xs font-black text-emerald-600">+{session.flexibility_score}%</span>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                              {(!sessions || sessions.length === 0) && (
                                 <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                                       Học viên chưa thực hiện buổi tập nào
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
