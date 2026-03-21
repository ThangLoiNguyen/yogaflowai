import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  const role = userData?.role || "student";

  if (role !== 'teacher') {
    return NextResponse.json({ error: "Chỉ giảng viên mới có quyền khởi tạo lớp học." }, { status: 403 });
  }

  const body = await req.json();
  const { title, level, intensity, price_per_session, duration_minutes, max_students, description } = body;

  if (!title || !level) {
    return NextResponse.json({ error: "Missing required fields (title, level)" }, { status: 400 });
  }

  // Insert Course
  const { data, error } = await supabase
    .from("courses")
    .insert({
      teacher_id: user.id,
      title,
      description: description || "",
      level,
      intensity: intensity || 3,
      price_per_session: price_per_session || 120000,
      max_students: max_students || 20
    })
    .select()
    .single();

  if (error) {
    console.error("Database Error creating course:", error);
    return NextResponse.json({ 
      error: `Lỗi cơ sở dữ liệu: ${error.message}`,
      details: error 
    }, { status: 500 });
  }

  return NextResponse.json({ success: true, course: data });
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      *,
      users!teacher_id (full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courses });
}
