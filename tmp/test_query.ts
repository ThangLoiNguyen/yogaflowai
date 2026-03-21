@
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
async function run() {
  const { data, error } = await supabase.from("courses").select("*, users!teacher_id(full_name), reviews(rating)").limit(1).single();
  console.log({ error, data });
}
run();
@
