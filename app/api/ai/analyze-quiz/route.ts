import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { session_id, answers } = await request.json();

    if (!session_id || !answers) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Fetch Session Info to get teacher_id
    const { data: session } = await supabase
      .from("classes") // In this mockup, 'classes' acts as the session tracker or we use training_sessions
      .select("teacher_id, title")
      .eq("id", session_id)
      .single();

    // 2. Save Quiz Answers
    const { data: quiz, error: quizError } = await supabase
      .from("session_quiz") 
      .insert({
        student_id: user.id,
        session_id,
        teacher_id: session?.teacher_id || null,
        mood: answers.mood,
        energy_level: answers.energy,
        pain_areas: answers.pain_areas,
        fatigue_score: parseInt(answers.fatigue || 0),
        improvements: answers.improvements,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (quizError) throw quizError;

    // 3. AI Logic (Mocked Analysis)
    let aiSuggestion = "";
    if (answers.pain_areas.length > 0) {
      aiSuggestion = `Học viên có tình trạng mỏi ${answers.pain_areas.join(", ")}. Hãy giảm cường độ các bài tập tác động trực tiếp lên vùng này trong buổi tới.`;
    } else if (answers.energy < 2) {
      aiSuggestion = `Năng lượng học viên thấp (${answers.energy}/5). Khuyến nghị chuyển sang các bài tập phục hồi sâu (Restorative) hoặc Yin Yoga.`;
    } else {
      aiSuggestion = `Học viên phản hồi tốt. Duy trì lộ trình hiện tại và có thể tăng nhẹ độ khó.`;
    }

    // 4. Save AI Suggestion for Teacher
    await supabase.from("ai_suggestions").insert({
      student_id: user.id,
      teacher_id: session?.teacher_id || null,
      related_quiz_id: quiz.id,
      suggestion_text: aiSuggestion,
      status: 'pending'
    });

    return NextResponse.json({ success: true, ai_insight: aiSuggestion });
  } catch (error: any) {
    console.error("Analyze Quiz Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
