"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutList } from "@/components/workout-list"
import { Badge } from "@/components/ui/badge"
import type { Workout } from "@/lib/types"

type HistoryViewProps = {
  workouts: Workout[]
  initialView: string
}

export function HistoryView({ workouts, initialView }: HistoryViewProps) {
  const [view, setView] = useState(initialView)
  const [dateLabels, setDateLabels] = useState<Record<string, string>>({})

  // 格式化日期顯示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "今天"
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "昨天"
    }

    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date)
  }

  // 獲取周數
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  }

  // 獲取周的開始和結束日期
  const getWeekRange = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 調整到周一
    const monday = new Date(d.setDate(diff))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    return {
      start: monday.toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
      end: sunday.toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
    }
  }

  // 按日期分組
  const workoutsByDate = workouts.reduce(
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

  // 按周分組
  const workoutsByWeek = workouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.workout_date)
      const year = date.getFullYear()
      const week = getWeekNumber(date)
      const key = `${year}-W${week}`

      if (!acc[key]) {
        acc[key] = {
          workouts: [],
          range: getWeekRange(date),
          year,
          week,
        }
      }
      acc[key].workouts.push(workout)
      return acc
    },
    {} as Record<string, { workouts: Workout[]; range: { start: string; end: string }; year: number; week: number }>,
  )

  // 按月分組
  const workoutsByMonth = workouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.workout_date)
      const key = date.toLocaleDateString("zh-TW", { year: "numeric", month: "long" })

      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(workout)
      return acc
    },
    {} as Record<string, Workout[]>,
  )

  // 按動作分組
  const workoutsByExercise = workouts.reduce(
    (acc, workout) => {
      const name = workout.exercise_name
      if (!acc[name]) {
        acc[name] = []
      }
      acc[name].push(workout)
      return acc
    },
    {} as Record<string, Workout[]>,
  )

  // 計算統計數據
  const getStats = (workouts: Workout[]) => {
    const totalSets = workouts.reduce((sum, w) => sum + (w.sets_data?.length || 0), 0)
    const exercises = new Set(workouts.map((w) => w.exercise_name)).size
    return { totalSets, exercises, workouts: workouts.length }
  }

  const formatCreatedDate = (dateString: string) =>
    new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date(dateString))

  const getCreatedDateLabel = (dateWorkouts: Workout[], fallback: string) => {
    const createdDates = dateWorkouts
      .map((workout) => workout.created_at)
      .filter((value): value is string => Boolean(value))

    if (createdDates.length === 0) {
      return fallback
    }

    const earliestCreatedAt = createdDates.reduce((earliest, current) =>
      new Date(current) < new Date(earliest) ? current : earliest,
    )

    return formatCreatedDate(earliestCreatedAt)
  }

  const handleDateLabelChange = (date: string, value: string, fallbackLabel: string) => {
    const nextValue = value.trim()
    setDateLabels((prev) => ({
      ...prev,
      [date]: nextValue || fallbackLabel,
    }))
  }

  const handleDateLabelInput = (date: string, value: string) => {
    setDateLabels((prev) => ({
      ...prev,
      [date]: value,
    }))
  }

  if (workouts.length === 0) {
    return <p className="text-slate-500 text-center py-8">尚未有任何訓練記錄</p>
  }

  return (
    <Tabs value={view} onValueChange={setView} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="day">按日</TabsTrigger>
        <TabsTrigger value="week">按周</TabsTrigger>
        <TabsTrigger value="month">按月</TabsTrigger>
        <TabsTrigger value="exercise">按動作</TabsTrigger>
      </TabsList>

      {/* 按日視圖 */}
      <TabsContent value="day" className="space-y-6">
        {Object.entries(workoutsByDate).map(([date, dateWorkouts]) => {
          const formattedDate = formatDate(date)
          const createdDateLabel = getCreatedDateLabel(dateWorkouts, formattedDate)

          return (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-slate-200" />
              <input
                className="text-sm font-semibold text-slate-700 px-3 rounded bg-transparent text-center outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`編輯日期標題 ${formattedDate}`}
                value={dateLabels[date] ?? formattedDate}
                onChange={(event) => handleDateLabelInput(date, event.target.value)}
                onBlur={(event) => handleDateLabelChange(date, event.target.value, createdDateLabel)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    event.currentTarget.blur()
                  }
                }}
              />
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <WorkoutList workouts={dateWorkouts as Workout[]} />
            </div>
          )
        })}
      </TabsContent>

      {/* 按周視圖 */}
      <TabsContent value="week" className="space-y-6">
        {Object.entries(workoutsByWeek)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([key, { workouts: weekWorkouts, range, year, week }]) => {
            const stats = getStats(weekWorkouts)
            const workoutsByDateInWeek = weekWorkouts.reduce(
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

            return (
              <div key={key} className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      第 {week} 周 ({range.start} - {range.end})
                    </h3>
                    <p className="text-sm text-slate-500">{year} 年</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{stats.workouts} 次訓練</Badge>
                    <Badge variant="secondary">{stats.exercises} 個動作</Badge>
                    <Badge variant="secondary">{stats.totalSets} 組</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(workoutsByDateInWeek)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([date, dateWorkouts]) => (
                      <div key={date} className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-600">{formatDate(date)}</h4>
                        <WorkoutList workouts={dateWorkouts as Workout[]} />
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
      </TabsContent>

      {/* 按月視圖 */}
      <TabsContent value="month" className="space-y-6">
        {Object.entries(workoutsByMonth).map(([month, monthWorkouts]) => {
          const stats = getStats(monthWorkouts)
          const workoutsByDateInMonth = monthWorkouts.reduce(
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

          return (
            <div key={month} className="border border-slate-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">{month}</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">{stats.workouts} 次訓練</Badge>
                  <Badge variant="secondary">{stats.exercises} 個動作</Badge>
                  <Badge variant="secondary">{stats.totalSets} 組</Badge>
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(workoutsByDateInMonth)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, dateWorkouts]) => (
                    <div key={date} className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-600">{formatDate(date)}</h4>
                      <WorkoutList workouts={dateWorkouts as Workout[]} />
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </TabsContent>

      {/* 按動作視圖 */}
      <TabsContent value="exercise" className="space-y-6">
        {Object.entries(workoutsByExercise)
          .sort(([a], [b]) => a.localeCompare(b, "zh-TW"))
          .map(([exercise, exerciseWorkouts]) => {
            const stats = getStats(exerciseWorkouts)
            const maxWeight = Math.max(0, ...exerciseWorkouts.flatMap((w) => (w.sets_data || []).map((s) => s.weight || 0)))

            return (
              <div key={exercise} className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{exercise}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{stats.workouts} 次</Badge>
                    <Badge variant="secondary">{stats.totalSets} 組</Badge>
                    <Badge variant="secondary">最大 {maxWeight} kg</Badge>
                  </div>
                </div>
                <WorkoutList workouts={exerciseWorkouts} />
              </div>
            )
          })}
      </TabsContent>
    </Tabs>
  )
}
