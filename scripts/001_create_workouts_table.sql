-- Create workouts table for storing exercise records
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  workout_date date not null,
  exercise_name text not null,
  weight numeric not null,
  sets integer not null,
  reps integer not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.workouts enable row level security;

-- Create policies for public access (no authentication required for this simple app)
create policy "Allow anyone to view workouts"
  on public.workouts for select
  using (true);

create policy "Allow anyone to insert workouts"
  on public.workouts for insert
  with check (true);

create policy "Allow anyone to update workouts"
  on public.workouts for update
  using (true);

create policy "Allow anyone to delete workouts"
  on public.workouts for delete
  using (true);

-- Create index for faster queries by date
create index if not exists workouts_date_idx on public.workouts(workout_date desc);
