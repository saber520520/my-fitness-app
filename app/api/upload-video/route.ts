import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // 驗證檔案類型
        const extension = pathname.split(".").pop()?.toLowerCase()
        const videoExtensions = ["mp4", "mov", "avi", "webm", "mkv", "m4v"]

        if (!extension || !videoExtensions.includes(extension)) {
          throw new Error("只支援影片檔案格式")
        }

        return {
          allowedContentTypes: [
            "video/mp4",
            "video/quicktime",
            "video/x-msvideo",
            "video/webm",
            "video/x-matroska",
            "video/x-m4v",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("Video uploaded successfully:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "上傳失敗" }, { status: 400 })
  }
}
