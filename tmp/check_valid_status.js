const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data: sessions } = await supabase.from('class_sessions').select('id, status').limit(1);
  if (!sessions || sessions.length === 0) return;
  const id = sessions[0].id;
  const old = sessions[0].status;

  const testValues = ['live', 'active', 'ongoing', 'in-progress', 'in_progress', 'Started', 'Live', 'running'];
  for (const v of testValues) {
    const { error } = await supabase.from('class_sessions').update({ status: v }).eq('id', id);
    if (!error) {
      console.log(`Working value: "${v}"`);
      await supabase.from('class_sessions').update({ status: old }).eq('id', id); // restore
      return;
    } else {
      console.log(`Value "${v}" failed: ${error.message}`);
    }
  }
}

check();
