"use client"

import { createClient } from "@/lib/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"

interface SetDetail {
  weight: number
  reps: number
}

interface Workout {
  id: string
  exercise_name: string
  sets_data: SetDetail[]  // 修正：資料庫欄位名稱是 sets_data
  workout_date: string
  weight_unit?: string
}

export function RecentWorkouts() {
  const {
    data: workouts,
    error,
    isLoading,
  } = useSWR("recent-workouts", async () => {
    try {
      const supabase = createClient()
      const today = new Date()

      // 取得過去 7 天的日期範圍（不包含今天）
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const todayStr = today.toISOString().split("T")[0]
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .gte("workout_date", sevenDaysAgoStr)
        .lt("workout_date", todayStr)
        .order("workout_date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Workout[]
    } catch (err: any) {
      // 如果 Supabase 未配置，返回空陣列
      if (err?.message?.includes("Missing Supabase")) {
        return []
      }
      throw err
    }
  })

  const today = new Date()

  // 按日期分組
  const groupedByDate = (workouts || []).reduce(
    (acc, workout) => {
      const date = workout.workout_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(workout)
      return acc
    },
    {} as Record<string, Workout[]>,
  )

  const dates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    const weekday = date.toLocaleDateString("zh-TW", { weekday: "short" })
    const monthDay = date.toLocaleDateString("zh-TW", { month: "short", day: "numeric" })

    if (daysDiff === 1) {
      return `昨天 · ${weekday}`
    } else if (daysDiff === 2) {
      return `前天 · ${weekday}`
    } else {
      return `${monthDay} · ${weekday}`
    }
  }

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="h-5 w-5 text-green-600" />
          近期訓練
        </CardTitle>
        <CardDescription>過去 7 天的訓練記錄</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <p className="text-center text-slate-500 py-4">載入中...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-4">載入失敗，請重新整理頁面</p>
        ) : dates.length === 0 ? (
          <p className="text-center text-slate-500 py-4">過去 7 天沒有訓練記錄</p>
        ) : (
          <div className="space-y-6">
            {dates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {formatDate(date)}
                  </Badge>
                  <span className="text-xs text-slate-500">{groupedByDate[date].length} 項動作</span>
                </div>
                <div className="grid gap-2">
                  {groupedByDate[date].map((workout) => {
                    const sets = workout.sets_data || []  // 修正：使用 sets_data 而不是 sets
                    const unit = workout.weight_unit || "kg"
                    const totalSets = sets.length
                    const maxWeight = sets.length > 0 ? Math.max(...sets.map((s: SetDetail) => s.weight)) : 0

                    return (
                      <div
                        key={workout.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <div>
                          <span className="font-medium text-slate-900">{workout.exercise_name}</span>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {sets.length > 0 ? (
                              sets.map((s: SetDetail, i: number) => (
                                <span key={i}>
                                  {i > 0 && " · "}
                                  {s.weight}
                                  {unit}×{s.reps}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400">無組數資料</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-slate-600">{totalSets} 組</div>
                          {maxWeight > 0 && (
                            <div className="text-xs text-slate-400">
                              最大 {maxWeight}
                              {unit}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
