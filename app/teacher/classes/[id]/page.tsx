import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  MoreHorizontal, 
  UserCircle, 
  TrendingUp, 
  BookOpen,
  ArrowRight,
  Sparkles,
  History as HistoryIcon
} from "lucide-react";
import Link from "next/link";

export default async function ClassDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Class Details
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!classData || classError) {
    redirect("/teacher-dashboard");
  }

  // Fetch Registered Students
  const { data: registrations } = await supabase
    .from("class_registrations")
    .select(`
      *,
      student:student_id (
        id,
        experience_level,
        goals,
        users:user_id (name, email)
      )
    `)
    .eq("class_id", params.id);

  // Fetch Session History for this class (mocked for now as we don't have a class_id in training_sessions yet, 
  // but we can filter by students of this class)
  const studentIds = registrations?.map(r => r.student_id) || [];
  const { data: history } = await supabase
    .from("training_sessions")
    .select(`
      *,
      student:student_id (
        users:user_id (name)
      )
    `)
    .in("student_id", studentIds)
    .order("date", { ascending: false })
    .limit(10);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10 animate-soft-fade">
          
          {/* Back Button & Header */}
          <div className="space-y-6">
            <Link href="/teacher-dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Quay lại Dashboard
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">{classData.name}</h1>
                  <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase px-3 py-1">{classData.level}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> {classData.schedule}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> {classData.duration}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-400" /> {classData.enrolled}/{classData.max_capacity} Học viên</span>
                </div>
              </div>
              <div className="flex gap-3">
                 <Button variant="outline" className="h-12 border-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-50">Chỉnh sửa lớp</Button>
                 <Button className="h-12 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-slate-200">Bắt đầu buổi tập</Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Student List */}
            <div className="lg:col-span-8 space-y-8">
               <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                          <Users className="w-6 h-6 text-sky-500" /> Danh sách học viên
                       </CardTitle>
                       <Badge className="bg-slate-50 text-slate-400 border-none font-black uppercase text-[10px] px-3 py-1">{registrations?.length || 0} Thành viên</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50/50">
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Học viên</th>
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Trình độ</th>
                                 <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tiến độ</th>
                                 <th className="px-10 py-5"></th>
                              </tr>
                           </thead>
                           <tbody>
                              {registrations?.map((reg) => {
                                 const student = reg.student as any;
                                 return (
                                    <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/20 transition-colors group">
                                       <td className="px-10 py-6">
                                          <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 shadow-inner group-hover:bg-white transition-colors">
                                                {student.users.name.charAt(0)}
                                             </div>
                                             <div>
                                                <p className="font-black text-sm text-slate-900">{student.users.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400">{student.users.email}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-10 py-6">
                                          <Badge className="bg-sky-50 text-sky-600 border-none font-black uppercase text-[9px] px-2.5 py-1">
                                             {student.experience_level}
                                          </Badge>
                                       </td>
                                       <td className="px-10 py-6">
                                          <div className="flex items-center gap-2">
                                             <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                             <span className="text-xs font-black text-emerald-600">+12%</span>
                                          </div>
                                       </td>
                                       <td className="px-10 py-6 text-right">
                                          <Link href={`/teacher/students/${student.id}`}>
                                             <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-400">
                                                <ArrowRight className="w-4 h-4" />
                                             </Button>
                                          </Link>
                                       </td>
                                    </tr>
                                 );
                              })}
                              {(!registrations || registrations.length === 0) && (
                                 <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                                       Chưa có học viên đăng ký lớp này
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </CardContent>
               </Card>

                <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                       <HistoryIcon className="w-6 h-6 text-amber-500" /> Nhật ký buổi tập gần đây
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-6">
                     {history?.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50 transition-all hover:bg-white hover:shadow-md group">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                 <div className="text-xs font-black text-slate-400">{new Date(session.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                              </div>
                              <div className="space-y-1">
                                 <p className="font-black text-slate-900">{(session.student as any).users.name}</p>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{session.class_type}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-10">
                              <div className="text-right">
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-0.5">Thời lượng</p>
                                 <p className="text-sm font-black text-slate-900">{session.duration}m</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-0.5">Hiệu suất</p>
                                 <p className="text-sm font-black text-indigo-600">+{session.flexibility_score}%</p>
                              </div>
                           </div>
                        </div>
                     ))}
                     {(!history || history.length === 0) && (
                        <p className="text-center py-10 text-slate-300 font-black uppercase tracking-widest text-xs">Chưa có nhật ký buổi tập</p>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-10">
               <Card className="rounded-[3rem] border-none shadow-sm bg-slate-900 text-white p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                     <Sparkles className="w-32 h-32 rotate-12" />
                  </div>
                  <div className="relative z-10 space-y-8">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Class Insight</p>
                        <h3 className="text-2xl font-black tracking-tight">AI Analysis</h3>
                     </div>
                     <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                        "Lớp học này có chỉ số chuyên cần cao vượt trội (95%). Học viên phản hồi tốt nhất về các bài tập dẻo dai."
                      </p>
                      <div className="space-y-4 pt-4 border-t border-white/10">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Mức độ tập trung</span>
                            <span className="text-emerald-400">92%</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[92%]" />
                         </div>
                      </div>
                  </div>
               </Card>

               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Tỉ lệ tham gia</p>
                     <p className="text-3xl font-black text-slate-900">88%</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Đánh giá chung</p>
                     <p className="text-3xl font-black text-indigo-600">4.9</p>
                  </div>
               </div>

               <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 space-y-6">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                     <BookOpen className="w-5 h-5 text-indigo-600" /> Tài liệu lớp học
                  </h3>
                  <div className="space-y-4">
                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Giáo án tuần 12</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                     </div>
                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tight">Kỹ thuật nhịp thở</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
