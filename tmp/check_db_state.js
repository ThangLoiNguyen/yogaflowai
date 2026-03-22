const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/Workspace/yogaflow-ai/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  try {
    console.log('--- Checking chat_messages count ---');
    const { count, error: countErr } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true });
    if (countErr) throw countErr;
    console.log('Total messages:', count);

    console.log('--- Checking first 5 messages ---');
    const { data: msgs, error: msgErr } = await supabase.from('chat_messages').select('*, users(id, full_name)');
    if (msgErr) throw msgErr;
    console.log('Messages with users:', JSON.stringify(msgs, null, 2));

    console.log('--- Checking users count ---');
    const { count: userCount, error: userErr } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (userErr) throw userErr;
    console.log('Total users:', userCount);
  } catch (err) {
    console.error('CRITICAL ERROR:', err);
  }
}

check();
