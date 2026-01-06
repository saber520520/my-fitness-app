"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

type FormAnalysisProps = {
  videoUrl: string
  exerciseName: string
}

export function FormAnalysis({ videoUrl, exerciseName }: FormAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const captureFrame = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      video.src = videoUrl
      video.muted = true

      video.onloadeddata = () => {
        video.currentTime = video.duration / 2 // 擷取影片中間的畫面
      }

      video.onseeked = () => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
          resolve(dataUrl)
        } else {
          reject(new Error("無法擷取畫面"))
        }
      }

      video.onerror = () => {
        reject(new Error("影片載入失敗"))
      }
    })
  }

  const analyzeForm = async () => {
    setLoading(true)
    setError(null)

    try {
      const thumbnailDataUrl = await captureFrame()

      const response = await fetch("/api/analyze-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, exerciseName, thumbnailDataUrl }),
      })

      const data = await response.json()

      if (data.requiresSetup) {
        setError("AI_SETUP_REQUIRED")
        return
      }

      if (!response.ok) {
        setError("分析失敗，請稍後再試")
        return
      }

      setAnalysis(data.analysis)
    } catch (err: any) {
      setError("無法分析影片，請確認網路連線後再試")
    } finally {
      setLoading(false)
    }
  }

  const parseAnalysis = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    const sections: { title: string; content: string[]; type: "score" | "good" | "improve" | "suggest" }[] = []

    let currentSection: { title: string; content: string[]; type: "score" | "good" | "improve" | "suggest" } | null =
      null

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.includes("評分") || trimmed.match(/^\d+\.\s*姿勢評分/) || trimmed.match(/^【評分】/)) {
        currentSection = { title: "姿勢評分", content: [], type: "score" }
        const scoreMatch = trimmed.match(/(\d+)\s*(\/10|分)/)
        if (scoreMatch) {
          currentSection.content.push(`${scoreMatch[1]}/10 分`)
        } else {
          currentSection.content.push(trimmed.replace(/^【評分】|^\d+\.\s*姿勢評分[：:]\s*/, ""))
        }
        sections.push(currentSection)
      } else if (trimmed.includes("優點") || trimmed.match(/^【優點】/)) {
        currentSection = { title: "優點", content: [], type: "good" }
        sections.push(currentSection)
      } else if (trimmed.includes("需要改進") || trimmed.includes("改進") || trimmed.match(/^【需要改進】/)) {
        currentSection = { title: "需要改進", content: [], type: "improve" }
        sections.push(currentSection)
      } else if (trimmed.includes("建議") || trimmed.match(/^【建議】/)) {
        currentSection = { title: "具體建議", content: [], type: "suggest" }
        sections.push(currentSection)
      } else if (currentSection && (trimmed.match(/^[-•*]\s*/) || trimmed.match(/^[a-zA-Z]\.\s*/))) {
        currentSection.content.push(trimmed.replace(/^[-•*a-zA-Z.]\s*/, ""))
      } else if (currentSection && trimmed && !trimmed.match(/^【/)) {
        currentSection.content.push(trimmed)
      }
    })

    return sections
  }

  return (
    <div className="mt-3 space-y-3">
      {!analysis && !loading && (
        <Button
          onClick={analyzeForm}
          variant="outline"
          size="sm"
          className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI 姿勢分析
        </Button>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-purple-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">正在分析影片...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{error === "AI_SETUP_REQUIRED" ? "AI 功能需要設定" : "分析失敗"}</span>
          </div>
          {error === "AI_SETUP_REQUIRED" ? (
            <p className="text-xs text-amber-700 pl-6">
              要啟用 AI 姿勢分析功能，請先在 Vercel 帳戶中
              <a
                href="https://vercel.com/~/settings/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-amber-900"
              >
                設定付款方式
              </a>
              以解鎖免費額度。
            </p>
          ) : (
            <p className="text-xs text-amber-700 pl-6">{error}</p>
          )}
        </div>
      )}

      {analysis && (
        <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100 space-y-3">
          <div className="flex items-center gap-2 text-purple-700 font-medium text-sm">
            <Sparkles className="h-4 w-4" />
            AI 姿勢分析結果
          </div>

          {parseAnalysis(analysis).map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-1.5">
                {section.type === "score" && <span className="text-lg">📊</span>}
                {section.type === "good" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {section.type === "improve" && <XCircle className="h-4 w-4 text-amber-600" />}
                {section.type === "suggest" && <span className="text-sm">💡</span>}
                <span className="font-medium text-xs text-slate-700">{section.title}</span>
              </div>
              <div className="pl-5 space-y-0.5">
                {section.content.map((item, i) => (
                  <p key={i} className="text-xs text-slate-600 leading-relaxed">
                    {section.type !== "score" && "• "}
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <Button
            onClick={analyzeForm}
            variant="ghost"
            size="sm"
            className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            重新分析
          </Button>
        </div>
      )}
    </div>
  )
}
