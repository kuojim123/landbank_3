"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Filter, Download } from "lucide-react"

interface FeedbackStats {
  total: number
  helpful: number
  notHelpful: number
  helpfulPercentage: number
  reasonStats: {
    "content-unclear": number
    "content-incomplete": number
    "wrong-url": number
    "irrelevant-answer": number
    other: number
  }
  recentFeedback: Array<{
    messageId: string
    feedback: "helpful" | "not-helpful"
    reason?: string
    customReason?: string
    query: string
    answer: string
    timestamp: string
  }>
  filters: {
    reason?: string
    startDate?: string
    endDate?: string
  }
}

const reasonLabels = {
  "content-unclear": "內容看不懂",
  "content-incomplete": "內容不完整",
  "wrong-url": "網址不正確",
  "irrelevant-answer": "答非所問",
  other: "其他原因",
}

const COLORS = ["#34C759", "#A5D6A7", "#4caf50", "#388e3c", "#c8e6c9"]

export default function AnalyticsPage() {
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [selectedReason, setSelectedReason] = useState("all")

  const [negativeRankingData] = useState([
    { question: "如何申請企業網路銀行？", negativeCount: 23, totalCount: 156, percentage: 14.7 },
    { question: "忘記密碼怎麼辦？", negativeCount: 18, totalCount: 134, percentage: 13.4 },
    { question: "SSL憑證如何安裝？", negativeCount: 15, totalCount: 76, percentage: 19.7 },
    { question: "轉帳限額是多少？", negativeCount: 12, totalCount: 98, percentage: 12.2 },
    { question: "如何設定約定轉入帳號？", negativeCount: 10, totalCount: 87, percentage: 11.5 },
    { question: "手機版如何使用？", negativeCount: 8, totalCount: 65, percentage: 12.3 },
    { question: "系統維護時間？", negativeCount: 7, totalCount: 54, percentage: 13.0 },
    { question: "如何修改個人資料？", negativeCount: 5, totalCount: 43, percentage: 11.6 },
  ])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedReason !== "all") params.append("reason", selectedReason)
      if (dateRange.startDate) params.append("startDate", dateRange.startDate)
      if (dateRange.endDate) params.append("endDate", dateRange.endDate)

      const response = await fetch(`/api/assistant/feedback?${params}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch feedback stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [selectedReason, dateRange])

  const handleDateRangeChange = (field: "startDate" | "endDate", value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }))
  }

  const exportData = () => {
    if (!stats) return

    const csvContent = [
      ["Message ID", "Feedback", "Reason", "Query", "Timestamp"],
      ...stats.recentFeedback.map((item) => [
        item.messageId,
        item.feedback,
        item.reason ? reasonLabels[item.reason as keyof typeof reasonLabels] : "",
        item.query.replace(/,/g, ";"), // Escape commas
        item.timestamp,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `feedback-analytics-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const reasonChartData = [
    { name: "內容看不懂", value: 45, color: "#ff6b6b" },
    { name: "內容不完整", value: 32, color: "#ffa726" },
    { name: "答非所問", value: 28, color: "#66bb6a" },
    { name: "網址不正確", value: 18, color: "#ffca28" },
    { name: "其他原因", value: 12, color: "#42a5f5" },
  ]

  const satisfactionData = [
    { name: "有幫助", value: stats.helpful, color: "#34C759" },
    { name: "無幫助", value: stats.notHelpful, color: "#ff6b6b" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">回饋分析儀表板</h1>
            <p className="text-muted-foreground mt-1">阿福e助理服務品質分析</p>
          </div>
          <Button onClick={exportData} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            匯出數據
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              篩選條件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">原因類別</label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部原因</SelectItem>
                    {Object.entries(reasonLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">開始日期</label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">結束日期</label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateRange({ startDate: "", endDate: "" })
                    setSelectedReason("all")
                  }}
                  className="w-full"
                >
                  重置篩選
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總回饋數</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground">累計回饋次數</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">有幫助</CardTitle>
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.helpful}</div>
              <p className="text-xs text-muted-foreground">正面回饋</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">無幫助</CardTitle>
              <ThumbsDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.notHelpful}</div>
              <p className="text-xs text-muted-foreground">負面回饋</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">滿意度</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.helpfulPercentage}%</div>
              <p className="text-xs text-muted-foreground">用戶滿意度</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>滿意度分布</CardTitle>
              <CardDescription>用戶回饋滿意度比例</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>問題原因分析</CardTitle>
              <CardDescription>無幫助回饋的具體原因統計</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reasonChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#34C759" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Negative Feedback Ranking Section */}
        <Card>
          <CardHeader>
            <CardTitle>負面回饋排行榜</CardTitle>
            <CardDescription>需要優先改進的問答內容（按負面回饋數量排序）</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {negativeRankingData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{item.question}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>負面回饋：{item.negativeCount} 次</span>
                        <span>總回饋：{item.totalCount} 次</span>
                        <Badge variant="destructive" className="text-xs">
                          {item.percentage}% 不滿意
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      查看詳情
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      優化內容
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">優化建議</h4>
                  <p className="text-sm text-yellow-700">
                    建議優先處理負面回饋率超過15%的問答內容，檢查答案的完整性、準確性和易懂程度。
                    可以考慮添加更多詳細說明、圖片或步驟指引來改善用戶體驗。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback Table */}
        <Card>
          <CardHeader>
            <CardTitle>最近回饋記錄</CardTitle>
            <CardDescription>最新的50筆用戶回饋詳情</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 font-medium">時間</th>
                    <th className="text-left p-2 font-medium">問題</th>
                    <th className="text-left p-2 font-medium">回饋</th>
                    <th className="text-left p-2 font-medium">原因</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentFeedback.slice(0, 10).map((item, index) => (
                    <tr key={item.messageId} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="p-2 text-muted-foreground">{new Date(item.timestamp).toLocaleString("zh-TW")}</td>
                      <td className="p-2 max-w-xs truncate" title={item.query}>
                        {item.query}
                      </td>
                      <td className="p-2">
                        <Badge variant={item.feedback === "helpful" ? "default" : "destructive"}>
                          {item.feedback === "helpful" ? "有幫助" : "無幫助"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {item.reason ? (
                          <span className="text-sm text-muted-foreground">
                            {reasonLabels[item.reason as keyof typeof reasonLabels]}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
