"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

interface KnowledgeItem {
  id: number
  category: string
  question: string
  answer: string
  tags: string[]
  status: "published" | "draft" | "pending"
  lastModified: string
}

interface KnowledgeFormData {
  category: string
  question: string
  answer: string
  tags: string
  status: "published" | "draft" | "pending"
}

export default function KnowledgeManagementPage() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [formData, setFormData] = useState<KnowledgeFormData>({
    category: "",
    question: "",
    answer: "",
    tags: "",
    status: "draft",
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockData: KnowledgeItem[] = [
      {
        id: 1,
        category: "帳號申請與設定",
        question: "如何申請企業網路銀行？",
        answer: "<p>申請企業網路銀行需要準備以下文件：<br/>1. 公司營業登記證<br/>2. 負責人身分證<br/>3. 公司大小章</p>",
        tags: ["申請", "企業", "網路銀行"],
        status: "published",
        lastModified: "2024-01-15",
      },
      {
        id: 2,
        category: "網路銀行服務與管理",
        question: "如何設定轉帳限額？",
        answer: "<p>轉帳限額設定步驟：<br/>1. 登入企業網路銀行<br/>2. 進入帳戶管理<br/>3. 選擇轉帳限額設定</p>",
        tags: ["轉帳", "限額", "設定"],
        status: "published",
        lastModified: "2024-01-14",
      },
      {
        id: 3,
        category: "操作問題",
        question: "忘記密碼怎麼辦？",
        answer:
          "<p>忘記密碼處理方式：<br/>1. 點擊登入頁面的「忘記密碼」<br/>2. 輸入帳號和驗證碼<br/>3. 按照系統指示重設密碼</p>",
        tags: ["密碼", "忘記", "重設"],
        status: "draft",
        lastModified: "2024-01-13",
      },
    ]

    setTimeout(() => {
      setKnowledgeItems(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = [
    "all",
    "帳號申請與設定",
    "網路銀行服務與管理",
    "SSL轉帳服務及轉帳限額",
    "金融XML憑證服務",
    "約定轉入帳號服務",
    "非約定轉入帳戶轉帳服務",
    "網路交易安全性說明",
    "操作問題",
  ]

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "已發布"
      case "draft":
        return "草稿"
      case "pending":
        return "待審核"
      default:
        return "未知"
    }
  }

  const handleAddItem = () => {
    const newItem: KnowledgeItem = {
      id: Math.max(...knowledgeItems.map((item) => item.id)) + 1,
      category: formData.category,
      question: formData.question,
      answer: formData.answer,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      status: formData.status,
      lastModified: new Date().toISOString().split("T")[0],
    }
    setKnowledgeItems([...knowledgeItems, newItem])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditItem = () => {
    if (!editingItem) return
    const updatedItems = knowledgeItems.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            category: formData.category,
            question: formData.question,
            answer: formData.answer,
            tags: formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
            status: formData.status,
            lastModified: new Date().toISOString().split("T")[0],
          }
        : item,
    )
    setKnowledgeItems(updatedItems)
    setIsEditDialogOpen(false)
    setEditingItem(null)
    resetForm()
  }

  const handleDeleteItem = (id: number) => {
    setKnowledgeItems(knowledgeItems.filter((item) => item.id !== id))
  }

  const openEditDialog = (item: KnowledgeItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
      tags: item.tags.join(", "),
      status: item.status,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      category: "",
      question: "",
      answer: "",
      tags: "",
      status: "draft",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">知識庫管理</h1>
          <p className="text-gray-600">管理AI助理的問答內容</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              新增問答
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新增問答內容</DialogTitle>
              <DialogDescription>請填寫完整的問答資訊，包含問題、答案、分類和標籤。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">分類</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="question">問題</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="輸入問題內容"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">答案 (支援HTML格式)</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="輸入答案內容，可使用HTML標籤"
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">標籤 (用逗號分隔)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="例如：申請, 企業, 網路銀行"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">狀態</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "published" | "draft" | "pending") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="pending">待審核</SelectItem>
                    <SelectItem value="published">已發布</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddItem} className="bg-green-600 hover:bg-green-700">
                新增
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜尋問題或標籤..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "所有分類" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>問答列表 ({filteredItems.length} 項)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>問題</TableHead>
                <TableHead>分類</TableHead>
                <TableHead>標籤</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>最後修改</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={item.question}>
                      {item.question}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{item.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="查看">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)} title="編輯">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title="刪除">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除</AlertDialogTitle>
                            <AlertDialogDescription>
                              您確定要刪除這個問答項目嗎？此操作無法復原。
                              <br />
                              <strong>問題：{item.question}</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              確認刪除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">沒有找到符合條件的問答內容</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>編輯問答內容</DialogTitle>
            <DialogDescription>修改問答資訊，包含問題、答案、分類和標籤。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">分類</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-question">問題</Label>
              <Input
                id="edit-question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="輸入問題內容"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-answer">答案 (支援HTML格式)</Label>
              <Textarea
                id="edit-answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="輸入答案內容，可使用HTML標籤"
                rows={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">標籤 (用逗號分隔)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="例如：申請, 企業, 網路銀行"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">狀態</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "published" | "draft" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="pending">待審核</SelectItem>
                  <SelectItem value="published">已發布</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditItem} className="bg-green-600 hover:bg-green-700">
              儲存變更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
