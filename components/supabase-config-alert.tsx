import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function SupabaseConfigAlert() {
  const hasConfig = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  if (hasConfig) {
    return null
  }

  return (
    <Card className="border-amber-200 bg-amber-50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          需要設定 Supabase
        </CardTitle>
        <CardDescription className="text-amber-700">
          為了讓應用程式完整運作，請設定 Supabase 環境變數
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-amber-800">
        <p>請按照以下步驟設定：</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>在專案根目錄建立 <code className="bg-amber-100 px-1 rounded">.env.local</code> 檔案</li>
          <li>填入 Supabase 環境變數（參考 <code className="bg-amber-100 px-1 rounded">ENV_SETUP.md</code>）</li>
          <li>在 Supabase Dashboard 執行 <code className="bg-amber-100 px-1 rounded">supabase-setup.sql</code></li>
          <li>重新啟動開發伺服器</li>
        </ol>
        <p className="text-xs text-amber-600 mt-3">
          目前 UI 可以正常顯示，但無法儲存資料。設定完成後即可正常使用所有功能。
        </p>
      </CardContent>
    </Card>
  )
}

