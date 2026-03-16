import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify teacher role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "teacher") {
      return NextResponse.json({ error: "Only teachers can record sessions" }, { status: 403 });
    }

    const body = await request.json();
    const { student_id, class_type, duration, flexibility_score, strength_score, notes, date } = body;

    if (!student_id || !class_type || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("training_sessions")
      .insert([
        {
          student_id,
          class_type,
          duration,
          flexibility_score,
          strength_score,
          notes,
          date: date || new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
