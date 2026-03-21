import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase.rpc('get_indexes', { table_name: 'bookings' });
  // If RPC is not available, we try to select unique columns
  const { data: cols, error: err2 } = await supabase.from('bookings').select('*').limit(1);
  console.log("Cols:", Object.keys(cols[0] || {}));
}

check();
