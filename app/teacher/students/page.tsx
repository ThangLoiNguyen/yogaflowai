import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Users, 
  Search, 
  Filter, 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  MessageCircle,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function TeacherStudentsPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const searchQuery = searchParams.q || "";

  // 1. Fetch Students who joined sessions of this teacher
  // We join bookings -> class_sessions (teacher_id = user.id) -> students (users table)
  const { data: studentsData } = await supabase
    .from("bookings")
    .select(`
      student_id,
      users!student_id (
        id,
        full_name,
        avatar_url,
        streaks (current_streak),
        onboarding_quiz (health_issues)
      ),
      class_sessions!inner (
        title,
        teacher_id
      )
    `)
    .eq("class_sessions.teacher_id", user.id);

  // Group by student_id to get unique students
  const studentMap = new Map();
  studentsData?.forEach(b => {
    if (!studentMap.has(b.student_id)) {
      const u = b.users as any;
      studentMap.set(b.student_id, {
        id: b.student_id,
        name: u?.full_name || "Học viên",
        avatar: u?.avatar_url,
        streak: u?.streaks?.current_streak || 0,
        health: u?.onboarding_quiz?.health_issues ? [u.onboarding_quiz.health_issues] : [],
        lastClass: (b.class_sessions as any)?.title || "Yoga Session",
        classCount: 1, // Will update below
      });
    } else {
      studentMap.get(b.student_id).classCount += 1;
    }
  });

  // Fetch counts and AI advice
  // For simplicity, we just use the grouped data
  let STUDENTS = Array.from(studentMap.values());

  if (searchQuery) {
    STUDENTS = STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.health.some((h: string) => h.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-4 shadow-sm">
             <Users className="w-4 h-4 text-emerald-600" /> 
             <span className="font-mono text-[9px] tracking-widest text-[var(--text-hint)] uppercase">Danh sách học viên</span>
          </div>
          <h1 className="text-4xl text-[var(--text-primary)] font-display">Học viên của tôi</h1>
          <p className="text-[var(--text-secondary)] mt-2">Quản lý và thấu hiểu trạng thái của học viên qua AI insights.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-14 px-8 rounded-full border-emerald-200 text-emerald-700 bg-emerald-50/30">
              Xuất báo cáo (CSV)
           </Button>
           <Button className="btn-primary bg-emerald-600 hover:bg-emerald-700 h-14 px-8 rounded-full shadow-lg">
              Nhắn tin toàn thể
           </Button>
        </div>
      </header>

      {/* Search & Filter */}
      <form action="/teacher/students" method="GET" className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-hint)]" />
            <Input 
              name="q"
              placeholder="Tìm tên học viên, bệnh trạng..."
              className="h-14 pl-12 rounded-[var(--r-md)] border-[var(--border-medium)] focus:border-emerald-500"
              defaultValue={searchQuery}
            />
         </div>
         <Button type="submit" className="h-14 px-8 rounded-full bg-slate-900 text-white">Tìm kiếm</Button>
         <Button variant="outline" type="button" className="h-14 w-14 rounded-full border-[var(--border-medium)] p-0 flex items-center justify-center bg-white">
            <Filter className="w-5 h-5" />
         </Button>
      </form>

      {/* Students Table/Grid */}
      <div className="bg-white rounded-[var(--r-xl)] border border-[var(--border)] shadow-md overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50/50 border-b border-[var(--border)]">
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">Học viên</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">Thành tích</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest text-center">Health Alert</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">AI Suggestion</th>
                  <th className="px-8 py-6 text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-widest">Hành động</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
               {STUDENTS.length > 0 ? STUDENTS.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-white shadow-sm bg-emerald-100 text-emerald-600`}>
                              {student.name.charAt(0)}
                           </div>
                           <div>
                              <div className="font-bold text-[var(--text-primary)] mb-1 group-hover:text-emerald-700 transition-colors">{student.name}</div>
                              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> Lớp gần nhất: {student.lastClass}
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-8">
                           <div>
                              <div className="text-lg font-bold text-[var(--text-primary)] leading-none mb-1">{student.classCount}</div>
                              <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Số lớp</div>
                           </div>
                           <div>
                              <div className="text-lg font-bold text-orange-500 leading-none mb-1 flex items-center gap-1">
                                 <Flame className="w-4 h-4 fill-orange-500" /> {student.streak}
                              </div>
                              <div className="text-[10px] label-mono uppercase text-[var(--text-muted)]">Streak</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex justify-center flex-wrap gap-2">
                           {student.health.length > 0 && student.health[0] ? student.health.map((h: string) => (
                              <div key={h} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                 <AlertTriangle className="w-3 h-3" /> {h}
                              </div>
                           )) : (
                              <span className="text-[10px] label-mono text-[var(--text-hint)]">— Khỏe mạnh —</span>
                           )}
                        </div>
                     </td>
                     <td className="px-8 py-6 max-w-md">
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 text-[12px] text-emerald-800 leading-relaxed italic relative">
                           <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-emerald-500 bg-white rounded-full p-0.5 shadow-sm" />
                           {student.health.length > 0 && student.health[0] ? `Dựa trên tình trạng ${student.health[0]}, hãy điều chỉnh tư thế.` : "Học viên có sức khỏe tốt, có thể tập trung nâng cao cường độ."}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg">
                              <MessageCircle className="w-5 h-5" />
                           </Button>
                           <Link href={`/teacher/students/${student.id}`}>
                            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 text-slate-300 hover:text-emerald-600 rounded-lg">
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                           </Link>
                        </div>
                     </td>
                  </tr>
               )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-[var(--text-secondary)] italic">
                      Bạn chưa có học viên nào tham gia lớp.
                    </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
      
      {/* Quick Access Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="p-8 bg-slate-900 rounded-[var(--r-xl)] text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px]" />
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">AI Alerts Today</span>
               </div>
               <h4 className="text-xl mb-4 font-display italic">"Theo dõi sức khỏe của các học viên mới để đưa ra lộ trình tập phù hợp."</h4>
               <Link href="/teacher/ai-insights">
                 <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl mt-6">Xem tất cả Alerts</Button>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
