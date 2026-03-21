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
      console.log("Columns found:", JSON.stringify(Object.keys(data[0]), null, 2));
    } else {
       console.log("No data in courses, checking metadata...");
    }
  }
}

checkColumns();
