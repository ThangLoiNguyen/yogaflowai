import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { class_id } = await req.json();

  if (!class_id) {
    return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
  }

  // Get student profile ID
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  // Check if already registered
  const { data: existing } = await supabase
    .from("class_registrations")
    .select("id")
    .eq("student_id", profile.id)
    .eq("class_id", class_id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already registered for this class" }, { status: 400 });
  }

  // Register
  const { error } = await supabase
    .from("class_registrations")
    .insert({
      student_id: profile.id,
      class_id: class_id,
      registration_date: new Date().toISOString()
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Increment enrolled count in classes table manually
  const { data: classData } = await supabase
    .from("classes")
    .select("enrolled")
    .eq("id", class_id)
    .single();

  if (classData) {
    await supabase
      .from("classes")
      .update({ enrolled: (classData.enrolled || 0) + 1 })
      .eq("id", class_id);
  }

  return NextResponse.json({ success: true });
}
