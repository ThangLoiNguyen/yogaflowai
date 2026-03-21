import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkColumns() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("Fetching table structure via selection...");
  const { data, error } = await supabase.from('onboarding_quiz').select('*').limit(1);

  if (error) {
    console.error("Supabase Error selecting from table:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Columns found in row:", Object.keys(data[0]));
    } else {
      console.log("No data found, trying to get columns from empty select...");
      // Try to insert a dummy and see what it says
      const { error: insErr } = await supabase.from('onboarding_quiz').insert({ student_id: '00000000-0000-0000-0000-000000000000' });
      console.error("Insert error (to see column info):", insErr);
    }
  }
}

checkColumns();
