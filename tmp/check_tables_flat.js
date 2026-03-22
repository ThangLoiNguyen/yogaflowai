const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/Workspace/yogaflow-ai/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  try {
    const { data: tables, error } = await supabase.rpc('pg_get_all_tables'); 
    // Wait, rpc might not exist. Let's try raw query if we have service_key, 
    // but I only have anon_key.
    
    // Let's try select from chat_messages without join.
    console.log('--- Checking chat_messages (flat) ---');
    const { data: msgs, error: msgErr } = await supabase.from('chat_messages').select('*').limit(5);
    if (msgErr) console.error('Flat Message error:', msgErr);
    else console.log('Flat messages:', JSON.stringify(msgs, null, 2));

    console.log('--- Checking user counts (flat) ---');
    const { count: uCount, error: uErr } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (uErr) console.error('User select error:', uErr);
    else console.log('User count:', uCount);

  } catch (err) {
    console.error('CRITICAL ERROR:', err);
  }
}

check();
