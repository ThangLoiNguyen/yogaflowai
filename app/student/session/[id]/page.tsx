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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* HUD Header */}
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <Link href="/student" className="flex items-center gap-2 text-white/60 hover:text-white transition-all group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Quay lại</span>
        </Link>
        <div className="text-center">
          <h1 className="text-white text-xl font-display">{session.title}</h1>
          <p className="text-white/40 text-[10px] label-mono uppercase tracking-[0.2em]">Live Session (Embedded Mode)</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="h-12 w-12 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Video View */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        <div className="w-full bg-slate-900 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative aspect-video">
           <LiveRoom 
             room={sessionId} 
             username={user.user_metadata?.full_name || user.email || "Student"} 
             mode="embedded"
             onLeaveRedirect={`/student/session/${sessionId}/quiz`}
           />
           
           {/* Overlay Info */}
           <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/5">
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
      <footer className="p-10 border-t border-white/10 flex justify-center gap-6">
        <Link href={`/student/session/${sessionId}/quiz`}>
          <Button className="h-14 px-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Hoàn tất buổi tập & Nhận Feedback Loop
          </Button>
        </Link>
      </footer>
    </div>
  );
}
