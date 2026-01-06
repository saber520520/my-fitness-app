import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, exerciseName, thumbnailDataUrl } = await request.json()

    if (!videoUrl && !thumbnailDataUrl) {
      return NextResponse.json({ error: "缺少影片或截圖" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `你是一位專業的健身教練，請分析這張「${exerciseName || "健身動作"}」影片截圖中的姿勢。

請用繁體中文回答，格式如下：
【評分】X/10

【優點】
• 優點1
• 優點2

【需要改進】
• 改進點1
• 改進點2

【建議】
• 建議1
• 建議2

請簡潔扼要，每點一句話即可。`,
            },
            {
              type: "image",
              image: thumbnailDataUrl,
            },
          ],
        },
      ],
    })

    return NextResponse.json({ analysis: text })
  } catch (error: any) {
    const errorString = JSON.stringify(error) + (error?.message || "") + (error?.cause?.message || "")

    if (
      errorString.includes("customer_verification_required") ||
      errorString.includes("credit card") ||
      errorString.includes("403") ||
      errorString.includes("AI Gateway")
    ) {
      return NextResponse.json({ error: "AI 功能需要設定", requiresSetup: true }, { status: 200 })
    }

    return NextResponse.json({ error: "分析失敗，請稍後再試" }, { status: 500 })
  }
}
