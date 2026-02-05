"use client"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardTitle, CardHeader, Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import type React from "react"
import { Plus, Trash2, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Workout } from "@/lib/types"

type SetData = {
  weight: string
  reps: string
}

type WorkoutFormProps = {
  editingWorkout?: Workout
  onEditComplete?: () => void
}

export function WorkoutForm({ editingWorkout, onEditComplete }: WorkoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState(editingWorkout?.video_url ?? "")
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [exerciseHistory, setExerciseHistory] = useState<string[]>([])
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false)
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(editingWorkout?.weight_unit || "kg")

  const [formData, setFormData] = useState({
    date: editingWorkout?.workout_date || new Date().toISOString().split("T")[0],
    exerciseName: editingWorkout?.exercise_name || "",
  })

  const [sets, setSets] = useState<SetData[]>(
    editingWorkout?.sets_data.map((set) => ({
      weight: set.weight.toString(),
      reps: set.reps.toString(),
    })) || [{ weight: "", reps: "" }],
  )

  useEffect(() => {
    const loadExerciseHistory = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("workouts")
          .select("exercise_name")
          .order("created_at", { ascending: false })

        if (!error && data) {
          const uniqueExercises = [...new Set(data.map((d) => d.exercise_name))]
          setExerciseHistory(uniqueExercises)
        }
      } catch (err: any) {
        // 如果 Supabase 未配置，靜默失敗
        if (err?.message?.includes("Missing Supabase")) {
          console.log("Supabase not configured, skipping exercise history")
        }
      }
    }
    loadExerciseHistory()
  }, [])

  const filteredExercises = exerciseHistory.filter(
    (exercise) =>
      exercise.toLowerCase().includes(formData.exerciseName.toLowerCase()) &&
      exercise.toLowerCase() !== formData.exerciseName.toLowerCase(),
  )

  const addSet = () => {
    setSets([...sets, { weight: "", reps: "" }])
  }

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index))
    }
  }

  const updateSet = (index: number, field: keyof SetData, value: string) => {
    const newSets = [...sets]
    newSets[index][field] = value
    setSets(newSets)
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      alert("檔案太大，請上傳 50MB 以下的影片")
      return
    }

    if (!file.type.startsWith("video/")) {
      alert("請上傳影片檔案")
      return
    }

    setIsUploadingVideo(true)

    try {
      const supabase = createClient()
      const timestamp = Date.now()
      const fileExt = file.name.split(".").pop()
      const filename = `workout-${timestamp}.${fileExt}`

      // 使用 Supabase Storage 上傳
      const { data, error } = await supabase.storage.from("workout-videos").upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw error
      }

      // 取得公開 URL
      const { data: urlData } = supabase.storage.from("workout-videos").getPublicUrl(data.path)

      setVideoUrl(urlData.publicUrl)
    } catch (error) {
      console.error("Error uploading video:", error)
      alert(error instanceof Error ? error.message : "影片上傳失敗，請重試")
    } finally {
      setIsUploadingVideo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const setsData = sets.map((set) => ({
        weight: Number.parseFloat(set.weight),
        reps: Number.parseInt(set.reps),
      }))

      if (editingWorkout) {
        const { error } = await supabase
          .from("workouts")
          .update({
            workout_date: formData.date,
            exercise_name: formData.exerciseName,
            sets_data: setsData,
            video_url: videoUrl || null,
            weight_unit: weightUnit,
          })
          .eq("id", editingWorkout.id)

        if (error) throw error
        onEditComplete?.()
      } else {
        const { error } = await supabase.from("workouts").insert({
          workout_date: formData.date,
          exercise_name: formData.exerciseName,
          sets_data: setsData,
          video_url: videoUrl || null,
          weight_unit: weightUnit,
        })

        if (error) throw error

        setFormData({
          ...formData,
          exerciseName: "",
        })
        setSets([{ weight: "", reps: "" }])
        setVideoUrl("")
      }

      router.refresh()
    } catch (error: any) {
      console.error("Error saving workout:", error)
      if (error?.message?.includes("Missing Supabase")) {
        alert("請先設定 Supabase 環境變數才能儲存資料。請參考 ENV_SETUP.md")
      } else {
        alert("儲存失敗，請稍後再試")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          {editingWorkout ? "編輯訓練記錄" : "新增訓練記錄"}
        </CardTitle>
        <CardDescription>{editingWorkout ? "修改訓練記錄" : "記錄今天的健身動作"}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="exerciseName">動作名稱</Label>
              <div className="relative">
                <Input
                  id="exerciseName"
                  type="text"
                  placeholder="例如：臥推"
                  value={formData.exerciseName}
                  onChange={(e) => {
                    setFormData({ ...formData, exerciseName: e.target.value })
                    setShowExerciseDropdown(true)
                  }}
                  onFocus={() => setShowExerciseDropdown(true)}
                  onBlur={() => {
                    setTimeout(() => setShowExerciseDropdown(false), 200)
                  }}
                  required
                />
                {exerciseHistory.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
                  >
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                )}
              </div>
              {showExerciseDropdown &&
                (formData.exerciseName === "" ? exerciseHistory : filteredExercises).length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-auto">
                    {(formData.exerciseName === "" ? exerciseHistory : filteredExercises).map((exercise, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => {
                          setFormData({ ...formData, exerciseName: exercise })
                          setShowExerciseDropdown(false)
                        }}
                      >
                        {exercise}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">動作影片（選填）</Label>
            {videoUrl ? (
              <div className="relative">
                <video src={videoUrl} controls className="w-full max-h-48 rounded-lg bg-slate-900" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setVideoUrl("")}
                  className="absolute top-2 right-2 bg-slate-900/80 text-white hover:bg-slate-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={isUploadingVideo}
                  className="flex-1"
                />
                {isUploadingVideo && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    上傳中...
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-slate-500">上傳動作影片以追蹤姿勢和進度（最大 50MB）</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Label>組數詳情</Label>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setWeightUnit("kg")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      weightUnit === "kg"
                        ? "bg-white text-blue-600 font-medium shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit("lbs")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      weightUnit === "lbs"
                        ? "bg-white text-blue-600 font-medium shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addSet}>
                <Plus className="h-4 w-4 mr-1" />
                新增組
              </Button>
            </div>

            <div className="space-y-3">
              {sets.map((set, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-none w-12">
                    <Label className="text-sm text-slate-600">第 {index + 1} 組</Label>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`weight-${index}`} className="text-xs">
                      重量 ({weightUnit})
                    </Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      step="0.5"
                      placeholder="60"
                      value={set.weight}
                      onChange={(e) => updateSet(index, "weight", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`reps-${index}`} className="text-xs">
                      次數
                    </Label>
                    <Input
                      id={`reps-${index}`}
                      type="number"
                      placeholder="10"
                      value={set.reps}
                      onChange={(e) => updateSet(index, "reps", e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSet(index)}
                    disabled={sets.length === 1}
                    className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            {editingWorkout && (
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onEditComplete}>
                取消
              </Button>
            )}
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (editingWorkout ? "更新中..." : "新增中...") : editingWorkout ? "更新記錄" : "新增記錄"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
