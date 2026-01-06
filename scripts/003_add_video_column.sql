-- Add video_url column to workouts table
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS video_url TEXT;
