import { WorkoutForm } from "@/components/workout-form";
import { TodayWorkouts } from "@/components/today-workouts";
import { RecentWorkouts } from "@/components/recent-workouts";
import { SupabaseConfigAlert } from "@/components/supabase-config-alert";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">我的健身紀錄</h1>
          <p className="text-slate-600">追蹤你的訓練進度，記錄每一次的努力</p>
        </div>

        {/* Supabase 配置提示 */}
        <div className="mb-6">
          <SupabaseConfigAlert />
        </div>

        {/* 主要內容區域 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 左側：新增訓練記錄 */}
          <div className="space-y-6">
            <WorkoutForm />
          </div>

          {/* 右側：今日訓練和近期訓練 */}
          <div className="space-y-6">
            <TodayWorkouts />
            <RecentWorkouts />
          </div>
        </div>
      </main>
    </div>
  );
}
