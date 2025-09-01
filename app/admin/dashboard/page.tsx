"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BarChart3,
  MessageSquare,
  Users,
  TrendingUp,
  Database,
  Activity,
  Clock,
  CheckCircle,
  HelpCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardStats {
  totalQueries: number
  answeredQueries: number
  unansweredQueries: number
  totalFeedback: number
  satisfactionRate: number
  knowledgeBaseItems: number
  pendingFeedback: number
  activeUsers: number
}

const trendingData = [
  { date: "12/24", queries: 45 },
  { date: "12/25", queries: 32 },
  { date: "12/26", queries: 67 },
  { date: "12/27", queries: 89 },
  { date: "12/28", queries: 76 },
  { date: "12/29", queries: 95 },
  { date: "12/30", queries: 123 },
]

const popularQuestions = [
  { question: "如何申請企業網路銀行？", count: 156 },
  { question: "忘記登入密碼怎麼辦？", count: 134 },
  { question: "轉帳限額是多少？", count: 98 },
  { question: "如何設定約定轉入帳號？", count: 87 },
  { question: "SSL憑證如何安裝？", count: 76 },
  { question: "手機版如何使用？", count: 65 },
  { question: "系統維護時間？", count: 54 },
  { question: "如何修改個人資料？", count: 43 },
  { question: "交易記錄如何查詢？", count: 38 },
  { question: "客服聯絡方式？", count: 32 },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQueries: 1247,
    answeredQueries: 1089,
    unansweredQueries: 158,
    totalFeedback: 892,
    satisfactionRate: 87.5,
    knowledgeBaseItems: 45,
    pendingFeedback: 12,
    activeUsers: 156,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">管理儀表板</h1>
            <p className="text-muted-foreground mt-1">阿福e助理系統總覽</p>
          </div>
          <div className="text-sm text-muted-foreground">最後更新：{new Date().toLocaleString("zh-TW")}</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總查詢次數</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">累計用戶查詢</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已解答問題</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.answeredQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                成功解答 ({((stats.answeredQueries / stats.totalQueries) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">無法解答問題</CardTitle>
              <HelpCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.unansweredQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                需要改進 ({((stats.unansweredQueries / stats.totalQueries) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">用戶滿意度</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.satisfactionRate}%</div>
              <p className="text-xs text-muted-foreground">正面回饋率</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">知識庫條目</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.knowledgeBaseItems}</div>
              <p className="text-xs text-muted-foreground">可用問答條目</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待處理回饋</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingFeedback}</div>
              <p className="text-xs text-muted-foreground">需要處理</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活躍用戶</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">本月活躍</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總回饋數</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalFeedback}</div>
              <p className="text-xs text-muted-foreground">累計回饋</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>近期查詢量趨勢</CardTitle>
              <CardDescription>過去7天的查詢量變化</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="queries" stroke="#34C759" strokeWidth={2} dot={{ fill: "#34C759" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>熱門問題排行榜</CardTitle>
              <CardDescription>用戶最常詢問的問題 (Top 10)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {popularQuestions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-left flex-1">{item.question}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用管理功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/feedback">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  處理用戶回饋
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  查看分析報告
                </Button>
              </Link>
              <Link href="/admin/knowledge">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="w-4 h-4 mr-2" />
                  管理知識庫
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系統狀態</CardTitle>
              <CardDescription>服務運行狀況</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI 助理服務</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">正常</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">知識庫 API</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">正常</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">回饋系統</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">正常</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
