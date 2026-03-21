const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// must use service role key to alter constraints
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  // Drop old constraint and add new one with 'live' included
  const sql = `
    ALTER TABLE public.class_sessions DROP CONSTRAINT IF EXISTS class_sessions_status_check;
    ALTER TABLE public.class_sessions ADD CONSTRAINT class_sessions_status_check 
      CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled'));
  `;
  
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
    console.error("Migration failed via RPC:", error.message);
    console.log("\n--- PLEASE RUN THIS SQL MANUALLY IN SUPABASE SQL EDITOR ---");
    console.log(sql);
  } else {
    console.log("Migration success:", data);
  }
}

migrate();
