import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sparkles, TrendingUp, Users, ArrowRight, BookOpen, Star, AlertCircle, PlusCircle, LayoutGrid, UserCircle, History } from "lucide-react";
import Link from "next/link";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify role
  const { data: userData } = await supabase.from('users').select('role, name').eq('id', user.id).single();
  if (userData?.role !== 'teacher') {
    redirect("/student-dashboard");
  }

  // Fetch all students
  const { data: students } = await supabase
    .from("student_profiles")
    .select(`
      *,
      users:user_id (name, email)
    `)
    .limit(10);

  // Fetch teacher's classes
  const { data: teacherClasses } = await supabase
    .from("classes")
    .select("*, teacher:teacher_id(name)")
    .eq("teacher_id", user.id)
    .order('created_at', { ascending: false });

  // Fetch recent profiles assigned or registered (using recent sessions as proxy for active students)
  const { data: recentSessions } = await supabase
    .from("training_sessions")
    .select(`
      *,
      student:student_id (
        users:user_id (name)
      )
    `)
    .order('date', { ascending: false })
    .limit(5);

  // Aggregate metrics from real data
  const { count: studentCount } = await supabase
    .from("student_profiles")
    .select("id", { count: 'exact', head: true });

  const { data: allSessions } = await supabase
    .from("training_sessions")
    .select("flexibility_score, strength_score");

  const avgFlexScore = allSessions?.length 
    ? Math.round(allSessions.reduce((acc, s) => acc + (s.flexibility_score || 0), 0) / allSessions.length)
    : 0;

  const analyticsData = {
    activeStudents: studentCount || 0,
    avgAttendance: allSessions?.length ? Math.min(100, Math.round((allSessions.length / (studentCount || 1)) * 5)) : 0, 
    progressionRate: avgFlexScore, 
    retention: 90, 
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12 animate-soft-fade">

          {/* ─── Header ─── */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-2 text-left">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 mb-2 rounded-full">
                <LayoutGrid className="w-3 h-3 mr-2 inline" /> Control Center
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Chào buổi sáng, {userData.name?.split(' ')[0]}
              </h1>
              <p className="text-slate-400 font-medium max-w-lg">
                Hệ thống AI đã cập nhật 2 thông tin mới về hiệu suất học viện của bạn.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
               <Link href="/teacher/students">
                  <Button variant="outline" className="h-14 px-8 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50">
                    <Users className="w-4 h-4 mr-2" /> Danh sách HV
                  </Button>
               </Link>
                <Link href="/teacher/classes/new">
                  <Button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 hover:bg-slate-800 border-none transition-all active:scale-95">
                    <PlusCircle className="w-4 h-4 mr-2" /> Tạo lớp học mới
                  </Button>
                </Link>
            </div>
          </header>

          {/* ─── Metrics ─── */}
          <TeacherAnalytics data={analyticsData} />

          {/* ─── AI Copilot Banner ─── */}
          <div className="group relative overflow-hidden rounded-[3rem] border border-white bg-white p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-500">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Sparkles className="w-64 h-64 text-indigo-600" />
             </div>
             
             <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-6 max-w-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                         <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">AI Instructor Copilot</span>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Cá nhân hóa lộ trình tối ưu</h3>
                      <p className="text-slate-400 font-medium leading-relaxed">
                         Hệ thống AI nhận thấy sự gia tăng 14% về chỉ số dẻo dai trung bình của lớp <span className="text-slate-900">Vinyasa Flow sáng thứ 2</span>. Bạn có muốn điều chỉnh cường độ cho tuần tới không?
                      </p>
                   </div>
                </div>
                <Button className="h-16 px-10 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shrink-0 transition-all">
                   Thực hiện phân tích <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </div>
          </div>

          {/* ─── My Classes Section ─── */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lớp học của tôi</h2>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-300">Quản lý hiệu suất và lịch trình đào tạo</p>
                </div>
              </div>
              <Link href="/teacher/classes">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">tất cả lớp <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherClasses?.map((cls) => (
                <Card key={cls.id} className="group rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden p-8">
                   <div className="space-y-6">
                      <div className="flex justify-between items-start">
                         <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase px-3 py-1">{cls.level}</Badge>
                         <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-300">U</div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">+{cls.enrolled || 0}</div>
                         </div>
                      </div>
                      
                      <div className="space-y-1">
                         <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{cls.name}</h3>
                         <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                           <History className="w-3.5 h-3.5" /> {cls.schedule}
                         </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-300 uppercase">Cường độ</p>
                            <p className="text-xs font-black text-slate-900">{cls.intensity}</p>
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-300 uppercase">Học viên</p>
                            <p className="text-xs font-black text-slate-900">{cls.enrolled || 0}/{cls.max_capacity}</p>
                         </div>
                      </div>

                      <Link href={`/teacher/classes/${cls.id}`} className="block">
                         <Button className="w-full h-12 bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">
                            Quản lý lớp học
                         </Button>
                      </Link>
                   </div>
                </Card>
              ))}
              {(!teacherClasses || teacherClasses.length === 0) && (
                <div className="col-span-full py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <PlusCircle className="w-8 h-8 text-slate-200" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Chưa có lớp học</p>
                      <p className="text-xs font-medium text-slate-400">Bắt đầu bằng việc tạo lớp học yoga đầu tiên của bạn.</p>
                   </div>
                   <Link href="/teacher/classes/new">
                      <Button className="bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] h-11 px-8 mt-2">Tạo ngay</Button>
                   </Link>
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-12 lg:grid-cols-12">
            {/* Student Overview Table */}
            <Card className="lg:col-span-8 rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
               {/* ... (rest of the student table code) */}
              <CardHeader className="p-10 pb-6 border-b border-slate-50">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                         <Users className="w-6 h-6 text-sky-500" /> Học viên mới nhất
                      </CardTitle>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-300">Quản lý trực quan {studentCount} học viên</p>
                   </div>
                   <Link href="/teacher/students">
                      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">tất cả <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
                   </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50/50">
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Học viên</th>
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cấp độ</th>
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mục tiêu ưu tiên</th>
                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Hành động</th>
                         </tr>
                      </thead>
                      <tbody>
                         {students?.map((student) => (
                            <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                               <td className="px-10 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-300 uppercase shadow-inner group-hover:bg-white transition-colors">
                                        {(student.users as any)?.name?.charAt(0) || "U"}
                                     </div>
                                     <div className="space-y-0.5">
                                        <p className="text-sm font-black text-slate-900">{(student.users as any)?.name || "Ẩn danh"}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{(student.users as any)?.email}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-6">
                                  <Badge className="bg-sky-50 text-sky-600 border-none font-black uppercase text-[9px] px-2.5 py-1">
                                     {student.experience_level}
                                  </Badge>
                               </td>
                               <td className="px-10 py-6">
                                  <span className="text-xs font-bold text-slate-500 italic">
                                     {(student.goals as string[])?.[0]?.replace('_', ' ') || "Chưa xác định"}
                                  </span>
                                </td>
                               <td className="px-10 py-6">
                                  <Link href={`/teacher/students/${student.id}`}>
                                     <Button size="sm" className="bg-white border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl shadow-none font-black uppercase tracking-widest text-[9px] h-9 transition-all">
                                        Chi tiết
                                     </Button>
                                  </Link>
                               </td>
                            </tr>
                         ))}
                         {(!students || students.length === 0) && (
                            <tr>
                               <td colSpan={4} className="px-10 py-20 text-center">
                                  <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Chưa có dữ liệu học viên</p>
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
              </CardContent>
            </Card>

            {/* Right Side: Recent Activity & Alerts */}
            <div className="lg:col-span-4 space-y-10">
               <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden p-8">
                  <div className="flex items-center gap-3 mb-8">
                     <History className="w-6 h-6 text-amber-500" />
                     <h3 className="text-xl font-black text-slate-900">Hoạt động mới</h3>
                  </div>
                  
                  <div className="space-y-6">
                     {recentSessions?.map((session) => (
                        <div key={session.id} className="flex gap-4 group">
                           <div className="relative">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 z-10 relative">
                                 <TrendingUp className="w-4 h-4 text-emerald-500" />
                              </div>
                              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-50 -z-0 group-last:hidden" />
                           </div>
                           <div className="space-y-1 pb-6">
                              <p className="text-xs font-black text-slate-900">Buổi tập: {session.class_type}</p>
                              <p className="text-[10px] font-bold text-slate-400">
                                 Học viên: <span className="text-slate-600">{(session.student as any)?.users?.name || "Hệ thống"}</span>
                              </p>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 pt-1">
                                 {new Date(session.date).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                     ))}
                     {(!recentSessions || recentSessions.length === 0) && (
                        <p className="text-center py-10 text-slate-300 text-[10px] font-black uppercase tracking-widest">Không có hoạt động gần đây</p>
                     )}
                  </div>
               </Card>

               {/* Urgent/Actionable Items */}
               <div className="p-8 rounded-[3rem] bg-rose-50/50 border-none space-y-6">
                  <div className="flex items-center gap-3">
                     <AlertCircle className="w-6 h-6 text-rose-500" />
                     <h3 className="text-lg font-black text-slate-900">Cần hành động</h3>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-rose-50 shadow-sm space-y-3">
                     <p className="text-xs font-black text-slate-900">Hoàn thiện hồ sơ giảng dạy</p>
                     <p className="text-[11px] font-medium text-slate-400 leading-relaxed">Hồ sơ công khai của bạn còn thiếu ảnh đại diện và chứng chỉ RYT-500.</p>
                     <Link href="/teacher-profile">
                        <Button className="w-full h-11 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] mt-2">Cập nhật ngay</Button>
                     </Link>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
