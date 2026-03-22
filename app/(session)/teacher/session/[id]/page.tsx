import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EndSessionButton from "@/components/teacher/end-session-button";
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

      {/* ── LEFT SIDEBAR (desktop only) ── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-slate-950 border-r border-white/10">
        {/* Header */}
        <div className="p-5 border-b border-white/10 space-y-3">
          <Link
            href="/teacher/classes"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-all group w-fit text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Quay lại quản lý
          </Link>
          <h1 className="text-white font-bold text-base leading-snug">{sessionTitle}</h1>
          {/* LIVE badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/80 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Live
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* End session at the bottom */}
        <div className="p-4 border-t border-white/10">
          <EndSessionButton sessionId={sessionId} />
        </div>
      </aside>

      {/* ── MOBILE: top overlay controls ── */}
      <header className="md:hidden absolute top-0 left-0 right-0 z-50 pointer-events-none bg-gradient-to-b from-black/85 via-black/50 to-transparent p-3">
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex flex-col gap-1">
            <Link href="/teacher/classes" className="flex items-center gap-1.5 text-white/60 hover:text-white transition text-xs w-fit">
              <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
            </Link>
            <h1 className="text-white font-bold text-base leading-tight truncate max-w-[200px]">{sessionTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/80 text-white text-[9px] font-bold uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live
            </span>
            <EndSessionButton sessionId={sessionId} variant="compact" />
          </div>
        </div>
      </header>

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
