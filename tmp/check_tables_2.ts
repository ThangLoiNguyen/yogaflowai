import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase.rpc('get_table_names');
  if (error) {
    // If RPC fails, just try selecting from something
    console.log("Selecting from courses...");
    const { data: d1 } = await supabase.from('courses').select('id').limit(1);
    console.log("Courses exist:", !!d1);
    const { data: d2 } = await supabase.from('classes').select('id').limit(1);
    console.log("Classes exist:", !!d2);
  } else {
    console.log("Tables:", data);
  }
}

check();
