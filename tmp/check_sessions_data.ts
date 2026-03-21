import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase.from('class_sessions').select('*').limit(1);
  if (data && data.length > 0) {
     console.log("Sample Data:", data[0]);
  } else {
     console.log("No data in class_sessions");
  }
}

check();
