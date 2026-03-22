
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function check() {
  console.log('--- Checking chat_messages count ---')
  const { count, error: countErr } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true })
  console.log('Total messages:', count, countErr)

  console.log('--- Checking first 5 messages ---')
  const { data: msgs, error: msgErr } = await supabase.from('chat_messages').select('*, users(id, full_name)')
  console.log('Messages with users:', JSON.stringify(msgs, null, 2))
  if (msgErr) console.error('Message fetch error:', msgErr)

  console.log('--- Checking users count ---')
  const { count: userCount, error: userErr } = await supabase.from('users').select('*', { count: 'exact', head: true })
  console.log('Total users:', userCount, userErr)
}

check()
