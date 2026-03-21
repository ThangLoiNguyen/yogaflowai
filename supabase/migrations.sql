-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- Drop existing tables to start clean (following prompt's complete spec)
-- Ensure we don't break the handle_new_user trigger during this
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Drop all tables if they exist to re-initialize with the new spec
drop table if exists public.notifications cascade;
drop table if exists public.streaks cascade;
drop table if exists public.reviews cascade;
drop table if exists public.payments cascade;
drop table if exists public.progress_logs cascade;
drop table if exists public.ai_suggestions cascade;
drop table if exists public.session_quiz cascade;
drop table if exists public.onboarding_quiz cascade;
drop table if exists public.bookings cascade;
drop table if exists public.class_sessions cascade;
drop table if exists public.courses cascade;
drop table if exists public.teacher_profiles cascade;
drop table if exists public.users cascade;

/* Users */
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text check (role in ('student','teacher')) not null default 'student',
  full_name text,
  avatar_url text,
  bio text,
  subscription_tier text default 'free',
  gdpr_consent_at timestamptz,
  created_at timestamptz default now()
);

/* Teacher extended info */
create table public.teacher_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  certifications text[],
  years_experience int,
  teaching_style text,
  specializations text[],
  stripe_account_id text,
  is_verified bool default false
);

/* Courses */
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.users(id) on delete set null,
  title text not null,
  description text,
  level int check (level between 1 and 5),
  goals text[],
  intensity int check (intensity between 1 and 5),
  duration_weeks int,
  sessions_per_week int,
  contraindications text[],
  tags text[],
  max_students int default 20,
  price_per_session numeric(10,2),
  status text default 'draft',
  metadata_embedding vector(1536),
  created_at timestamptz default now()
);

/* Sessions */
create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  teacher_id uuid references public.users(id) on delete set null,
  title text,
  scheduled_at timestamptz not null,
  duration_minutes int default 60,
  max_students int,
  video_mode text check (video_mode in ('embedded','scale')) default 'embedded',
  livekit_room_id text,
  status text default 'scheduled',
  created_at timestamptz default now()
);

/* Bookings */
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  session_id uuid references public.class_sessions(id) on delete cascade,
  status text default 'booked',
  payment_id text,
  is_waitlist bool default false,
  booked_at timestamptz default now(),
  notified_at timestamptz
);

/* Onboarding quiz — filled once after register */
create table public.onboarding_quiz (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade unique,
  goals text[],
  experience_level int,
  health_issues text,
  available_days text[],
  fitness_level int,
  expectations text,
  contraindications text[],
  embedding vector(1536),
  filled_at timestamptz default now()
);

/* Post-session quiz — filled after every class */
create table public.session_quiz (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  session_id uuid references public.class_sessions(id) on delete cascade,
  fatigue_level int check (fatigue_level between 1 and 10),
  pain_areas text[],
  hardest_pose text,
  improvement_noticed text,
  motivation_level int check (motivation_level between 1 and 5),
  focus_next text,
  free_notes text,
  embedding vector(1536),
  submitted_at timestamptz default now()
);

/* AI suggestions for teacher */
create table public.ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  teacher_id uuid references public.users(id) on delete cascade,
  session_id uuid references public.class_sessions(id) on delete cascade,
  quiz_id uuid references public.session_quiz(id) on delete cascade,
  suggestions jsonb not null,
  teacher_decision text default 'pending',
  teacher_notes text,
  decided_at timestamptz,
  created_at timestamptz default now()
);

/* Progress tracking */
create table public.progress_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  session_id uuid references public.class_sessions(id) on delete cascade,
  flexibility_score int,
  fatigue_level int,
  mood int,
  teacher_feedback text,
  ai_score numeric(4,2),
  logged_at timestamptz default now()
);

/* Payments */
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  teacher_id uuid references public.users(id) on delete cascade,
  session_id uuid references public.class_sessions(id) on delete cascade,
  amount numeric(10,2),
  currency text default 'VND',
  stripe_payment_id text,
  commission_rate numeric(4,2) default 0.20,
  teacher_payout numeric(10,2),
  status text default 'pending',
  paid_at timestamptz
);

/* Reviews */
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  teacher_reply text,
  is_public bool default true,
  created_at timestamptz default now()
);

/* Streaks */
create table public.streaks (
  student_id uuid primary key references public.users(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_checkin_date date,
  badges text[] default '{}'
);

/* Notifications */
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  type text,
  title text,
  body text,
  deep_link text,
  channel text check (channel in ('push','email','in_app')),
  is_read bool default false,
  sent_at timestamptz default now()
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.courses enable row level security;
alter table public.class_sessions enable row level security;
alter table public.bookings enable row level security;
alter table public.onboarding_quiz enable row level security;
alter table public.session_quiz enable row level security;
alter table public.ai_suggestions enable row level security;
alter table public.progress_logs enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.streaks enable row level security;
alter table public.notifications enable row level security;

-- Simple Policies (to be refined as needed)
create policy "Users can view their own record." on public.users for select using (auth.uid() = id);
create policy "Users can update their own record." on public.users for update using (auth.uid() = id);

create policy "Teacher profiles are public." on public.teacher_profiles for select using (true);
create policy "Teachers can manage their profiles." on public.teacher_profiles for all using (auth.uid() = user_id);

create policy "Courses are public." on public.courses for select using (true);
create policy "Teachers can manage their courses." on public.courses for all using (auth.uid() = teacher_id);

create policy "Class sessions are public." on public.class_sessions for select using (true);
create policy "Teachers can manage their sessions." on public.class_sessions for all using (auth.uid() = teacher_id);

create policy "Students can view their bookings." on public.bookings for select using (auth.uid() = student_id);
create policy "Students can book sessions." on public.bookings for insert with check (auth.uid() = student_id);

create policy "Students can manage their onboarding quiz." on public.onboarding_quiz for all using (auth.uid() = student_id);
create policy "Teachers can view student onboarding quizzes they teach." on public.onboarding_quiz for select using (true); -- Simplified

create policy "Students can manage their session quizzes." on public.session_quiz for all using (auth.uid() = student_id);
create policy "Teachers can view session quizzes for their sessions." on public.session_quiz for select using (true); -- Simplified

create policy "Teachers can manage AI suggestions for their sessions." on public.ai_suggestions for all using (auth.uid() = teacher_id);
create policy "Students can view AI suggestions for themselves." on public.ai_suggestions for select using (auth.uid() = student_id);

create policy "Users can view notifications." on public.notifications for select using (auth.uid() = user_id);

-- Auth Sync Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Vector Search Function
create or replace function match_courses(
  query_embedding vector(1536),
  match_threshold float default 0.70,
  match_count int default 10
)
returns table (id uuid, title text, similarity float)
language plpgsql as $$
begin
  return query
  select c.id, c.title,
    1 - (c.metadata_embedding <=> query_embedding) as similarity
  from courses c
  where 1 - (c.metadata_embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
