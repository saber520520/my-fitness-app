-- Update workouts table to support individual sets with different weight/reps
-- Drop old columns and add new structure
alter table public.workouts 
  drop column if exists weight,
  drop column if exists sets,
  drop column if exists reps;

-- Add new column to store sets as JSONB array
-- Each set will have: { weight: number, reps: number }
alter table public.workouts 
  add column if not exists sets_data jsonb not null default '[]'::jsonb;

-- Add comment for clarity
comment on column public.workouts.sets_data is 'Array of sets, each with weight and reps: [{ weight: 60, reps: 10 }, ...]';
