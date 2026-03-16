-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: public.users (Extending auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique not null,
  role text check (role in ('student', 'teacher')) not null default 'student',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: student_profiles
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  age integer,
  gender text,
  height float,
  weight float,
  experience_level text, -- beginner, intermediate, advanced
  goals jsonb, -- ["lose_weight", "flexibility", ...]
  injuries jsonb, -- ["back_pain", "knee_pain", ...]
  schedule jsonb, -- { "available_days": [], "available_time": "", "preferred_intensity": "" }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Table: training_sessions
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.student_profiles(id) on delete cascade not null,
  teacher_id uuid references public.users(id) on delete set null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  class_type text,
  flexibility_score integer,
  strength_score integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: teacher_profiles
create table if not exists public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  bio text,
  specialties jsonb, -- ["Hatha", "Vinyasa", ...]
  certifications jsonb, -- ["RYT-500", ...]
  years_experience integer default 0,
  rating float default 5.0,
  review_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.student_profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.training_sessions enable row level security;

-- Policies for public.users
create policy "Users can view all users" on public.users for select using (true);
create policy "Users can update their own data" on public.users for update using (auth.uid() = id);
create policy "Users can insert their own data" on public.users for insert with check (auth.uid() = id);

-- Policies for student_profiles
create policy "Users can view their own profile"
  on public.student_profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.student_profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.student_profiles for insert
  with check (auth.uid() = user_id);

-- Policies for teacher_profiles
create policy "Users can view all teacher profiles" on public.teacher_profiles for select using (true);

create policy "Teachers can update their own profile"
  on public.teacher_profiles for update
  using (auth.uid() = user_id);

create policy "Teachers can insert their own profile"
  on public.teacher_profiles for insert
  with check (auth.uid() = user_id);

-- Policies for training_sessions
create policy "Students can view their own sessions"
  on public.training_sessions for select
  using (auth.uid() in (
    select user_id from public.student_profiles where id = training_sessions.student_id
  ));

create policy "Teachers can insert sessions"
  on public.training_sessions for insert
  with check (true); -- Simplified

create policy "Teachers can view all sessions"
  on public.training_sessions for select
  using (true);

-- Function to handle new user signup and sync to public.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''), coalesce(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- Table: classes
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid references public.users(id) on delete set null,
  level text, -- Beginner, Intermediate, Advanced
  duration text, -- e.g. "45 minutes"
  intensity text, -- Gentle, Moderate, Dynamic
  focus jsonb, -- ["Hips", ...]
  rating float default 5.0,
  reviews_count integer default 0,
  enrolled integer default 0,
  max_capacity integer default 20,
  schedule text, -- e.g. "Mon, Wed, Fri 7:00 AM"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for classes
alter table public.classes enable row level security;
create policy "Anyone can view classes" on public.classes for select using (true);
create policy "Teachers can manage classes" on public.classes for all using (
  exists (
    select 1 from public.users where id = auth.uid() and role = 'teacher'
  )
);
-- Table: class_registrations
create table if not exists public.class_registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade not null,
  student_id uuid references public.student_profiles(id) on delete cascade not null,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(class_id, student_id)
);

-- Enable RLS for registrations
alter table public.class_registrations enable row level security;
create policy "Students can view their registrations" on public.class_registrations for select using (
  exists (
    select 1 from public.student_profiles where id = class_registrations.student_id and user_id = auth.uid()
  )
);
create policy "Students can register for classes" on public.class_registrations for insert with check (
  exists (
    select 1 from public.student_profiles where id = student_id and user_id = auth.uid()
  )
);
create policy "Teachers can view registrations for their classes" on public.class_registrations for select using (
  exists (
    select 1 from public.classes where id = class_registrations.class_id and teacher_id = auth.uid()
  )
);
