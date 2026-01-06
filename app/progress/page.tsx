import { createClient } from "@/lib/server"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { ProgressCharts } from "@/components/progress-charts"
import { ExerciseSelector } from "@/components/exercise-selector"

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ exercise?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get all unique exercises
  const { data: exercises } = await supabase
    .from("workouts")
    .select("exercise_name")
    .order("exercise_name", { ascending: true })

  const uniqueExercises = [...new Set(exercises?.map((e) => e.exercise_name) || [])]

  const selectedExercise = params.exercise || uniqueExercises[0] || ""

  // Get workout data for the selected exercise
  const { data: workouts } = await supabase
    .from("workouts")
    .select("*")
    .eq("exercise_name", selectedExercise)
    .order("workout_date", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            進度追蹤
          </h1>
          <p className="text-slate-600">查看訓練進度和趨勢</p>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            {uniqueExercises.length === 0 ? (
              <p className="text-slate-500 text-center py-8">尚未有任何訓練記錄，請先新增訓練記錄</p>
            ) : (
              <div className="space-y-6">
                <ExerciseSelector exercises={uniqueExercises} selectedExercise={selectedExercise} />
                <ProgressCharts workouts={workouts || []} exerciseName={selectedExercise} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
