create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null, -- Links to class_session_id
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

-- Drop existing policies if they exist so we can rerun safely
drop policy if exists "Users can read chat_messages" on public.chat_messages;
drop policy if exists "Users can insert chat_messages" on public.chat_messages;

-- Simple policies for messaging
create policy "Users can read chat_messages" on public.chat_messages for select using (true);
create policy "Users can insert chat_messages" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Enable Realtime for chat_messages table
alter publication supabase_realtime add table public.chat_messages;
