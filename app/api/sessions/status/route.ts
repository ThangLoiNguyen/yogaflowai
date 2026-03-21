import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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

  const { data, error } = await supabase
    .from("class_sessions")
    .update({ status })
    .eq("id", sessionId)
    .eq("teacher_id", user.id) // Security: only the teacher can change their session status
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, session: data });
}
