import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  scheduled: ["live", "cancelled"],
  live: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, status } = await req.json();

  if (!sessionId || !status) {
    return NextResponse.json({ error: "Missing sessionId or status" }, { status: 400 });
  }

  // Fetch current session to validate transition
  const { data: session, error: fetchError } = await supabase
    .from("class_sessions")
    .select("status, teacher_id")
    .eq("id", sessionId)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Forbidden: not your session" }, { status: 403 });
  }

  const allowed = ALLOWED_TRANSITIONS[session.status] || [];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `Cannot transition from '${session.status}' to '${status}'. Allowed: [${allowed.join(", ")}]` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("class_sessions")
    .update({ status })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, session: data });
}
