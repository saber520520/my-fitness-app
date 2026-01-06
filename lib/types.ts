// 共用的類型定義

export type Workout = {
  id: string
  exercise_name: string
  workout_date: string
  sets_data: Array<{ weight: number; reps: number }>
  video_url: string | null
  weight_unit?: "kg" | "lbs"
  created_at?: string
}

