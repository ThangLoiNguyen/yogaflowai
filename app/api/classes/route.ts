import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  const role = userData?.role || user.user_metadata?.role;

  if (role !== 'teacher') {
    return NextResponse.json({ error: "Chỉ giảng viên mới có quyền khởi tạo lớp học." }, { status: 403 });
  }

  const { name, level, duration, intensity, focus, max_capacity, schedule } = await req.json();

  if (!name || !level || !duration || !intensity || !schedule) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("classes")
    .insert({
      name,
      teacher_id: user.id,
      level,
      duration,
      intensity,
      focus: focus || [],
      max_capacity: max_capacity || 20,
      schedule,
      enrolled: 0
    })
    .select()
    .single();

  if (error) {
    console.error("Database Error creating class:", error);
    return NextResponse.json({ 
      error: `Lỗi cơ sở dữ liệu: ${error.message}`,
      details: error 
    }, { status: 500 });
  }

  return NextResponse.json({ success: true, class: data });
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: classes, error } = await supabase
    .from("classes")
    .select(`
      *,
      teacher:teacher_id (name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ classes });
}
