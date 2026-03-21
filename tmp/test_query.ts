import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const { data, error } = await supabase
    .from("courses")
    .select(`id,title,status,class_sessions(bookings(id))`)
    .limit(1);

  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS");
  }
}
test();
