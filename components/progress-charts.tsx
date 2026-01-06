"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Workout } from "@/lib/types"

export function ProgressCharts({ workouts, exerciseName }: { workouts: Workout[]; exerciseName: string }) {
  // 轉換重量單位（lbs 轉 kg）
  const convertToKg = (weight: number, unit?: string): number => {
    if (unit === "lbs") {
      return weight * 0.453592 // 1 lbs = 0.453592 kg
    }
    return weight
  }

  // 取得主要單位（如果所有記錄都使用相同單位，就使用該單位；否則統一使用 kg）
  const getPrimaryUnit = (): string => {
    const units = workouts.map((w) => w.weight_unit || "kg")
    const uniqueUnits = [...new Set(units)]
    if (uniqueUnits.length === 1) {
      return uniqueUnits[0]
    }
    return "kg" // 如果混合使用，統一轉換為 kg
  }

  const primaryUnit = getPrimaryUnit()

  const weightData = workouts.reduce(
    (acc, workout) => {
      const date = workout.workout_date
      const setsData = workout.sets_data || []
      if (setsData.length === 0) return acc
      
      // 轉換重量到主要單位
      const maxWeight = Math.max(
        ...setsData.map((set) => {
          const weight = set.weight || 0
          // 如果主要單位是 kg，但這筆記錄是 lbs，需要轉換
          if (primaryUnit === "kg" && workout.weight_unit === "lbs") {
            return convertToKg(weight, "lbs")
          }
          // 如果主要單位是 lbs，但這筆記錄是 kg，需要轉換
          if (primaryUnit === "lbs" && workout.weight_unit !== "lbs") {
            return weight / 0.453592
          }
          return weight
        })
      )
      
      if (!acc[date] || maxWeight > acc[date].weight) {
        acc[date] = {
          date,
          weight: maxWeight,
          unit: workout.weight_unit || "kg",
        }
      }
      return acc
    },
    {} as Record<string, { date: string; weight: number; unit: string }>,
  )

  const volumeData = workouts.reduce(
    (acc, workout) => {
      const date = workout.workout_date
      const setsData = workout.sets_data || []
      const unit = workout.weight_unit || "kg"
      
      // 計算訓練量（統一轉換為主要單位）
      const volume = setsData.reduce((sum, set) => {
        let weight = set.weight || 0
        // 轉換到主要單位
        if (primaryUnit === "kg" && unit === "lbs") {
          weight = convertToKg(weight, "lbs")
        } else if (primaryUnit === "lbs" && unit !== "lbs") {
          weight = weight / 0.453592
        }
        return sum + weight * (set.reps || 0)
      }, 0)
      
      if (!acc[date]) {
        acc[date] = {
          date,
          volume: 0,
          sets: [] as { weight: number; reps: number; unit: string }[],
        }
      }
      acc[date].volume += volume
      acc[date].sets = [
        ...acc[date].sets,
        ...setsData.map((set) => ({
          weight: set.weight,
          reps: set.reps,
          unit,
        })),
      ]
      return acc
    },
    {} as Record<string, { date: string; volume: number; sets: { weight: number; reps: number; unit: string }[] }>,
  )

  const weightChartData = Object.values(weightData).map((d) => ({
    date: new Date(d.date).toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
    最大重量: d.weight,
    unit: d.unit,
  }))

  const volumeChartData = Object.values(volumeData).map((d) => ({
    date: new Date(d.date).toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
    訓練量: Math.round(d.volume),
    sets: d.sets,
  }))

  if (workouts.length === 0) {
    return <p className="text-slate-500 text-center py-8">此動作尚未有訓練記錄</p>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>最大重量趨勢</CardTitle>
          <CardDescription>
            {exerciseName} 的每日最大重量變化 ({primaryUnit})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" unit={` ${primaryUnit}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number | undefined) => {
                  if (value === undefined) return ["", "最大重量"]
                  return [`${value} ${primaryUnit}`, "最大重量"]
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="最大重量" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>訓練量趨勢</CardTitle>
          <CardDescription>{exerciseName} 的每日總訓練量（重量 × 次數加總）</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-slate-900 mb-2">{label}</p>
                        <p className="text-sm text-emerald-600 mb-2">
                          訓練量：{data.訓練量} {primaryUnit}
                        </p>
                        <div className="space-y-0.5">
                          {data.sets.map(
                            (set: { weight: number; reps: number; unit: string }, idx: number) => (
                              <p key={idx} className="text-xs text-slate-500">
                                {set.weight} {set.unit || primaryUnit} × {set.reps} 次
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="訓練量" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
