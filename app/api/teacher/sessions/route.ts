import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: Check if user has teacher role
  // const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  // if (userData?.role !== 'teacher') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const {
    student_id,
    date,
    class_type,
    flexibility_score,
    strength_score,
    notes,
  } = body;

  const { error } = await supabase
    .from("training_sessions")
    .insert({
      student_id,
      teacher_id: user.id, // Current teacher
      date: new Date(date).toISOString(),
      class_type,
      flexibility_score: parseInt(flexibility_score),
      strength_score: parseInt(strength_score),
      notes,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
