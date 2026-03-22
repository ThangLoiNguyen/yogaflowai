import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LiveRoom from "@/components/video/LiveRoom";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MessageSquare, PieChart, Users } from "lucide-react";
import EndSessionButton from "@/components/teacher/end-session-button";

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

  return (
    <div className="fixed inset-0 bg-black flex flex-col md:flex-row z-[100]">
      {/* Sidebar Controls */}
      <aside className="absolute top-0 left-0 right-0 z-50 md:static w-full md:w-72 border-b-0 md:border-b-0 md:border-r border-white/10 shrink-0 flex flex-col p-3 md:p-4 gap-3 md:gap-5 bg-gradient-to-b from-black/80 to-transparent md:bg-slate-950 pointer-events-none md:pointer-events-auto">
        <header className="flex items-center justify-between md:flex-col md:items-start md:gap-0 pointer-events-auto">
          <div className="flex flex-col gap-1 md:gap-4">
            <Link href="/teacher/classes" className="flex items-center gap-2 text-white/40 hover:text-white transition-all group">
               <ArrowLeft className="w-4 h-4 md:group-hover:-translate-x-1 transition-all" />
               <span className="font-mono text-[10px] uppercase tracking-widest hidden md:inline">Quay lại</span>
            </Link>
            <h1 className="text-white text-lg md:text-2xl font-display leading-tight truncate max-w-[200px] md:max-w-full">{sessionTitle}</h1>
          </div>
          <div className="flex gap-2">
             <span className="px-2 md:px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Live
             </span>
             <span className="px-2 md:px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
               {session.status?.toUpperCase() ?? "LIVE"}
             </span>
          </div>
        </header>

        <nav className="hidden md:flex flex-1 flex-col space-y-3">
           <Button className="w-full h-9 justify-start gap-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10">
              <Users className="w-4 h-4" /> <span className="text-sm">Học viên</span>
           </Button>
           <Button className="w-full h-9 justify-start gap-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10">
              <MessageSquare className="w-4 h-4" /> <span className="text-sm">Hộp chat</span>
           </Button>
           <Button className="w-full h-9 justify-start gap-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/20">
              <PieChart className="w-4 h-4" /> <span className="text-sm">AI Feedback Mode</span>
           </Button>
        </nav>

        {/* Desktop Footer Controls */}
        <footer className="hidden md:block">
           <EndSessionButton sessionId={sessionId} />
        </footer>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 bg-black overflow-hidden relative">
           <LiveRoom room={sessionId} username={user.user_metadata?.full_name || "Giảng viên"} mode="scale" />
        </div>
        {/* Mobile controls overlay over video */}
        <div className="absolute top-16 right-4 z-50 md:hidden pointer-events-auto">
           <EndSessionButton sessionId={sessionId} />
        </div>
      </main>
    </div>
  );
}
