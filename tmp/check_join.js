const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/Workspace/yogaflow-ai/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  try {
    // Check if we can select from users with schema public
    const { data: u, error: uErr } = await supabase.from('users').select('id, full_name').limit(1);
    console.log('Select from users result:', u, uErr);

    // Try join again but very simple
    const { data: j, error: jErr } = await supabase.from('chat_messages').select('id, users!user_id(id)').limit(1);
    console.log('Simple join result:', j, jErr);

  } catch (err) {
    console.error('CRITICAL ERROR:', err);
  }
}

check();
