const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.rpc('get_table_definition', { table_name: 'class_sessions' });
  if (error) {
     // If RPC not exists, try finding it via query
     const { data: cols, error: err2 } = await supabase.from('class_sessions').select('*').limit(1);
     console.log("Cols:", Object.keys(cols[0] || {}));
  } else {
     console.log("Definition:", data);
  }
}

// Alternative: query pg_constraints if possible
async function checkConstraint() {
  const { data, error } = await supabase.rpc('execute_sql', { sql: `
    SELECT 
      conname as constraint_name, 
      pg_get_constraintdef(c.oid) as constraint_def
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE conrelid = 'class_sessions'::regclass;
  `});
  if (error) console.error("Error checking constraints:", error);
  else console.log("Constraints:", data);
}

checkConstraint();
