"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"

export function ExerciseSelector({
  exercises,
  selectedExercise,
}: {
  exercises: string[]
  selectedExercise: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("exercise", value)
    router.push(`/progress?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="exercise-select">選擇動作</Label>
      <Select value={selectedExercise} onValueChange={handleChange}>
        <SelectTrigger id="exercise-select" className="w-full md:w-64">
          <SelectValue placeholder="選擇動作" />
        </SelectTrigger>
        <SelectContent>
          {exercises.map((exercise) => (
            <SelectItem key={exercise} value={exercise}>
              {exercise}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
