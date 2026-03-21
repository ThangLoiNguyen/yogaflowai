import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, title } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // 1. Fetch all sessions for this course
    const { data: sessions, error: sessionError } = await supabase
      .from("class_sessions")
      .select("id")
      .eq("course_id", courseId);

    if (sessionError) {
      console.error("Session fetch error:", sessionError);
      return NextResponse.json({ error: "Không tìm thấy buổi học nào cho khoá này." }, { status: 404 });
    }

    if (!sessions || sessions.length === 0) {
      // Create a default session if no sessions exist, but better just alert
      return NextResponse.json({ error: "Khoá học này chưa có buổi học nào được lên lịch." }, { status: 400 });
    }

    // 2. Filter out already booked sessions for this user
    const sessionIds = sessions.map(s => s.id);
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("session_id")
      .eq("student_id", user.id)
      .in("session_id", sessionIds);

    const alreadyBookedIds = new Set(existingBookings?.map(b => b.session_id) || []);
    const newSessionsToBook = sessions.filter(s => !alreadyBookedIds.has(s.id));

    if (newSessionsToBook.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Bạn đã đăng ký toàn bộ buổi học của khoá này.",
        url: "/student" 
      });
    }

    // 3. Create bookings for NEW sessions
    const bookingsToInsert = newSessionsToBook.map(s => ({
      student_id: user.id,
      session_id: s.id,
      status: "booked"
    }));

    const { error: bookingError } = await supabase
      .from("bookings")
      .insert(bookingsToInsert);

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return NextResponse.json({ error: "Không thể đăng ký lớp học. Vui lòng thử lại sau." }, { status: 500 });
    }

    // 4. Return success URL
    return NextResponse.json({ 
      success: true, 
      url: `/student?success=true&course=${encodeURIComponent(title || "Yoga")}` 
    });
  } catch (error: any) {
    console.error("Auto-Enroll Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
