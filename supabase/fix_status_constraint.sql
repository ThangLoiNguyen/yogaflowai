-- Fix class_sessions status check constraint to allow 'live' and 'cancelled'
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

ALTER TABLE public.class_sessions DROP CONSTRAINT IF EXISTS class_sessions_status_check;

ALTER TABLE public.class_sessions 
  ADD CONSTRAINT class_sessions_status_check 
  CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled'));
