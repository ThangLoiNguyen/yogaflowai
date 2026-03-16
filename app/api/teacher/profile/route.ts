import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    bio,
    specialties,
    certifications,
    years_experience
  } = body;

  // 1. Ensure user exists in public.users and is a teacher
  const { data: publicUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!publicUser || publicUser.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can update this profile" }, { status: 403 });
  }

  // 2. Upsert the teacher profile
  const { error } = await supabase
    .from("teacher_profiles")
    .upsert({
      user_id: user.id,
      bio,
      specialties,
      certifications,
      years_experience: years_experience && !isNaN(parseInt(years_experience)) ? parseInt(years_experience) : 0,
    }, { onConflict: 'user_id' });

  if (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
     return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data || null });
}
