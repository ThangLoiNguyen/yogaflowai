-- Add missing columns to support advanced features (if they don't exist)
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS reply_to_id uuid references public.chat_messages(id) on delete set null,
ADD COLUMN IF NOT EXISTS reactions jsonb default '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_deleted bool default false,
ADD COLUMN IF NOT EXISTS attachment_url text,
ADD COLUMN IF NOT EXISTS attachment_type text;

-- Re-enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist so we can rerun safely
DROP POLICY IF EXISTS "Users can read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete chat_messages" ON public.chat_messages;

-- Create Policies for messaging features
CREATE POLICY "Users can read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update chat_messages" ON public.chat_messages FOR UPDATE USING (true); 
CREATE POLICY "Users can delete chat_messages" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime safely using a DO block instead of altering directly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;
