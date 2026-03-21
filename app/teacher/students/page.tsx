import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  Search, 
  MessageCircle, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TeacherStudentList } from "@/components/teacher/teacher-student-list";

export default async function TeacherStudentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || "";

  // 1. Fetch Students who joined sessions of this teacher
  const { data: studentsData } = await supabase
    .from("bookings")
    .select(`
      student_id,
      users!student_id (
        id,
        full_name,
        avatar_url,
        email,
        created_at,
        streaks (current_streak),
        onboarding_quiz (*)
      ),
      class_sessions!inner (
        title,
        teacher_id
      )
    `)
    .eq("class_sessions.teacher_id", user.id);

  // Group by student_id
  const studentMap = new Map();
  studentsData?.forEach(b => {
    if (!studentMap.has(b.student_id)) {
      const u = b.users as any;
      studentMap.set(b.student_id, {
        id: b.student_id,
        name: u?.full_name || "Học viên",
        avatar: u?.avatar_url,
        email: u?.email,
        joinDate: u?.created_at,
        streak: u?.streaks?.length > 0 ? u.streaks[0].current_streak : 0,
        health: u?.onboarding_quiz?.health_issues ? u.onboarding_quiz.health_issues : null,
        goals: u?.onboarding_quiz?.goals || [],
        experience: u?.onboarding_quiz?.experience_level || 1,
        fitness: u?.onboarding_quiz?.fitness_level || 3,
        lastClass: (b.class_sessions as any)?.title || "Yoga Session",
        classCount: 1,
      });
    } else {
      studentMap.get(b.student_id).classCount += 1;
    }
  });

  let STUDENTS = Array.from(studentMap.values());

  if (searchQuery) {
    STUDENTS = STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.health && s.health.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="txt-title mb-1 border-none italic">Học viên của tôi</h1>
          <p className="txt-content opacity-70">Chọn học viên để xem phân tích AI (Insights).</p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/messages">
            <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-lg txt-action">
                <MessageCircle className="w-4 h-4 mr-2" /> Nhắn tin toàn thể
            </Button>
          </Link>
        </div>
      </header>

      {/* Search Bar - Premium Design */}
      <div className="shrink-0 max-w-2xl">
        <form action="/teacher/students" method="GET" className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-emerald-500 transition-colors">
            <Search className="w-5 h-5 text-slate-300" />
          </div>
          <input 
            name="q"
            type="text"
            placeholder="Tìm kiếm học viên theo tên hoặc tình trạng sức khỏe..."
            defaultValue={searchQuery}
            className="w-full h-12 pl-12 pr-28 rounded-[1.25rem] bg-white border-2 border-slate-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] focus:border-emerald-100 focus:bg-emerald-50/10 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all txt-content placeholder:text-slate-300"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
              Ctrl K
            </div>
            <Button 
              type="submit" 
              className="h-8 px-4 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-all shadow-md txt-action text-[11px] font-bold"
            >
              TÌM KIẾM
            </Button>
          </div>
        </form>
      </div>

      {/* Student List Area */}
      <div className="flex-1 overflow-hidden">
         <TeacherStudentList students={STUDENTS} />
      </div>

       {/* Removed AI Alert Today Card */}
    </div>
  );
}
