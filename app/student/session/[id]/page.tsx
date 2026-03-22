import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LiveRoom from "@/components/video/LiveRoom";

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
    <div className="fixed inset-0 bg-slate-50 flex z-[100]">
      <main className="flex-1 flex overflow-hidden relative">
         <LiveRoom 
           room={sessionId} 
           username={user.user_metadata?.full_name || user.email || "Student"} 
           mode="embedded"
           onLeaveRedirect={`/student/session/${sessionId}/quiz`}
           sessionId={sessionId}
           sessionTitle={session.title}
         />
      </main>
    </div>
  );
}
