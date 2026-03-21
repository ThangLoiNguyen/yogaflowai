create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null, -- Links to class_session_id
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  reply_to_id uuid references public.chat_messages(id) on delete set null,
  reactions jsonb default '{}'::jsonb, -- Format: {"👍": ["user_id_1"], "❤️": ["user_id_2"]}
  is_deleted bool default false,
  attachment_url text,
  attachment_type text, -- 'image', 'file', etc.
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

-- Drop existing policies if they exist so we can rerun safely
drop policy if exists "Users can read chat_messages" on public.chat_messages;
drop policy if exists "Users can insert chat_messages" on public.chat_messages;
drop policy if exists "Users can update chat_messages" on public.chat_messages;

-- Policies for messaging
create policy "Users can read chat_messages" on public.chat_messages for select using (true);
create policy "Users can insert chat_messages" on public.chat_messages for insert with check (auth.uid() = user_id);
create policy "Users can update chat_messages" on public.chat_messages for update using (true); -- Allow anyone to react, but app logic restricts content editing

-- Enable Realtime for chat_messages table (handles UPDATEs as well now)
alter publication supabase_realtime add table public.chat_messages;
