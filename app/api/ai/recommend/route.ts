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

    // Ensure the user record exists in public.users to avoid FK constraint error
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("id", student_id)
      .single();

    if (!userData) {
      const role = user.user_metadata?.role || "student";
      const full_name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Học viên";
      
      const { error: insertUserError } = await supabase
        .from("users")
        .insert({
          id: student_id,
          email: user.email,
          role: role,
          full_name: full_name
        });

      if (insertUserError) {
         console.error("Error creating missing user record:", insertUserError);
      }
    }


    // Insert or update the onboarding quiz
    const quizData: any = {
      student_id,
      age,
      gender,
      experience_level,
      health_issues,
      available_days,
      fitness_level,
      flexibility,
      goals,
      style,
      frequency,
      preferred_time,
      expectations,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("onboarding_quiz")
      .upsert(quizData, { onConflict: 'student_id' });

    if (error) {
      console.error("Supabase error saving quiz:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Onboarding completed!" });
  } catch (error) {
    console.error("Error in /api/ai/recommend:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
