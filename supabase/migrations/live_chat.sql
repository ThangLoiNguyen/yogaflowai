-- Run this in Supabase SQL Editor
-- Table for live session chat (persisted, survives refresh)
create table if not exists live_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references class_sessions(id) on delete cascade,
  sender text not null,
  content text not null,
  sent_at timestamptz not null default now()
);

-- Index for fast per-session queries
create index if not exists idx_live_chat_session_id on live_chat_messages(session_id);

-- Enable RLS
alter table live_chat_messages enable row level security;

-- Allow anyone authenticated to read/write their own session's chat
create policy "Allow authenticated read" on live_chat_messages
  for select using (auth.role() = 'authenticated');

create policy "Allow authenticated insert" on live_chat_messages
  for insert with check (auth.role() = 'authenticated');

-- Enable realtime
alter publication supabase_realtime add table live_chat_messages;
