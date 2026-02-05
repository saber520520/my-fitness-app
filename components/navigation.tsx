"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, TrendingUp, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/history", label: "歷史記錄", icon: History },
  { href: "/progress", label: "進度追蹤", icon: TrendingUp },
  { href: "/inbody", label: "InBody", icon: Activity },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="回到首頁"
          >
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">Fitness Tracker</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap sm:flex-row sm:gap-2 sm:px-4 sm:text-sm",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

