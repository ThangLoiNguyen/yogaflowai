import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { computeTrend } from "@/lib/health-score";

export async function GET() {
  const [{ data: students }, { data: health }] = await Promise.all([
    supabase.from("users").select("id, role").eq("role", "student"),
    supabase
      .from("health_progress")
      .select("*")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const snapshots = (health ?? []).map((h: any) => ({
    flexibility_score: h.flexibility_score,
    strength_score: h.strength_score,
    stress_level: h.stress_level,
    attendance: h.attendance,
    created_at: h.created_at,
  }));

  const { flexibilityDelta, stressDelta } = computeTrend(snapshots);

  return NextResponse.json({
    activeStudents: students?.length ?? 0,
    flexibilityDelta,
    stressDelta,
  });
}

