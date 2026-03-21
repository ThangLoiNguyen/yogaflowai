import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkColumns() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log("Fetching courses table structure...");
  const { data, error } = await supabase.from('courses').select('*').limit(1);

  if (error) {
    console.error("Supabase Error selecting from courses:", error);
  } else {
    if (data && data.length > 0) {
      console.log("Columns found in row:", Object.keys(data[0]));
    } else {
       console.log("No data in courses, trying to get columns from empty select...");
       // Try an empty limit 0
       const { data: cols } = await supabase.from('courses').select().limit(0);
       console.log("Select success, but checking result...");
    }
  }
}

checkColumns();
