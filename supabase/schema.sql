create table public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  role text check (role in ('student', 'teacher')) not null default 'student',
  phone text
);

create table public.student_profiles (
  user_id uuid primary key references public.users (id) on delete cascade,
  age integer,
  gender text,
  yoga_experience text,
  health_conditions text,
  goals text[],
  availability text
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text,
  focus text[], -- e.g. ['flexibility', 'strength', 'relaxation']
  teacher_id uuid references public.users (id)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users (id) on delete cascade,
  course_id uuid references public.courses (id) on delete cascade
);

create table public.health_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users (id) on delete cascade,
  flexibility_score integer,
  strength_score integer,
  stress_level integer,
  attendance integer,
  created_at timestamptz default now()
);

