import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { student_id, flexibility_score, strength_score, stress_level, attendance } =
    body;

  const { data, error } = await supabase.from("health_progress").insert({
    student_id,
    flexibility_score,
    strength_score,
    stress_level,
    attendance,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data });
}

