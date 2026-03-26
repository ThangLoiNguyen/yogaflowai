const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oyyosqomydqshuvbujox.supabase.co', 'process.env.SUPABASE_ANON_KEY');

async function test() {
  const { data, error } = await supabase.from('courses').select('id, title, status');
  console.log('Courses:', JSON.stringify(data, null, 2));
  if (error) console.error('Error:', error);
}
test();
