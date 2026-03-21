import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkColumns() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("Fetching session_quiz structure...");
  const { data, error } = await supabase.from('session_quiz').select('*').limit(1);

  if (error) {
    console.error("Supabase Error selecting from session_quiz:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Columns found in row:", Object.keys(data[0]));
    } else {
       console.log("No data in session_quiz, trying to inspect metadata...");
    }
  }
}

checkColumns();
