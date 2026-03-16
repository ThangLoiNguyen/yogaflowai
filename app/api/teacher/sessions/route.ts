import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Yêu cầu xác thực tài khoản giáo viên." }, { status: 401 });
  }

  // Improved security: Check if user has teacher role
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'teacher') {
    return NextResponse.json({ error: "Quyền truy cập bị từ chối bởi giao thức bảo mật." }, { status: 403 });
  }

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
      teacher_id: user.id,
      date: new Date(date).toISOString(),
      class_type,
      flexibility_score: parseInt(flexibility_score) || 0,
      strength_score: parseInt(strength_score) || 0,
      notes,
    });

  if (error) {
    console.error("Session Insert Error:", error);
    return NextResponse.json({ error: "Lưu báo cáo buổi tập thất bại. Hệ thống đang bận." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
