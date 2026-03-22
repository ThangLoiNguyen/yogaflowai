import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LiveRoom from "@/components/video/LiveRoom";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MessageCircle, HelpCircle } from "lucide-react";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id: sessionId } = await params;
  const { data: session } = await supabase
    .from("class_sessions")
    .select(`
      *,
      users!teacher_id (full_name)
    `)
    .eq("id", sessionId)
    .single();

  if (!session) redirect("/student");

  return (
    <div className="fixed inset-0 bg-black flex flex-col md:bg-slate-950 z-[100]">
      {/* HUD Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-3 md:p-4 flex items-center justify-between border-b border-white/10 md:static md:shrink-0 bg-gradient-to-b from-black/80 to-transparent md:bg-transparent pointer-events-none">
        <Link href="/student" className="pointer-events-auto flex items-center gap-2 text-white/60 hover:text-white transition-all group shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="font-medium hidden md:inline">Quay lại</span>
        </Link>
        <div className="text-center px-2 flex-1 overflow-hidden">
          <h1 className="text-white text-base md:text-xl font-display truncate w-full">{session.title}</h1>
          <p className="text-white/40 text-[8px] md:text-[10px] label-mono uppercase tracking-[0.2em] truncate w-full">Live Session (Embedded Mode)</p>
        </div>
        <div className="flex gap-2 md:gap-3 shrink-0 pointer-events-auto">
          <Button variant="outline" className="h-8 w-8 md:h-9 md:w-9 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 p-0">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button variant="outline" className="h-8 w-8 md:h-9 md:w-9 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 p-0">
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </header>

      {/* Main Video View */}
      <main className="flex-1 p-0 md:p-4 flex flex-col items-center justify-center max-w-7xl mx-auto w-full relative">
        <div className="w-full h-full md:h-auto md:bg-slate-900 md:rounded-[32px] overflow-hidden border-0 md:border md:border-white/5 shadow-none md:shadow-2xl relative md:aspect-video flex flex-col">
           <LiveRoom 
             room={sessionId} 
             username={user.user_metadata?.full_name || user.email || "Student"} 
             mode="embedded"
             onLeaveRedirect={`/student/session/${sessionId}/quiz`}
           />
           
           {/* Overlay Info */}
           <div className="pointer-events-none absolute top-20 md:top-6 left-4 md:left-6 flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/5 z-40">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center ring-2 ring-emerald-500/30">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div>
                 <div className="text-[10px] label-mono text-white/50 uppercase tracking-widest">Giáo viên</div>
                 <div className="text-sm font-bold text-white">{(session.users as any)?.full_name || "Linh Yoga"}</div>
              </div>
           </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="absolute bottom-0 left-0 right-0 z-50 p-4 pb-8 md:static md:p-10 border-t border-white/10 flex justify-center gap-4 shrink-0 bg-gradient-to-t from-black/80 to-transparent md:bg-slate-950 pointer-events-none">
        <Link href={`/student/session/${sessionId}/quiz`} className="w-full md:w-auto pointer-events-auto">
          <Button className="w-full h-12 md:h-10 md:px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base md:text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="md:hidden">Hoàn tất buổi tập</span>
            <span className="hidden md:inline">Hoàn tất buổi tập & Nhận Feedback Loop</span>
          </Button>
        </Link>
      </footer>
    </div>
  );
}
