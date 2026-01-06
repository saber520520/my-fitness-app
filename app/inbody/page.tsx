import { createClient } from "@/lib/server"
import { InBodyForm } from "@/components/inbody-form"
import { InBodyGallery } from "@/components/inbody-gallery"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function InBodyPage() {
  // 檢查 Supabase 配置
  const hasSupabaseConfig = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let photos: any[] = []

  if (hasSupabaseConfig) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("inbody_photos")
        .select("*")
        .order("measurement_date", { ascending: false })

      if (!error && data) {
        photos = data
      }
    } catch (error) {
      console.error("Error fetching InBody photos:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Activity className="h-8 w-8 text-orange-600" />
            InBody 記錄
          </h1>
          <p className="text-slate-600">追蹤你的身體組成變化</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardTitle className="text-slate-900">上傳新照片</CardTitle>
              <CardDescription>記錄你的 InBody 測量結果</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <InBodyForm />
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardTitle className="text-slate-900">歷史記錄</CardTitle>
              <CardDescription>查看過去的測量記錄</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <InBodyGallery photos={photos} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
