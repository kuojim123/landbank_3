"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
} from "lucide-react"

interface FeedbackItem {
  messageId: string
  feedback: "helpful" | "not-helpful"
  reason?: string
  customReason?: string
  query: string
  answer: string
  timestamp: string
  sessionId?: string
  status?: "pending" | "reviewed" | "resolved"
  adminNotes?: string
}

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
  recentFeedback: FeedbackItem[]
}

const reasonLabels = {
  "content-unclear": "內容看不懂",
  "content-incomplete": "內容不完整",
  "wrong-url": "網址不正確",
  "irrelevant-answer": "答非所問",
  other: "其他原因",
}

const statusLabels = {
  pending: "待處理",
  reviewed: "已檢視",
  resolved: "已解決",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
}

export default function FeedbackManagementPage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [feedbackFilter, setFeedbackFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  const fetchFeedbackData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/assistant/feedback")
      const data = await response.json()

      // Add mock status for demonstration
      const enhancedFeedback = data.recentFeedback.map((item: FeedbackItem) => ({
        ...item,
        status: item.status || (Math.random() > 0.7 ? "resolved" : Math.random() > 0.5 ? "reviewed" : "pending"),
        adminNotes: item.adminNotes || "",
      }))

      setFeedbackData({
        ...data,
        recentFeedback: enhancedFeedback,
      })
    } catch (error) {
      console.error("Failed to fetch feedback data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbackData()
  }, [])

  const filteredFeedback =
    feedbackData?.recentFeedback.filter((item) => {
      const matchesSearch =
        item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesFeedback = feedbackFilter === "all" || item.feedback === feedbackFilter

      return matchesSearch && matchesStatus && matchesFeedback
    }) || []

  const updateFeedbackStatus = async (messageId: string, status: string, notes?: string) => {
    // Mock API call - in real implementation, this would update the backend
    setFeedbackData((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        recentFeedback: prev.recentFeedback.map((item) =>
          item.messageId === messageId
            ? { ...item, status: status as any, adminNotes: notes || item.adminNotes }
            : item,
        ),
      }
    })

    console.log(`[v0] Updated feedback ${messageId} status to ${status}`)
  }

  const handleViewDetails = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback)
    setAdminNotes(feedback.adminNotes || "")
  }

  const handleSaveNotes = () => {
    if (selectedFeedback) {
      updateFeedbackStatus(selectedFeedback.messageId, selectedFeedback.status || "reviewed", adminNotes)
      setSelectedFeedback({ ...selectedFeedback, adminNotes })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!feedbackData) return null

  const pendingCount = filteredFeedback.filter((item) => item.status === "pending").length
  const reviewedCount = filteredFeedback.filter((item) => item.status === "reviewed").length
  const resolvedCount = filteredFeedback.filter((item) => item.status === "resolved").length

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">回饋管理系統</h1>
            <p className="text-muted-foreground mt-1">管理和跟進用戶回饋</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待處理</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">需要處理的回饋</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已檢視</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{reviewedCount}</div>
              <p className="text-xs text-muted-foreground">已檢視的回饋</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已解決</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
              <p className="text-xs text-muted-foreground">已解決的回饋</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總計</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{filteredFeedback.length}</div>
              <p className="text-xs text-muted-foreground">總回饋數量</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              篩選和搜尋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">搜尋</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="搜尋問題或回答..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">處理狀態</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部狀態</SelectItem>
                    <SelectItem value="pending">待處理</SelectItem>
                    <SelectItem value="reviewed">已檢視</SelectItem>
                    <SelectItem value="resolved">已解決</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">回饋類型</label>
                <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部類型</SelectItem>
                    <SelectItem value="helpful">有幫助</SelectItem>
                    <SelectItem value="not-helpful">無幫助</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setFeedbackFilter("all")
                  }}
                  className="w-full"
                >
                  重置篩選
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle>回饋列表</CardTitle>
            <CardDescription>共 {filteredFeedback.length} 筆回饋記錄</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div key={item.messageId} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={item.feedback === "helpful" ? "default" : "destructive"}>
                          {item.feedback === "helpful" ? (
                            <>
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              有幫助
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              無幫助
                            </>
                          )}
                        </Badge>
                        <Badge className={statusColors[item.status || "pending"]}>
                          {statusLabels[item.status || "pending"]}
                        </Badge>
                        {item.reason && (
                          <Badge variant="outline">{reasonLabels[item.reason as keyof typeof reasonLabels]}</Badge>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">問題：{item.query}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          回答：{item.answer.replace(/<[^>]*>/g, "")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleString("zh-TW")}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.sessionId || "匿名用戶"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>
                            <Eye className="w-4 h-4 mr-1" />
                            詳情
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>回饋詳情</DialogTitle>
                            <DialogDescription>查看和管理用戶回饋</DialogDescription>
                          </DialogHeader>
                          {selectedFeedback && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">回饋內容</TabsTrigger>
                                <TabsTrigger value="management">管理操作</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4">
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium">用戶問題</label>
                                    <p className="text-sm bg-muted p-3 rounded-md mt-1">{selectedFeedback.query}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">系統回答</label>
                                    <div
                                      className="text-sm bg-muted p-3 rounded-md mt-1"
                                      dangerouslySetInnerHTML={{ __html: selectedFeedback.answer }}
                                    />
                                  </div>
                                  {selectedFeedback.reason && (
                                    <div>
                                      <label className="text-sm font-medium">問題原因</label>
                                      <p className="text-sm bg-muted p-3 rounded-md mt-1">
                                        {reasonLabels[selectedFeedback.reason as keyof typeof reasonLabels]}
                                      </p>
                                    </div>
                                  )}
                                  {selectedFeedback.customReason && (
                                    <div>
                                      <label className="text-sm font-medium">自訂原因</label>
                                      <p className="text-sm bg-muted p-3 rounded-md mt-1">
                                        {selectedFeedback.customReason}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                              <TabsContent value="management" className="space-y-4">
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">處理狀態</label>
                                    <Select
                                      value={selectedFeedback.status || "pending"}
                                      onValueChange={(value) => updateFeedbackStatus(selectedFeedback.messageId, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">待處理</SelectItem>
                                        <SelectItem value="reviewed">已檢視</SelectItem>
                                        <SelectItem value="resolved">已解決</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">管理員備註</label>
                                    <Textarea
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      placeholder="輸入處理備註..."
                                      rows={4}
                                    />
                                  </div>
                                  <Button onClick={handleSaveNotes} className="w-full">
                                    儲存備註
                                  </Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={item.status || "pending"}
                        onValueChange={(value) => updateFeedbackStatus(item.messageId, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">待處理</SelectItem>
                          <SelectItem value="reviewed">已檢視</SelectItem>
                          <SelectItem value="resolved">已解決</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {item.adminNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-sm text-blue-800">
                        <strong>管理員備註：</strong>
                        {item.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {filteredFeedback.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>沒有找到符合條件的回饋記錄</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
