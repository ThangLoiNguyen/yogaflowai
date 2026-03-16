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
        name: name,
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
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
  } else if (userData.role === "teacher") {
    const { data } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = data;
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
      name: name.trim(),
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
    // Explicitly pick fields for student profile to avoid any hidden 'id' or other fields
    const {
      age, gender, height, weight,
      experience_level, goals, injuries,
      available_days, available_time, preferred_intensity
    } = profileData;

    const studentUpdateData = {
      user_id: user.id,
      age: age ? parseInt(age.toString()) : null,
      gender: gender || null,
      height: height ? parseFloat(height.toString()) : null,
      weight: weight ? parseFloat(weight.toString()) : null,
      experience_level: experience_level || "beginner",
      goals: goals || [],
      injuries: injuries || [],
      schedule: {
        available_days: available_days || [],
        available_time: available_time || "",
        preferred_intensity: preferred_intensity || "Moderate"
      }
    };

    // Sanitize numeric values
    if (isNaN(studentUpdateData.age as any)) studentUpdateData.age = null;
    if (isNaN(studentUpdateData.height as any)) studentUpdateData.height = null;
    if (isNaN(studentUpdateData.weight as any)) studentUpdateData.weight = null;

    const { error: profileError } = await supabase
      .from("student_profiles")
      .upsert(studentUpdateData, { onConflict: 'user_id' });

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
      bio: bio || "",
      specialties: specialties || [],
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
