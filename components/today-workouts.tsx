import { createClient } from "@/lib/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { WorkoutList } from "./workout-list"

export async function TodayWorkouts() {
  const today = new Date().toISOString().split("T")[0]

  const formattedDate = new Date().toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
  })

  // 檢查 Supabase 配置
  const hasSupabaseConfig = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  if (!hasSupabaseConfig) {
    return (
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            今日訓練 · {formattedDate}
          </CardTitle>
          <CardDescription>尚未新增記錄</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-slate-500 text-center py-8">今天還沒有訓練記錄</p>
        </CardContent>
      </Card>
    )
  }

  try {
    const supabase = await createClient()
    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("workout_date", today)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching workouts:", error)
      return (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Calendar className="h-5 w-5 text-blue-600" />
              今日訓練 · {formattedDate}
            </CardTitle>
            <CardDescription>尚未新增記錄</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-slate-500 text-center py-8">今天還沒有訓練記錄</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            今日訓練 · {formattedDate}
          </CardTitle>
          <CardDescription>
            {workouts && workouts.length > 0 ? `共 ${workouts.length} 項記錄` : "尚未新增記錄"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <WorkoutList workouts={workouts || []} columns={1} />
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error initializing Supabase:", error)
    return (
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            今日訓練 · {formattedDate}
          </CardTitle>
          <CardDescription>尚未新增記錄</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-slate-500 text-center py-8">今天還沒有訓練記錄</p>
        </CardContent>
      </Card>
    )
  }
}
