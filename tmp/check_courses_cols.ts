import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase.from('courses').select('*').limit(1);
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Column names:", data.length > 0 ? Object.keys(data[0]) : "No data to check columns");
  }
}

check();
