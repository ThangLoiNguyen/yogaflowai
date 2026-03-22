import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TeacherLiveRoom from "@/components/video/TeacherLiveRoom";

export default async function TeacherSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id: sessionId } = await params;
  const { data: session, error } = await supabase
    .from("class_sessions")
    .select("*, courses(title)")
    .eq("id", sessionId)
    .single();

  if (error && error.code === "PGRST116") redirect("/teacher");
  if (!session) redirect("/teacher");

  const sessionTitle = session.title || (session.courses as any)?.title || "Buổi học";
  const teacherName = user.user_metadata?.full_name || "Giảng viên";

  return (
    <div className="fixed inset-0 bg-black flex z-[100]">

      {/* ── MAIN: Video + Right Panel ── */}
      <main className="flex-1 flex overflow-hidden relative">
        <TeacherLiveRoom
          room={sessionId}
          username={teacherName}
          sessionId={sessionId}
        />
      </main>
    </div>
  );
}
