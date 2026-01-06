-- 添加重量單位欄位到 workouts 表
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS weight_unit TEXT DEFAULT 'kg';
