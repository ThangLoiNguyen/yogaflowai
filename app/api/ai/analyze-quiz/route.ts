import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a yoga teaching assistant AI. Analyze a student's post-session quiz
and their recent session history (last 5 sessions). Generate 2-4 specific,
actionable suggestions for their teacher.

Each suggestion must be a JSON object with:
- type: 'intensity' | 'pose_focus' | 'homework' | 'churn_risk' | 'injury_risk' | 'path_change'
- action: string (imperative, 1 sentence, specific — e.g. "Reduce session intensity by 20% next week")
- reason: string (1-2 sentences citing specific data — e.g. "Fatigue reported as 8/10 for 3 consecutive sessions, lower back pain mentioned twice")
- priority: 'urgent' | 'recommended' | 'optional'

Rules:
- 'urgent' only for injury risk or 2+ consecutive very bad sessions (fatigue ≥9 or motivation ≤1)
- Base suggestions on PATTERNS, not single data points
- Never suggest stopping practice — always suggest adjustment
- Write in Vietnamese
- Return only valid JSON object with a "suggestions" key containing the array
`;

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

    // 1. Fetch Session Info
    const { data: session } = await supabase
      .from("class_sessions")
      .select("teacher_id, course_id, title")
      .eq("id", session_id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Fetch Student Personal Data (Onboarding Context)
    const { data: onboarding } = await supabase
      .from("onboarding_quiz")
      .select("goals, experience_level, health_issues, fitness_level, expectations")
      .eq("student_id", user.id)
      .single();

    // 3. Fetch Recent History
    const { data: history } = await supabase
      .from("session_quiz")
      .select("fatigue_level, pain_areas, hardest_pose, improvement_noticed, motivation_level")
      .eq("student_id", user.id)
      .neq("session_id", session_id)
      .order("submitted_at", { ascending: false })
      .limit(5);

    // 4. Save/Update Quiz Answers (Avoid ON CONFLICT if constraint missing)
    const quizData = {
      student_id: user.id,
      session_id,
      fatigue_level: answers.fatigue_level ? parseInt(answers.fatigue_level.toString()) : 5,
      pain_areas: answers.pain_areas || [],
      hardest_pose: answers.hardest_pose || "",
      improvement_noticed: answers.improvement_noticed || "",
      motivation_level: answers.motivation_level ? parseInt(answers.motivation_level.toString()) : 3,
      focus_next: answers.focus_next || "",
      free_notes: answers.free_notes || "",
      submitted_at: new Date().toISOString()
    };

    // Check if session_quiz already exists manually
    const { data: existingQuiz } = await supabase
      .from("session_quiz")
      .select("id")
      .eq("student_id", user.id)
      .eq("session_id", session_id)
      .maybeSingle();

    let quiz;
    if (existingQuiz) {
      const { data: updatedQuiz, error: updateError } = await supabase
        .from("session_quiz")
        .update(quizData)
        .eq("id", existingQuiz.id)
        .select()
        .single();
      if (updateError) throw updateError;
      quiz = updatedQuiz;
    } else {
      const { data: insertedQuiz, error: insertError } = await supabase
        .from("session_quiz")
        .insert(quizData)
        .select()
        .single();
      if (insertError) throw insertError;
      quiz = insertedQuiz;
    }

    // 5. OpenAI Analysis with Fallback
    let suggestions = [];
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { 
            role: "user", 
            content: JSON.stringify({ 
              student_profile: onboarding || null,
              current_quiz: {
                fatigue_level: answers.fatigue_level,
                pain_areas: answers.pain_areas,
                hardest_pose: answers.hardest_pose,
                improvement_noticed: answers.improvement_noticed,
                motivation_level: answers.motivation_level,
                focus_next: answers.focus_next,
                free_notes: answers.free_notes
              }, 
              history 
            }) 
          }
        ]
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
      suggestions = aiResponse.suggestions || [];
    } catch (apiError: any) {
      console.warn("OpenAI API Error, using fallback:", apiError.message);
      // Fallback Mock Suggestions
      suggestions = [
        {
          type: 'intensity',
          action: "Duy trì cường độ hiệm tại hoặc giảm nhẹ nếu thấy mỏi.",
          reason: "Hệ thống đang bảo trì AI phân tích chuyên sâu, nhưng ghi nhận bạn hoàn thành tốt buổi học.",
          priority: 'recommended'
        }
      ];
    }

    // 6. Save/Update AI Suggestions for Teacher
    if (suggestions.length > 0) {
      await supabase
        .from("ai_suggestions")
        .delete()
        .match({ student_id: user.id, session_id: session_id });

      await supabase.from("ai_suggestions").insert({
        student_id: user.id,
        teacher_id: session?.teacher_id || null,
        session_id: session_id,
        quiz_id: quiz.id,
        suggestions: suggestions,
        teacher_decision: 'pending'
      });
    }

    // 7. Log/Update Progress
    const progressData = {
        student_id: user.id,
        course_id: session?.course_id || null,
        session_id: session_id,
        fatigue_level: parseInt(answers.fatigue_level?.toString() || "5"),
        mood: parseInt(answers.motivation_level?.toString() || "3"),
        ai_score: 0.8,
        logged_at: new Date().toISOString()
    };

    const { data: existingLog } = await supabase
      .from("progress_logs")
      .select("id")
      .eq("student_id", user.id)
      .eq("session_id", session_id)
      .maybeSingle();

    if (existingLog) {
      await supabase.from("progress_logs").update(progressData).eq("id", existingLog.id);
    } else {
      await supabase.from("progress_logs").insert(progressData);
    }

    // 8. Streak & Completion Logic
    try {
      // Mark session as completed
      await supabase
        .from("class_sessions")
        .update({ status: 'completed' })
        .eq("id", session_id);

      const today = new Date().toISOString().split('T')[0];
      const { data: sData } = await supabase
        .from("streaks")
        .select("*")
        .eq("student_id", user.id)
        .maybeSingle();

      if (!sData) {
        await supabase.from("streaks").insert({
          student_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_checkin_date: today
        });
      } else if (sData.last_checkin_date !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        
        const newStreak = (sData.last_checkin_date === yStr) ? (sData.current_streak + 1) : 1;
        await supabase.from("streaks").update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, sData.longest_streak || 0),
          last_checkin_date: today
        }).eq("student_id", user.id);
      }
    } catch (err) {
      console.error("Streak/Completion error:", err);
    }

    return NextResponse.json({ 
      success: true, 
      ai_insight: suggestions[0]?.action || "Dữ liệu đã được ghi nhận. GV sẽ sớm xem phản hồi của bạn." 
    });
  } catch (error: any) {
    console.error("Analyze Quiz Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
