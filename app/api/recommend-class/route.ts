import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { recommendClasses } from "@/lib/ai-recommendation";

export async function POST(req: Request) {
  const body = await req.json();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .limit(50);

  if (!courses) {
    return NextResponse.json({ courses: [] });
  }

  const recommended = await recommendClasses(
    {
      yoga_experience: body.yoga_experience ?? null,
      health_conditions: body.health_conditions ?? null,
      goals: body.goals ?? [],
    },
    courses as any
  );

  return NextResponse.json({ courses: recommended });
}
