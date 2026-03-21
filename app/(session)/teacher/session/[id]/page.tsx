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
    <div className="fixed inset-0 bg-slate-900 flex z-[100]">
      {/* Sidebar Controls */}
      <aside className="w-72 border-r border-white/10 shrink-0 flex flex-col p-6 gap-8 bg-slate-950">
        <header>
          <Link href="/teacher/classes" className="flex items-center gap-2 text-white/40 hover:text-white transition-all group mb-4">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
             <span className="font-mono text-[10px] uppercase tracking-widest">Quay lại</span>
          </Link>
          <h1 className="text-white text-2xl font-display leading-tight">{sessionTitle}</h1>
          <div className="flex gap-2 mt-3">
             <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Live
             </span>
             <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
               {session.status?.toUpperCase() ?? "LIVE"}
             </span>
          </div>
        </header>

        <nav className="flex-1 space-y-3">
           <Button className="w-full h-12 justify-start gap-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10">
              <Users className="w-4 h-4" /> <span className="text-sm">Học viên</span>
           </Button>
           <Button className="w-full h-12 justify-start gap-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10">
              <MessageSquare className="w-4 h-4" /> <span className="text-sm">Hộp chat</span>
           </Button>
           <Button className="w-full h-12 justify-start gap-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/20">
              <PieChart className="w-4 h-4" /> <span className="text-sm">AI Feedback Mode</span>
           </Button>
        </nav>

        <footer>
           <EndSessionButton sessionId={sessionId} />
        </footer>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 bg-black overflow-hidden">
           <LiveRoom room={sessionId} username={user.user_metadata?.full_name || "Giảng viên"} mode="scale" />
        </div>
      </main>
    </div>
  );
}
