import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch Public User Data
  let { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userData) {
    // Attempt to create the user record if it's missing
    const role = user.user_metadata?.role || "student";
    const name = user.user_metadata?.name || user.email?.split("@")[0] || "Người dùng";

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: user.id,
        email: user.email,
        full_name: name,
        role: role,
        avatar_url: null
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to auto-create user record:", insertError);
      return NextResponse.json({ error: "User record not found and could not be created" }, { status: 404 });
    }
    userData = newUser;
  }

  // Fetch Role Specific Profile
  let profile = null;
  if (userData.role === "student") {
    const { data } = await supabase
      .from("onboarding_quiz")
      .select("*")
      .eq("student_id", user.id)
      .single();
    profile = data;
  } else if (userData.role === "teacher") {
    const { data } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      profile = {
        ...data,
        bio: data.teaching_style,
        specialties: data.specializations
      };
    }
  }

  return NextResponse.json({ user: userData, profile });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, avatar_url, profileData } = body;

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ error: "Họ và tên không được để trống." }, { status: 400 });
  }

  // 1. Update basic user data
  const { data: currentUserRecord } = await supabase
    .from("users")
    .select("role, email")
    .eq("id", user.id)
    .single();

  const role = currentUserRecord?.role || user.user_metadata?.role || "student";
  const email = currentUserRecord?.email || user.email;

  const { error: userError } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      full_name: name.trim(),
      avatar_url,
      email,
      role
    }, { onConflict: 'id' });

  if (userError) {
    console.error("User basic data update error:", userError);
    return NextResponse.json({ error: "Đồng bộ dữ liệu tài khoản thất bại." }, { status: 400 });
  }

  // 2. Update role-specific profile data
  // We re-fetch role to be certain
  const { data: userRoleData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userRoleData?.role === "student") {
    const {
      experience_level, goals, health_issues,
      available_days, fitness_level, expectations
    } = profileData;

    const studentUpdateData = {
      student_id: user.id,
      experience_level: experience_level === "beginner" ? 1 : experience_level === "intermediate" ? 2 : experience_level === "advanced" ? 3 : (parseInt(experience_level) || 1),
      goals: goals || [],
      health_issues: health_issues || "",
      available_days: available_days || [],
      fitness_level: fitness_level || 3,
      expectations: expectations || "",
      created_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from("onboarding_quiz")
      .upsert(studentUpdateData, { onConflict: 'student_id' });

    if (profileError) {
      console.error("Student profile update error detail:", profileError);
      return NextResponse.json({
        error: "Phân tích dữ liệu sức khỏe thất bại. Vui lòng thử lại sau."
      }, { status: 400 });
    }
  } else if (userRoleData?.role === "teacher") {
    const { bio, specialties, certifications, years_experience } = profileData;

    const teacherUpdateData = {
      user_id: user.id,
      teaching_style: bio || "",
      specializations: specialties || [],
      certifications: certifications || [],
      years_experience: years_experience ? parseInt(years_experience.toString()) : 0
    };

    if (isNaN(teacherUpdateData.years_experience)) teacherUpdateData.years_experience = 0;

    const { error: profileError } = await supabase
      .from("teacher_profiles")
      .upsert(teacherUpdateData, { onConflict: 'user_id' });

    if (profileError) {
      console.error("Teacher profile update error detail:", profileError);
      return NextResponse.json({
        error: "Đồng bộ thông tin giảng dạy thất bại. Vui lòng kiểm tra lại."
      }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true });
}
