import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Phiên làm việc đã hết hạn. Vui lòng xác thực lại." }, { status: 401 });
  }

  const body = await request.json();
  const {
    age,
    gender,
    height,
    weight,
    experience_level,
    goals,
    injuries,
    available_days,
    available_time,
    preferred_intensity
  } = body;

  // 1. Ensure user exists in public.users (fallback for existing users)
  const { data: publicUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!publicUser) {
    const { error: userError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || "",
      role: "student"
    });
    if (userError) {
      console.error("Onboarding User Link Error:", userError);
      return NextResponse.json({ error: "Đồng bộ tài khoản hệ thống thất bại." }, { status: 400 });
    }
  }

  // 2. Now upsert the student profile
  const { error } = await supabase
    .from("student_profiles")
    .upsert({
      user_id: user.id,
      age: age && !isNaN(parseInt(age)) ? parseInt(age) : null,
      gender: gender || null,
      height: height && !isNaN(parseFloat(height)) ? parseFloat(height) : null,
      weight: weight && !isNaN(parseFloat(weight)) ? parseFloat(weight) : null,
      experience_level: experience_level || "beginner",
      goals: goals || [],
      injuries: injuries || [],
      schedule: {
        available_days: available_days || [],
        available_time: available_time || "",
        preferred_intensity: preferred_intensity || "Moderate"
      }
    });

  if (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Khởi tạo dữ liệu sinh trắc học thất bại." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
