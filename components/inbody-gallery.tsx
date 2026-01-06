"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, FileText } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

type InBodyPhoto = {
  id: string
  photo_url: string
  measurement_date: string
  notes?: string
  created_at: string
}

export function InBodyGallery({ photos }: { photos: InBodyPhoto[] }) {
  const router = useRouter()
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這筆記錄嗎？")) return

    const supabase = createClient()
    const { error } = await supabase.from("inbody_photos").delete().eq("id", id)

    if (error) {
      console.error("Error deleting photo:", error)
      return
    }

    router.refresh()
  }

  if (photos.length === 0) {
    return <p className="text-slate-500 text-center py-8">還沒有 InBody 記錄</p>
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative cursor-pointer group" onClick={() => setSelectedPhoto(photo.photo_url)}>
              <img
                src={photo.photo_url || "/placeholder.svg"}
                alt={`InBody ${photo.measurement_date}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  點擊放大
                </span>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(photo.measurement_date).toLocaleDateString("zh-TW")}</span>
              </div>

              {photo.notes && (
                <div className="flex items-start gap-2 text-sm text-slate-600 mb-3">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p className="line-clamp-2">{photo.notes}</p>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(photo.id)}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                刪除
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox for viewing full image */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto || "/placeholder.svg"}
            alt="Full size InBody"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-slate-300"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
