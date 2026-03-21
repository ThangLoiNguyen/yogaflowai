import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data } = await supabase.from('class_sessions').select('*').limit(1);
  console.log("Sessions Column names:", data.length > 0 ? Object.keys(data[0]) : "No data");
}

check();
