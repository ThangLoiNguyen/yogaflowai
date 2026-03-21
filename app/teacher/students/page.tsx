import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TeacherStudentList } from "@/components/teacher/teacher-student-list";
import { StudentSearchBar } from "@/components/teacher/student-search-bar";

export const dynamic = "force-dynamic";

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
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="txt-title mb-1 border-none italic">Học viên của tôi</h1>
          <p className="txt-content opacity-70">Chọn học viên để xem phân tích.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/messages">
            <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-accent transition-all shadow-lg txt-action">
              <MessageCircle className="w-4 h-4 mr-2" /> Nhắn tin toàn thể
            </Button>
          </Link>
        </div>
      </header>

      {/* Live Search Bar */}
      <StudentSearchBar defaultValue={searchQuery} />

      {/* Student List Area */}
      <div className="flex-1 overflow-hidden">
        <TeacherStudentList students={STUDENTS} />
      </div>

      {/* Removed AI Alert Today Card */}
    </div>
  );
}
