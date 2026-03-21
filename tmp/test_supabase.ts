import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function test() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const student_id = "7c60c4be-42a2-4383-8a0c-8e06abedce69"; // Dummy or real if known
  
  console.log("Testing onboarding_quiz upsert...");
  const { error } = await supabase
    .from("onboarding_quiz")
    .upsert({
      student_id,
      goals: ["flexibility"],
      experience_level: 1,
      health_issues: "none",
      fitness_level: 3,
      filled_at: new Date().toISOString()
    }, { onConflict: 'student_id' });

  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Success!");
  }
}

test();
