import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase
    .from("onboarding_quiz")
    .select("*")
    .limit(1);

  if (error) {
    console.error(error);
  } else {
    for (const key in data[0]) {
      console.log(`${key}: ${typeof data[0][key]} (${data[0][key]})`);
    }
  }
}

check();
