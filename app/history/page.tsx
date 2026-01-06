import { Suspense } from "react"
import { createClient } from "@/lib/server"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { HistoryView } from "@/components/history-view"

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const params = await searchParams
  const view = params.view || "day"

  const supabase = await createClient()

  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("*")
    .order("workout_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching workouts:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            訓練歷史記錄
          </h1>
          <p className="text-slate-600">查看所有訓練記錄</p>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardContent className="pt-6">
            <Suspense fallback={<div>載入中...</div>}>
              <HistoryView workouts={workouts || []} initialView={view} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
