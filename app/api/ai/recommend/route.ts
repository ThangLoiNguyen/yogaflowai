import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { 
      goals, 
      experience_level, 
      health_issues, 
      available_days, 
      fitness_level, 
      expectations,
      age, gender, flexibility, style, frequency, preferred_time
    } = body;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student_id = user.id;

    // 1. Ensure user record exists
    const { data: userData } = await supabase.from("users").select("id").eq("id", student_id).single();
    if (!userData) {
      await supabase.from("users").insert({
        id: student_id,
        email: user.email,
        role: user.user_metadata?.role || "student",
        full_name: user.user_metadata?.full_name || "Học viên"
      });
    }

    // 2. Save onboarding quiz
    const { error: upsertError } = await supabase
      .from("onboarding_quiz")
      .upsert({
        student_id,
        age, gender, experience_level, health_issues, available_days,
        fitness_level, flexibility, goals, style, frequency, preferred_time, expectations,
        created_at: new Date().toISOString()
      }, { onConflict: 'student_id' });

    if (upsertError) {
      console.error("Upsert Error:", upsertError);
      throw upsertError;
    }

    // 3. AI RECOMMENDER LOGIC (Robust Weighted Match)
    const { data: courses } = await supabase
      .from("courses")
      .select("*, users!teacher_id(full_name)")
      .limit(30);

    if (!courses) return NextResponse.json({ success: true, recommended: [] });

    const scoredCourses = courses.map(course => {
      let score = 0;
      const courseTitle = String(course.title || "").toLowerCase();
      const courseDesc = String(course.description || "").toLowerCase();
      const courseLevel = String(course.level || "").toLowerCase();
      
      // Match goals
      if (Array.isArray(goals)) {
        goals.forEach(goal => {
          const g = String(goal || "").toLowerCase();
          if (courseTitle.includes(g)) score += 10;
          if (courseDesc.includes(g)) score += 5;
        });
      }

      // Match experience level
      const exp = String(experience_level || "").toLowerCase();
      if (exp === 'never' || exp === 'beginner') {
        if (courseLevel.includes('beginner') || courseLevel.includes('cơ bản') || courseLevel.includes('1')) score += 15;
      } else if (exp === 'intermediate' || exp.includes('month')) {
        if (courseLevel.includes('intermediate') || courseLevel.includes('trung cấp') || courseLevel.includes('2')) score += 15;
      } else if (exp === 'advanced' || exp.includes('year')) {
        if (courseLevel.includes('advanced') || courseLevel.includes('nâng cao') || courseLevel.includes('3')) score += 15;
      }

      // Match health context (health_issues is a string like "back_pain, stress")
      if (health_issues && (typeof health_issues === 'string')) {
         const issues = health_issues.toLowerCase();
         if (issues.includes("back_pain") && (courseTitle.includes("cột sống") || courseTitle.includes("lưng") || courseDesc.includes("lưng"))) score += 20;
         if (issues.includes("stress") && (courseTitle.includes("thư giãn") || courseTitle.includes("stress") || courseDesc.includes("thiền"))) score += 15;
         if (issues.includes("joint") && courseDesc.includes("khớp")) score += 15;
      }

      return { ...course, ai_score: score };
    });

    // Sort by score
    const recommended = scoredCourses
      .sort((a, b) => b.ai_score - a.ai_score)
      .slice(0, 3);

    return NextResponse.json({ 
      success: true, 
      recommended,
      message: "AI đã thiết kế xong lộ trình."
    });

  } catch (error: any) {
    console.error("Error in /api/ai/recommend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
