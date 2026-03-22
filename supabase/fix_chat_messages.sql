/*
  Final Fix for Chat and Users RLS
  Ensures all tables, columns, and FOREIGN KEYS are correctly set.
*/

-- 1. Ensure chat_messages table exists with all columns
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Add columns individually if they don't exist (safety for existing tables)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='channel_id') THEN
        ALTER TABLE public.chat_messages ADD COLUMN channel_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='user_id') THEN
        ALTER TABLE public.chat_messages ADD COLUMN user_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='content') THEN
        ALTER TABLE public.chat_messages ADD COLUMN content TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='attachment_url') THEN
        ALTER TABLE public.chat_messages ADD COLUMN attachment_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='attachment_type') THEN
        ALTER TABLE public.chat_messages ADD COLUMN attachment_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='reply_to_id') THEN
        ALTER TABLE public.chat_messages ADD COLUMN reply_to_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='reactions') THEN
        ALTER TABLE public.chat_messages ADD COLUMN reactions JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='is_deleted') THEN
        ALTER TABLE public.chat_messages ADD COLUMN is_deleted BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='created_at') THEN
        ALTER TABLE public.chat_messages ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 2. ENFORCING FOREIGN KEYS (Crucial for joins like .select('*, users(...)'))
-- CLEANUP: Delete orphaned messages that point to non-existent users or courses
DELETE FROM public.chat_messages WHERE user_id NOT IN (SELECT id FROM public.users);
DELETE FROM public.chat_messages WHERE channel_id NOT IN (SELECT id FROM public.courses);

DO $$ 
BEGIN 
    -- User FK
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='chat_messages_user_id_fkey') THEN
        ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
    -- Course/Channel FK
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='chat_messages_channel_id_fkey') THEN
        ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.courses(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Chat Messages Policies
DROP POLICY IF EXISTS "Anyone can read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can read chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Chat messages are public" ON public.chat_messages;

CREATE POLICY "Anyone can read chat_messages" 
    ON public.chat_messages FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users can insert their messages" ON public.chat_messages;
CREATE POLICY "Users can insert their messages" 
    ON public.chat_messages FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own messages" ON public.chat_messages;
CREATE POLICY "Users can update their own messages" 
    ON public.chat_messages FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can update reactions" ON public.chat_messages;
CREATE POLICY "Anyone can update reactions" 
    ON public.chat_messages FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Users can read all basic user info" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record." ON public.users;
DROP POLICY IF EXISTS "Public can view users" ON public.users;

CREATE POLICY "Users can read all basic user info" 
    ON public.users FOR SELECT 
    USING (true);

-- 6. Bookings RLS Fix (CRITICAL: Allow teachers to see who booked their sessions)
DROP POLICY IF EXISTS "Teachers can view bookings for their sessions" ON public.bookings;
CREATE POLICY "Teachers can view bookings for their sessions" 
    ON public.bookings FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.class_sessions 
        WHERE public.class_sessions.id = public.bookings.session_id 
        AND public.class_sessions.teacher_id = auth.uid()
      )
    );

-- 7. Sync Users Check (Ensures profiles exist for names/avatars to show)
INSERT INTO public.users (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), COALESCE(raw_user_meta_data->>'role', 'student')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 8. Enable Realtime
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages') THEN 
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages; 
    END IF; 
END $$;
