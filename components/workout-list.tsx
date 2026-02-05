"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/client"
import { Trash2, Edit, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { WorkoutForm } from "./workout-form"
import type { Workout } from "@/lib/types"

export function WorkoutList({ workouts, columns = 2 }: { workouts: Workout[]; columns?: 1 | 2 }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("workouts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting workout:", error)
      return
    }

    router.refresh()
  }

  if (workouts.length === 0) {
    return <p className="text-slate-500 text-center py-8">今天還沒有訓練記錄</p>
  }

  const gridCols = columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {workouts.map((workout) => (
        <div key={workout.id}>
          {editingId === workout.id ? (
            <WorkoutForm editingWorkout={workout} onEditComplete={() => setEditingId(null)} />
          ) : (
            <div className="p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors h-full">
              <div className="flex gap-3 sm:gap-4">
                {/* 影片在左邊 */}
                {workout.video_url && (
                  <div className="flex-shrink-0 w-24 sm:w-32 md:w-48 self-stretch">
                    <div className="relative group h-full">
                      <video
                        src={workout.video_url}
                        className="w-full h-full min-h-24 sm:min-h-32 md:min-h-48 object-cover rounded-lg bg-slate-900"
                        preload="metadata"
                        playsInline
                        muted
                        controls
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-slate-900/50 rounded-full p-2">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 文字內容在右邊 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <h3 className="font-bold text-lg text-slate-900 truncate pr-2">{workout.exercise_name}</h3>
                    <div className="flex gap-1 flex-shrink-0 flex-col items-end sm:flex-row sm:items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(workout.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(workout.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {workout.sets_data.map((set, index) => (
                      <p key={index} className="text-sm text-slate-600 leading-snug">
                        第 {index + 1} 組：{set.weight} {workout.weight_unit || "kg"} × {set.reps} 次
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
