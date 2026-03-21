const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('class_sessions').select('*').limit(1);
  if (data && data.length > 0) {
     console.log("Sample Data Fields:", Object.keys(data[0]));
     console.log("Sample Data:", data[0]);
  } else {
     console.log("No data in class_sessions");
  }
}

// Check other tables status if possible
async function checkTableList() {
    const { data, error } = await supabase.rpc('get_table_names');
    console.log("Tables:", data);
}

check();
