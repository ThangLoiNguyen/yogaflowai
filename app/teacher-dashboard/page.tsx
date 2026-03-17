import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TeacherAnalytics } from "@/components/teacher-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";
import { ProgressChart } from "@/components/progress-chart";
import {
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
  BookOpen,
  AlertCircle,
  PlusCircle,
  LayoutGrid,
  Activity,
  Zap,
  CheckCircle2,
  History
} from "lucide-react";
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

  // Fetch all students (limited for dashboard)
  const { data: students } = await supabase
    .from("student_profiles")
    .select(`
      *,
      users:user_id (name, email)
    `)
    .limit(5);

  // Fetch teacher's classes
  const { data: teacherClasses } = await supabase
    .from("classes")
    .select("*, teacher:teacher_id(name)")
    .eq("teacher_id", user.id)
    .order('created_at', { ascending: false });

  // Fetch recent training sessions
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

  const { count: classCount } = await supabase
    .from("classes")
    .select("id", { count: 'exact', head: true })
    .eq("teacher_id", user.id);

  const { data: allSessions } = await supabase
    .from("training_sessions")
    .select("flexibility_score, strength_score, date");

  const thisWeekSessions = allSessions?.filter(s => {
    const sessionDate = new Date(s.date);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return sessionDate > lastWeek;
  }) || [];

  const avgFlexScore = allSessions?.length
    ? Math.round(allSessions.reduce((acc, s) => acc + (s.flexibility_score || 0), 0) / allSessions.length)
    : 0;

  const analyticsData = {
    activeStudents: studentCount || 0,
    avgAttendance: thisWeekSessions.length, // Sessions this week
    progressionRate: avgFlexScore,
    retention: classCount || 0, // Classes Managed
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="teacher" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12 animate-soft-fade">

          {/* 1. Header */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-2 text-left">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 mb-2 rounded-full">
                <LayoutGrid className="w-3 h-3 mr-2 inline" /> Control Center
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Chào buổi sáng, {userData.name?.split(' ')[0]}
              </h1>
              <p className="text-slate-400 font-medium max-w-lg">
                Hệ thống AI đã cập nhật {thisWeekSessions.length} buổi tập mới trong tuần này.
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
                  <PlusCircle className="w-4 h-4 mr-2" /> Lớp học mới
                </Button>
              </Link>
            </div>
          </header>

          {/* 2. Metrics */}
          <TeacherAnalytics data={analyticsData} />

          {/* 3. Analytics & Activity */}
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Training Frequency Chart */}
            <Card className="lg:col-span-8 rounded-[3rem] border-none shadow-sm bg-white p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-500" /> Lưu lượng rèn luyện
                  </CardTitle>
                  <p className="text-xs font-bold text-slate-400">Số lượng buổi tập được ghi nhận (10 mốc gần nhất)</p>
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase px-3 py-1.5 rounded-xl">Theo thời gian</Badge>
              </div>
              <div className="h-[300px]">
                <ProgressChart
                  data={
                    allSessions?.reduce((acc: any[], session) => {
                      const date = new Date(session.date).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
                      const existing = acc.find(a => a.date === date);
                      if (existing) {
                        existing.count += 1;
                      } else {
                        acc.push({ date, count: 1, flexibility: 0, strength: 0 });
                      }
                      return acc;
                    }, []).slice(-10).map(d => ({ ...d, flexibility: d.count * 10, strength: d.count * 5 })) || []
                  }
                />
              </div>
            </Card>

            {/* Recent Activity Feed */}
            <Card className="lg:col-span-4 rounded-[3rem] border-none shadow-sm bg-indigo-900 text-white p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Activity className="w-32 h-32 rotate-12" />
              </div>
              <div className="relative z-10 space-y-8">
                <h3 className="text-lg font-black text-white flex items-center gap-3">
                  <Zap className="w-5 h-5 text-indigo-400" /> Hoạt động mới
                </h3>
                <div className="space-y-6">
                  {recentSessions?.map((session) => (
                    <div key={session.id} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-indigo-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold">
                          <span className="text-indigo-300 font-black">{(session.student as any)?.users?.name}</span> vừa hoàn thành <span className="font-black text-white">{session.class_type}</span>
                        </p>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{new Date(session.date).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  ))}
                  {(!recentSessions || recentSessions.length === 0) && (
                    <p className="text-xs font-medium text-indigo-300/60 italic">Chưa có hoạt động nào.</p>
                  )}
                </div>
                <Link href="/teacher/students">
                  <Button variant="link" className="text-white font-black text-[10px] uppercase p-0 h-auto tracking-[0.2em] opacity-60 hover:opacity-100">Quản lý học viên <ArrowRight className="w-3.5 h-3.5 ml-2" /></Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* 4. My Classes */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lớp học của tôi</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300">Quản lý các lớp yoga đang phụ trách</p>
                </div>
              </div>
              <Link href="/teacher/classes">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">xem tất cả <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherClasses?.map((cls) => (
                <Card key={cls.id} className="group rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase px-3 py-1">{cls.level}</Badge>
                      <div className="flex -space-x-2">
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
                    <p className="text-xs font-medium text-slate-400">Tạo lớp học yoga đầu tiên để bắt đầu giảng dạy.</p>
                  </div>
                  <Link href="/teacher/classes/new">
                    <Button className="bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] h-11 px-8 mt-2">Tạo ngay</Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* 5. Student Overview */}
          <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-10 pb-6 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-sky-500" /> Học viên tiêu biểu
                  </CardTitle>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300">Tổng số {studentCount} học viên trên hệ thống</p>
                </div>
                <Link href="/teacher/students">
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">tất cả học viên <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Học viên</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Trình độ</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mục tiêu mẫu</th>
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
                            {(student.goals as string[])?.[0]?.replace('_', ' ') || "Rèn luyện"}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <Link href={`/teacher/students/${student.id}`}>
                            <Button size="sm" className="bg-white border border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl shadow-none font-black uppercase tracking-widest text-[9px] h-9 transition-all">
                              Xem hồ sơ
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
