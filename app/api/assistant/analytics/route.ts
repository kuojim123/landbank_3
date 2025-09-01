import { type NextRequest, NextResponse } from "next/server"

interface RecommendationAnalytics {
  id: string
  recommendationText: string
  recommendationUrl: string
  context: string
  priority: string
  userQuery: string
  sessionId: string
  timestamp: string
  action: "viewed" | "clicked"
  messageId: string
}

const analyticsStorage: RecommendationAnalytics[] = [
  {
    id: "rec-001",
    recommendationText: "需要營運資金嗎？了解我們的中小企業貸款方案",
    recommendationUrl: "/business-loan",
    context: "enterprise_account_application",
    priority: "high",
    userQuery: "我的公司想申請企業網路銀行，請問該如何辦理？",
    sessionId: "session-001",
    timestamp: "2024-08-29T10:35:00.000Z",
    action: "viewed",
    messageId: "msg-001",
  },
  {
    id: "rec-002",
    recommendationText: "需要營運資金嗎？了解我們的中小企業貸款方案",
    recommendationUrl: "/business-loan",
    context: "enterprise_account_application",
    priority: "high",
    userQuery: "我的公司想申請企業網路銀行，請問該如何辦理？",
    sessionId: "session-001",
    timestamp: "2024-08-29T10:36:00.000Z",
    action: "clicked",
    messageId: "msg-001",
  },
  {
    id: "rec-003",
    recommendationText: "需要營運資金嗎？了解我們的中小企業貸款方案",
    recommendationUrl: "/business-loan",
    context: "enterprise_account_application",
    priority: "high",
    userQuery: "請問哪些公司或團體可以申請企業網路銀行？",
    sessionId: "session-002",
    timestamp: "2024-08-29T11:20:00.000Z",
    action: "viewed",
    messageId: "msg-002",
  },
  {
    id: "rec-004",
    recommendationText: "需要營運資金嗎？了解我們的中小企業貸款方案",
    recommendationUrl: "/business-loan",
    context: "enterprise_account_application",
    priority: "high",
    userQuery: "企業網路銀行的申請條件有哪些？",
    sessionId: "session-003",
    timestamp: "2024-08-28T14:45:00.000Z",
    action: "viewed",
    messageId: "msg-003",
  },
  {
    id: "rec-005",
    recommendationText: "需要營運資金嗎？了解我們的中小企業貸款方案",
    recommendationUrl: "/business-loan",
    context: "enterprise_account_application",
    priority: "high",
    userQuery: "企業網路銀行的申請條件有哪些？",
    sessionId: "session-003",
    timestamp: "2024-08-28T14:46:00.000Z",
    action: "clicked",
    messageId: "msg-003",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recommendationText, recommendationUrl, context, priority, userQuery, sessionId, action, messageId } = body

    if (!recommendationText || !recommendationUrl || !userQuery || !sessionId || !action || !messageId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (action !== "viewed" && action !== "clicked") {
      return NextResponse.json({ error: "Invalid action value" }, { status: 400 })
    }

    const analyticsData: RecommendationAnalytics = {
      id: `rec-${Date.now()}`,
      recommendationText,
      recommendationUrl,
      context: context || "unknown",
      priority: priority || "medium",
      userQuery,
      sessionId,
      timestamp: new Date().toISOString(),
      action,
      messageId,
    }

    analyticsStorage.push(analyticsData)

    console.log(`[v0] Recommendation analytics: ${action} - ${recommendationText}`)
    console.log(`[v0] Total analytics entries: ${analyticsStorage.length}`)

    return NextResponse.json({
      success: true,
      message: "Analytics recorded successfully",
    })
  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const context = searchParams.get("context")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const action = searchParams.get("action")

    let filteredAnalytics = analyticsStorage

    // Filter by context if specified
    if (context && context !== "all") {
      filteredAnalytics = filteredAnalytics.filter((a) => a.context === context)
    }

    // Filter by action if specified
    if (action && action !== "all") {
      filteredAnalytics = filteredAnalytics.filter((a) => a.action === action)
    }

    // Filter by date range if specified
    if (startDate) {
      filteredAnalytics = filteredAnalytics.filter((a) => new Date(a.timestamp) >= new Date(startDate))
    }
    if (endDate) {
      filteredAnalytics = filteredAnalytics.filter((a) => new Date(a.timestamp) <= new Date(endDate))
    }

    const totalViews = filteredAnalytics.filter((a) => a.action === "viewed").length
    const totalClicks = filteredAnalytics.filter((a) => a.action === "clicked").length
    const clickThroughRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0

    // Calculate recommendation performance by text
    const recommendationPerformance = filteredAnalytics.reduce(
      (acc, item) => {
        const key = item.recommendationText
        if (!acc[key]) {
          acc[key] = {
            text: item.recommendationText,
            url: item.recommendationUrl,
            context: item.context,
            priority: item.priority,
            views: 0,
            clicks: 0,
            ctr: 0,
          }
        }

        if (item.action === "viewed") {
          acc[key].views++
        } else if (item.action === "clicked") {
          acc[key].clicks++
        }

        acc[key].ctr = acc[key].views > 0 ? Math.round((acc[key].clicks / acc[key].views) * 100) : 0

        return acc
      },
      {} as Record<string, any>,
    )

    // Get recent analytics entries for detailed view
    const recentAnalytics = filteredAnalytics
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50)

    return NextResponse.json({
      totalViews,
      totalClicks,
      clickThroughRate,
      recommendationPerformance: Object.values(recommendationPerformance),
      recentAnalytics,
      filters: {
        context,
        startDate,
        endDate,
        action,
      },
    })
  } catch (error) {
    console.error("Analytics Stats API Error:", error)
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 })
  }
}
