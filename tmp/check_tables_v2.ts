import { createClient } from "@supabase/supabase-js";

async function checkSchema() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log("== Table: ai_suggestions ==");
  const { data: suggCols, error: err1 } = await supabase.rpc('get_table_columns', { table_name: 'ai_suggestions' });
  if (err1) {
    // If RPC doesn't exist, just select one row
    const { data: row } = await supabase.from('ai_suggestions').select('*').limit(1);
    console.log("Sample keys:", row && row[0] ? Object.keys(row[0]) : "Empty table");
  } else {
    console.log("Columns:", suggCols);
  }

  console.log("\n== Table: onboarding_quiz ==");
  const { data: quizRow } = await supabase.from('onboarding_quiz').select('*').limit(1);
  console.log("Sample keys:", quizRow && quizRow[0] ? Object.keys(quizRow[0]) : "Empty table");
}

checkSchema();
