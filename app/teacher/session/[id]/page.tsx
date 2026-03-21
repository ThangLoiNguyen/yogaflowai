import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LiveRoom from "@/components/video/LiveRoom";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MessageSquare, PieChart, Users, Settings } from "lucide-react";

export default async function TeacherSessionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sessionId = params.id;
  const { data: session } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) redirect("/teacher");

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar Controls */}
      <aside className="w-80 border-r border-white/10 shrink-0 flex flex-col p-8 gap-10 bg-slate-950">
        <header>
          <Link href="/teacher" className="flex items-center gap-2 text-white/40 hover:text-white transition-all group mb-4">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1" />
             <span className="font-mono text-[10px] uppercase tracking-widest">Dashboard</span>
          </Link>
          <h1 className="text-white text-3xl font-display leading-tight">{session.title}</h1>
          <div className="flex gap-2 mt-4">
             <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Live
             </span>
             <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-wider">01:24:12</span>
          </div>
        </header>

        <nav className="flex-1 space-y-4">
           <Button className="w-full h-14 justify-start gap-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10">
              <Users className="w-5 h-5" /> <span>Học viên (12)</span>
           </Button>
           <Button className="w-full h-14 justify-start gap-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10">
              <MessageSquare className="w-5 h-5" /> <span>Hộp chat</span>
           </Button>
           <Button className="w-full h-14 justify-start gap-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/20">
              <PieChart className="w-5 h-5" /> <span>AI Feedback Mode</span>
           </Button>
        </nav>

        <footer>
           <Button variant="ghost" className="w-full justify-start gap-4 text-white/20 hover:text-red-500 rounded-2xl h-14">
              <Settings className="w-5 h-5" /> <span>Cài đặt lớp</span>
           </Button>
        </footer>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 p-8 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-3xl">
           <LiveRoom room={sessionId} username={user.user_metadata?.full_name || "Teacher"} mode="scale" />
        </div>
        
        <div className="flex justify-center p-8 gap-4">
            <Button className="h-16 px-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-red flex items-center gap-3">
               Kết thúc buổi dạy
            </Button>
        </div>
      </main>
    </div>
  );
}
