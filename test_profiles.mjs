import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://allvebqiylkiexcezevi.supabase.co',
  'sb_publishable_y-SVewxDg9ki3ugRVHb-bA_nFrGTBFq'
);

async function test() {
  const { data, error } = await supabase
    .from('teacher_profiles')
    .select('*');
  console.log('Error:', JSON.stringify(error, null, 2));
  console.log('Data:', JSON.stringify(data, null, 2));
}

test();
