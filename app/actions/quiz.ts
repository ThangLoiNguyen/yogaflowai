"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function submitSessionQuiz(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const sessionId = formData.get("sessionId") as string;
  const fatigue_level = parseInt(formData.get("difficulty") as string);
  const motivation_level = parseInt(formData.get("satisfaction") as string);
  const free_notes = formData.get("notes") as string;

  if (!sessionId) throw new Error("Missing sessionId");

  const { error } = await supabase.from("session_quiz").insert({
    student_id: user.id,
    session_id: sessionId,
    fatigue_level,
    motivation_level,
    free_notes,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Quiz submission error:", error);
    throw new Error("Failed to submit quiz");
  }

  // Redirect to student dashboard
  redirect("/student");
}
