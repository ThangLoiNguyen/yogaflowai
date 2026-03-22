const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/Workspace/yogaflow-ai/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  try {
    // 1. Get a teacher (the user probably)
    const { data: teachers } = await supabase.from('users').select('id, full_name').eq('role', 'teacher').limit(1);
    if (!teachers || teachers.length === 0) { console.log('No teacher found'); return; }
    const tid = teachers[0].id;
    console.log('Testing for teacher:', teachers[0].full_name, tid);

    // 2. Run the EXACT query from the messages page
    const { data, error } = await supabase
        .from("courses")
        .select(`id, title, class_sessions(id, bookings(student_id))`)
        .eq("teacher_id", tid);

    if (error) throw error;
    console.log('Query result:', JSON.stringify(data, null, 2));

    // 3. Check if bookings exist at all
    const { count, error: bErr } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    console.log('Total bookings in DB:', count, bErr);

  } catch (err) {
    console.error('DEBUG ERROR:', err);
  }
}

check();
