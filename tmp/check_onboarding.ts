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
    console.error("Error fetching onboarding_quiz:", error);
  } else {
    console.log("Onboarding Quiz Sample:", data[0]);
    console.log("Columns:", Object.keys(data[0] || {}));
  }
}

check();
