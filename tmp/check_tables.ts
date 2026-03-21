
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const tables = ['onboarding_quiz', 'ai_suggestions', 'session_quiz', 'courses', 'class_sessions'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table ${table} does NOT exist or error:`, error.message);
    } else {
      console.log(`Table ${table} EXISTS.`);
    }
  }
}

checkTables();
