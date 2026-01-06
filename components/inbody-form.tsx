"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

export function InBodyForm() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    // 檢查檔案大小（限制 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert("檔案太大，請上傳 10MB 以下的照片")
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      alert("請上傳圖片檔案")
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()

      // 上傳到 Supabase Storage
      const timestamp = Date.now()
      const fileExt = file.name.split(".").pop()
      const filename = `inbody-${timestamp}.${fileExt}`

      // 上傳到 inbody-photos bucket（如果不存在會自動建立）
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("inbody-photos")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        // 如果 bucket 不存在，嘗試建立
        if (uploadError.message.includes("not found") || uploadError.message.includes("Bucket")) {
          alert("請先在 Supabase Storage 中建立 'inbody-photos' bucket。參考 STORAGE_SETUP.md")
          throw uploadError
        }
        throw uploadError
      }

      // 取得公開 URL
      const { data: urlData } = supabase.storage.from("inbody-photos").getPublicUrl(uploadData.path)

      // 儲存到資料庫
      const { error: dbError } = await supabase.from("inbody_photos").insert({
        photo_url: urlData.publicUrl,
        measurement_date: date,
        notes: notes || null,
      })

      if (dbError) throw dbError

      // 重置表單
      setFile(null)
      setPreview(null)
      setNotes("")
      setDate(new Date().toISOString().split("T")[0])
      router.refresh()
    } catch (error: any) {
      console.error("Error uploading InBody photo:", error)
      const errorMessage =
        error?.message?.includes("Bucket") || error?.message?.includes("not found")
          ? "請先在 Supabase Storage 中建立 'inbody-photos' bucket"
          : error?.message || "上傳失敗，請重試"
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="photo">InBody 照片</Label>
        <div className="mt-2">
          <label
            htmlFor="photo"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-slate-50 transition-colors"
          >
            {preview ? (
              <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full object-contain rounded-lg" />
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">點擊上傳照片</p>
              </div>
            )}
            <input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="date">測量日期</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="notes">備註（選填）</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="例如：體重 70kg、體脂 15%..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={uploading || !file}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
      >
        {uploading ? "上傳中..." : "儲存記錄"}
      </Button>
    </form>
  )
}
