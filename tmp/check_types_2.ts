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
    const row = data[0];
    if (!row) {
        console.log("No data");
        return;
    }
    console.log("Column Details:");
    for (const key of Object.keys(row)) {
        let val = row[key];
        let typeStr = typeof val;
        if (Array.isArray(val)) typeStr = "array";
        console.log(`${key} | ${typeStr} | ${val}`);
    }
  }
}

check();
