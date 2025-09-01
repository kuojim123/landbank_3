import { type NextRequest, NextResponse } from "next/server"

interface FeedbackData {
  messageId: string
  feedback: "helpful" | "not-helpful"
  reason?: "content-unclear" | "content-incomplete" | "wrong-url" | "irrelevant-answer" | "other"
  customReason?: string
  query: string
  answer: string
  timestamp: string
  sessionId?: string
}

const feedbackStorage: FeedbackData[] = [
  {
    messageId: "msg-001",
    feedback: "helpful",
    query: "如何申請企業網路銀行？",
    answer: "申請企業網路銀行需要準備公司登記證明文件、負責人身分證明等資料...",
    timestamp: "2024-08-29T10:30:00.000Z",
    sessionId: "session-001",
  },
  {
    messageId: "msg-002",
    feedback: "not-helpful",
    reason: "content-incomplete",
    query: "忘記企業網路銀行密碼怎麼辦？",
    answer: "請聯繫客服重設密碼",
    timestamp: "2024-08-29T11:15:00.000Z",
    sessionId: "session-002",
  },
  {
    messageId: "msg-003",
    feedback: "helpful",
    query: "企業網路銀行轉帳限額是多少？",
    answer: "企業網路銀行轉帳限額依據您的帳戶等級而定，一般企業戶每日轉帳限額為500萬元...",
    timestamp: "2024-08-29T12:45:00.000Z",
    sessionId: "session-003",
  },
  {
    messageId: "msg-004",
    feedback: "not-helpful",
    reason: "irrelevant-answer",
    query: "如何查詢交易明細？",
    answer: "請使用網路銀行登入查詢",
    timestamp: "2024-08-29T13:20:00.000Z",
    sessionId: "session-004",
  },
  {
    messageId: "msg-005",
    feedback: "helpful",
    query: "企業網路銀行支援哪些瀏覽器？",
    answer: "企業網路銀行支援Chrome、Firefox、Safari、Edge等主流瀏覽器的最新版本...",
    timestamp: "2024-08-29T14:10:00.000Z",
    sessionId: "session-005",
  },
  {
    messageId: "msg-006",
    feedback: "not-helpful",
    reason: "content-unclear",
    query: "SSL憑證錯誤怎麼處理？",
    answer: "請檢查憑證設定",
    timestamp: "2024-08-29T15:30:00.000Z",
    sessionId: "session-006",
  },
  {
    messageId: "msg-007",
    feedback: "helpful",
    query: "如何設定約定轉入帳號？",
    answer: "設定約定轉入帳號需要先完成身分驗證，然後在網路銀行的轉帳設定中新增約定帳號...",
    timestamp: "2024-08-29T16:45:00.000Z",
    sessionId: "session-007",
  },
  {
    messageId: "msg-008",
    feedback: "not-helpful",
    reason: "wrong-url",
    query: "企業網路銀行登入網址是什麼？",
    answer: "請訪問 https://example.com/login",
    timestamp: "2024-08-29T17:20:00.000Z",
    sessionId: "session-008",
  },
  {
    messageId: "msg-009",
    feedback: "helpful",
    query: "讀卡機無法讀取憑證怎麼辦？",
    answer: "讀卡機無法讀取憑證可能是驅動程式問題，請先確認讀卡機驅動程式已正確安裝...",
    timestamp: "2024-08-29T18:15:00.000Z",
    sessionId: "session-009",
  },
  {
    messageId: "msg-010",
    feedback: "not-helpful",
    reason: "other",
    customReason: "回答太簡短，需要更詳細的說明",
    query: "如何變更企業網路銀行聯絡資料？",
    answer: "請到設定頁面修改",
    timestamp: "2024-08-29T19:30:00.000Z",
    sessionId: "session-010",
  },
  {
    messageId: "msg-011",
    feedback: "helpful",
    query: "企業網路銀行維護時間是什麼時候？",
    answer: "企業網路銀行系統維護時間通常安排在每日凌晨2:00-4:00，維護期間暫停服務...",
    timestamp: "2024-08-28T20:45:00.000Z",
    sessionId: "session-011",
  },
  {
    messageId: "msg-012",
    feedback: "not-helpful",
    reason: "content-incomplete",
    query: "轉帳失敗錯誤代碼E001是什麼意思？",
    answer: "這是系統錯誤",
    timestamp: "2024-08-28T21:20:00.000Z",
    sessionId: "session-012",
  },
  {
    messageId: "msg-013",
    feedback: "helpful",
    query: "如何申請數位憑證？",
    answer: "申請數位憑證需要先準備相關文件，包括公司登記證明、負責人身分證明等...",
    timestamp: "2024-08-28T22:10:00.000Z",
    sessionId: "session-013",
  },
  {
    messageId: "msg-014",
    feedback: "not-helpful",
    reason: "irrelevant-answer",
    query: "企業網路銀行手續費如何計算？",
    answer: "請參考費用表",
    timestamp: "2024-08-28T23:30:00.000Z",
    sessionId: "session-014",
  },
  {
    messageId: "msg-015",
    feedback: "helpful",
    query: "如何開啟企業網路銀行簡訊通知？",
    answer: "開啟簡訊通知功能請至網路銀行設定頁面，選擇通知設定，勾選簡訊通知選項...",
    timestamp: "2024-08-27T09:15:00.000Z",
    sessionId: "session-015",
  },
  {
    messageId: "msg-016",
    feedback: "not-helpful",
    reason: "content-unclear",
    query: "什麼是金融XML憑證？",
    answer: "這是一種憑證格式",
    timestamp: "2024-08-27T10:45:00.000Z",
    sessionId: "session-016",
  },
  {
    messageId: "msg-017",
    feedback: "helpful",
    query: "企業網路銀行登入次數有限制嗎？",
    answer: "為了帳戶安全，企業網路銀行設有登入失敗次數限制，連續輸入錯誤密碼5次將暫時鎖定帳戶...",
    timestamp: "2024-08-27T11:30:00.000Z",
    sessionId: "session-017",
  },
  {
    messageId: "msg-018",
    feedback: "not-helpful",
    reason: "other",
    customReason: "需要更多實際操作步驟",
    query: "如何匯出交易明細？",
    answer: "可以匯出Excel格式",
    timestamp: "2024-08-27T12:20:00.000Z",
    sessionId: "session-018",
  },
  {
    messageId: "msg-019",
    feedback: "helpful",
    query: "企業網路銀行支援哪些轉帳方式？",
    answer: "企業網路銀行支援多種轉帳方式，包括約定轉帳、非約定轉帳、即時轉帳等...",
    timestamp: "2024-08-27T13:45:00.000Z",
    sessionId: "session-019",
  },
  {
    messageId: "msg-020",
    feedback: "not-helpful",
    reason: "wrong-url",
    query: "在哪裡下載讀卡機驅動程式？",
    answer: "請到官網下載",
    timestamp: "2024-08-27T14:30:00.000Z",
    sessionId: "session-020",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, feedback, reason, customReason, query, answer, sessionId } = body

    if (!messageId || !feedback || !query || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (feedback !== "helpful" && feedback !== "not-helpful") {
      return NextResponse.json({ error: "Invalid feedback value" }, { status: 400 })
    }

    if (feedback === "not-helpful" && reason) {
      const validReasons = ["content-unclear", "content-incomplete", "wrong-url", "irrelevant-answer", "other"]
      if (!validReasons.includes(reason)) {
        return NextResponse.json({ error: "Invalid reason value" }, { status: 400 })
      }
    }

    const feedbackData: FeedbackData = {
      messageId,
      feedback,
      reason,
      customReason,
      query,
      answer,
      timestamp: new Date().toISOString(),
      sessionId,
    }

    feedbackStorage.push(feedbackData)

    console.log(`[v0] Feedback received: ${feedback} for message ${messageId}`)
    if (reason) {
      console.log(`[v0] Feedback reason: ${reason}`)
    }
    console.log(`[v0] Total feedback entries: ${feedbackStorage.length}`)

    return NextResponse.json({
      success: true,
      message: "Feedback recorded successfully",
    })
  } catch (error) {
    console.error("Feedback API Error:", error)
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reason = searchParams.get("reason")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredFeedback = feedbackStorage

    // Filter by reason if specified
    if (reason && reason !== "all") {
      filteredFeedback = filteredFeedback.filter((f) => f.reason === reason)
    }

    // Filter by date range if specified
    if (startDate) {
      filteredFeedback = filteredFeedback.filter((f) => new Date(f.timestamp) >= new Date(startDate))
    }
    if (endDate) {
      filteredFeedback = filteredFeedback.filter((f) => new Date(f.timestamp) <= new Date(endDate))
    }

    const totalFeedback = filteredFeedback.length
    const helpfulCount = filteredFeedback.filter((f) => f.feedback === "helpful").length
    const notHelpfulCount = filteredFeedback.filter((f) => f.feedback === "not-helpful").length

    // Calculate reason statistics
    const reasonStats = {
      "content-unclear": filteredFeedback.filter((f) => f.reason === "content-unclear").length,
      "content-incomplete": filteredFeedback.filter((f) => f.reason === "content-incomplete").length,
      "wrong-url": filteredFeedback.filter((f) => f.reason === "wrong-url").length,
      "irrelevant-answer": filteredFeedback.filter((f) => f.reason === "irrelevant-answer").length,
      other: filteredFeedback.filter((f) => f.reason === "other").length,
    }

    // Get recent feedback entries for detailed view
    const recentFeedback = filteredFeedback
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50)

    return NextResponse.json({
      total: totalFeedback,
      helpful: helpfulCount,
      notHelpful: notHelpfulCount,
      helpfulPercentage: totalFeedback > 0 ? Math.round((helpfulCount / totalFeedback) * 100) : 0,
      reasonStats,
      recentFeedback,
      filters: {
        reason,
        startDate,
        endDate,
      },
    })
  } catch (error) {
    console.error("Feedback Stats API Error:", error)
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 })
  }
}
