"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"
import FeedbackReasonModal from "./feedback-reason-modal"

interface QuickAction {
  text: string
  url?: string
  action?: string
}

interface Recommendation {
  text: string
  url: string
  priority: string
  context: string
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  quickActions?: QuickAction[]
  feedback?: "helpful" | "not-helpful" | null
  query?: string // Added to store original query for feedback
  recommendations?: Recommendation[]
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedQuestions, setRecommendedQuestions] = useState<Set<string>>(new Set())
  const [clickedRecommendations, setClickedRecommendations] = useState<Set<string>>(new Set())
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean
    messageId: string
  }>({ isOpen: false, messageId: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateSmartRecommendations = (
    userQuery: string,
    excludeQuestions: Set<string> = new Set(),
  ): QuickAction[] => {
    const query = userQuery.toLowerCase()

    const filteredQuestions = new Set(["已將憑證成功啟用，但客戶端電腦毀損或欲在其他電腦上進行簽章，該如何處理？"])

    const knowledgeBaseRecommendations: { [key: string]: QuickAction[] } = {
      login: [
        { text: "遺忘網路銀行密碼或被鎖住時，該如何重置？" },
        { text: "如何變更企業網路銀行登入密碼？" },
        { text: "使用者登入企業網路銀行時，為何會出現「交易逾時，請稍候再試」訊息？" },
        { text: "第一次登入企業網路銀行時，需要注意什麼？" },
      ],
      transfer: [
        { text: "SSL轉帳的限額是多少？" },
        { text: "如何新增約定轉入帳號？" },
        { text: "非約定轉帳的限額為何？（FXML機制）" },
        { text: "轉帳交易失敗時該如何處理？" },
        { text: "如何查詢轉帳交易記錄？" },
      ],
      account: [
        { text: "我的公司想申請企業網路銀行，請問該如何辦理？" },
        { text: "請問哪些公司或團體可以申請企業網路銀行？" },
        { text: "不再使用企業網路銀行時，該如何註銷服務？" },
        { text: "企業網路銀行的申請條件有哪些？" },
      ],
      certificate: [
        { text: "何謂金融XML憑證(FXML憑證)？我是否需要申請？" },
        { text: "憑證過期未申請展期，欲繼續使用憑證時應如何辦理？" },
        { text: "已將憑證成功啟用，但客戶端電腦毀損或欲在其他電腦上進行簽章，該如何處理？" },
        { text: "憑證安裝失敗時該如何處理？" },
        { text: "如何備份和還原憑證？" },
      ],
      system: [
        { text: "第一次使用企業網路銀行，需要安裝什麼軟體嗎？" },
        {
          text: "登入企業網路銀行後，畫面呈現空白，或是出現「6350錯誤-您已有使用其他帳號登入企業網路銀行,請將已登入視窗關閉後再行登入」？",
        },
        { text: "啟用FXML憑證時，對作業系統及瀏覽器版本有何要求？" },
        { text: "系統維護時間是什麼時候？" },
        { text: "支援哪些瀏覽器版本？" },
      ],
      service: [
        { text: "何謂電子郵件通知服務？" },
        { text: "何謂SSL轉帳服務？" },
        { text: "網路轉帳是否安全？" },
        { text: "企業網路銀行提供哪些服務？" },
        { text: "如何設定交易通知？" },
      ],
      security: [
        { text: "存戶應如何加強網路交易安全？" },
        { text: "網路上的交易資料，會不會被盜取或是被纂改？" },
        { text: "如果申請多家銀行的憑證並放在電腦內，會不會造成交易錯亂的困擾，或是產生其他後遺症？" },
        { text: "如何防範網路釣魚攻擊？" },
        { text: "密碼設定有什麼安全建議？" },
      ],
    }

    let recommendations: QuickAction[] = []

    if (query.includes("登入") || query.includes("密碼") || query.includes("帳號")) {
      recommendations = knowledgeBaseRecommendations.login

      const isPasswordResetQuery =
        query.includes("重設") ||
        query.includes("重置") ||
        query.includes("忘記") ||
        query.includes("遺忘") ||
        query.includes("鎖住") ||
        query.includes("變更")

      if (isPasswordResetQuery) {
        // Filter out one of the similar password questions to avoid redundancy
        recommendations = recommendations.filter((rec) => rec.text !== "如何變更企業網路銀行登入密碼？")
      }
    } else if (query.includes("轉帳") || query.includes("匯款") || query.includes("付款") || query.includes("限額")) {
      recommendations = knowledgeBaseRecommendations.transfer
    } else if (
      query.includes("申請") ||
      query.includes("開戶") ||
      query.includes("註銷") ||
      query.includes("企業網銀")
    ) {
      recommendations = knowledgeBaseRecommendations.account
    } else if (query.includes("憑證") || query.includes("讀卡機") || query.includes("pin") || query.includes("fxml")) {
      recommendations = knowledgeBaseRecommendations.certificate
    } else if (
      query.includes("系統") ||
      query.includes("維護") ||
      query.includes("瀏覽器") ||
      query.includes("安裝") ||
      query.includes("軟體")
    ) {
      recommendations = knowledgeBaseRecommendations.system
    } else if (query.includes("服務") || query.includes("功能") || query.includes("通知")) {
      recommendations = knowledgeBaseRecommendations.service
    } else if (query.includes("安全") || query.includes("風險") || query.includes("保護")) {
      recommendations = knowledgeBaseRecommendations.security
    } else {
      recommendations = [
        ...knowledgeBaseRecommendations.account.slice(0, 2),
        ...knowledgeBaseRecommendations.login.slice(0, 2),
        ...knowledgeBaseRecommendations.transfer.slice(0, 1),
      ]
    }

    const allExcludedQuestions = new Set([...excludeQuestions, ...filteredQuestions])
    const filteredRecommendations = recommendations.filter((rec) => !allExcludedQuestions.has(rec.text))
    return filteredRecommendations.slice(0, 3)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const currentQuery = inputValue
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/assistant/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: currentQuery }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.answer_html,
          timestamp: new Date(),
          quickActions: data.quick_actions || [],
          feedback: null,
          query: currentQuery,
          recommendations: data.recommendations || [],
        }

        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "<p>抱歉，系統暫時無法回應。請稍後再試。</p>",
        timestamp: new Date(),
        quickActions: [],
        feedback: null,
        query: currentQuery,
        recommendations: [],
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: QuickAction) => {
    console.log("[v0] Quick action clicked:", action)

    if (action.text) {
      console.log("[v0] Processing quick action text:", action.text)

      setRecommendedQuestions((prev) => new Set([...prev, action.text]))

      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: action.text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        console.log("[v0] Sending API request for quick action")
        const response = await fetch("/api/assistant/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: action.text }),
        })

        const data = await response.json()
        console.log("[v0] API response for quick action:", data)

        if (response.ok) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: data.answer_html,
            timestamp: new Date(),
            quickActions: data.quick_actions || [],
            feedback: null,
            query: action.text,
            recommendations: data.recommendations || [],
          }

          console.log("[v0] Adding assistant message:", assistantMessage)
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          console.error("[v0] API error:", data.error)
          throw new Error(data.error || "Failed to get response")
        }
      } catch (error) {
        console.error("[v0] Quick action error:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "<p>抱歉，系統暫時無法回應。請稍後再試。</p>",
          timestamp: new Date(),
          quickActions: [],
          feedback: null,
          query: action.text,
          recommendations: [],
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
        console.log("[v0] Quick action processing completed")
      }
    }

    if (!action.text && action.url) {
      window.open(action.url, "_blank")
    }
  }

  const handleFeedback = async (messageId: string, feedback: "helpful" | "not-helpful") => {
    if (feedback === "not-helpful") {
      setFeedbackModal({ isOpen: true, messageId })
      return
    }

    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)))

    const message = messages.find((msg) => msg.id === messageId)
    if (!message || !message.query) return

    try {
      await fetch("/api/assistant/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          feedback,
          query: message.query,
          answer: message.content,
        }),
      })

      console.log(`[v0] Feedback sent: ${feedback} for message ${messageId}`)
    } catch (error) {
      console.error("Failed to send feedback:", error)
    }
  }

  const handleFeedbackReason = async (reason: string, customReason?: string) => {
    const messageId = feedbackModal.messageId

    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: "not-helpful" } : msg)))

    const message = messages.find((msg) => msg.id === messageId)
    if (!message || !message.query) return

    try {
      await fetch("/api/assistant/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          feedback: "not-helpful",
          reason,
          customReason,
          query: message.query,
          answer: message.content,
          sessionId: `session_${Date.now()}`,
        }),
      })

      console.log(`[v0] Detailed feedback sent: not-helpful with reason: ${reason} for message ${messageId}`)
    } catch (error) {
      console.error("Failed to send detailed feedback:", error)
    }
  }

  const handleCloseFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, messageId: "" })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRecommendationClick = (recommendation: Recommendation) => {
    setClickedRecommendations((prev) => new Set([...prev, recommendation.text]))

    const message = messages.find((msg) => msg.recommendations?.includes(recommendation))
    if (message) {
      fetch("/api/assistant/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recommendationText: recommendation.text,
          recommendationUrl: recommendation.url,
          context: recommendation.context,
          priority: recommendation.priority,
          userQuery: message.query,
          sessionId: `session_${Date.now()}`,
          action: "clicked",
          messageId: message.id,
        }),
      }).catch((error) => {
        console.error("Failed to track recommendation click:", error)
      })
    }

    const smeUrl = "https://www.landbank.com.tw/Category/Items/%E4%B8%AD%E5%B0%8F%E4%BC%81%E6%A5%AD%E8%B2%B8%E6%AC%BE"
    const targetUrl =
      recommendation.text.includes("中小企業貸款") ||
      recommendation.text.includes("營運資金") ||
      recommendation.text.includes("企業貸款")
        ? smeUrl
        : recommendation.url

    window.open(targetUrl, "_blank")
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed bottom-24 right-6 w-[360px] h-[540px] bg-white border border-gray-200 shadow-2xl flex flex-col z-50"
        style={{ borderRadius: "8px" }}
      >
        <div
          className="h-[50px] flex items-center justify-between px-4 text-white"
          style={{ backgroundColor: "#34C759", borderRadius: "8px 8px 0 0" }}
        >
          <div className="flex items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/00000000-0000-1111-0000-000000000000-WZAGUmbOK6HQOEUzlf7h11BEf6lzRk.png"
              alt="阿福e助理 Mascot"
              className="h-8 w-8 mr-2"
            />
            <h3 className="font-semibold text-base">阿福e助理</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-sm">您好！我是阿福e助理</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
              <div className="max-w-[280px]">
                <div
                  className={cn(
                    "px-3 py-2 text-sm",
                    message.type === "user"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-white border border-gray-200 text-gray-900",
                  )}
                  style={{ borderRadius: "8px" }}
                >
                  {message.type === "assistant" ? (
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>

                {message.type === "assistant" && message.recommendations && message.recommendations.length > 0 && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-sm mr-1">🎯</span>
                      <h4 className="text-sm font-medium text-gray-700">為您推薦</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {message.recommendations
                        .filter((recommendation) => !clickedRecommendations.has(recommendation.text))
                        .slice(0, 3)
                        .map((recommendation, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRecommendationClick(recommendation)}
                            className="justify-start min-h-8 px-3 py-2 text-xs text-gray-600 hover:text-blue-500 hover:bg-white/80 border border-transparent hover:border-blue-200 transition-all duration-200 whitespace-normal text-left leading-relaxed"
                            style={{ borderRadius: "6px" }}
                          >
                            <span className="text-blue-500 mr-2 flex-shrink-0">💼</span>
                            <span className="break-words">{recommendation.text}</span>
                          </Button>
                        ))}
                    </div>
                  </div>
                )}

                {message.type === "assistant" &&
                  message.query &&
                  (!message.recommendations || message.recommendations.length === 0) && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg">
                      <div className="flex items-center mb-3">
                        <span className="text-sm mr-2 flex-shrink-0">💡</span>
                        <h4 className="text-sm font-medium text-gray-700">阿福猜您也想知道</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {generateSmartRecommendations(
                          message.query,
                          new Set([...recommendedQuestions, ...clickedRecommendations]),
                        ).map((recommendation, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuickAction(recommendation)}
                            className="justify-start min-h-8 px-3 py-2 text-xs text-gray-600 hover:text-green-500 hover:bg-white/80 border border-transparent hover:border-green-200 transition-all duration-200 whitespace-normal text-left leading-relaxed"
                            style={{ borderRadius: "6px" }}
                          >
                            <span className="text-green-500 mr-2 flex-shrink-0">→</span>
                            <span className="break-words">{recommendation.text}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                {message.type === "assistant" && (
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(message.id, "helpful")}
                      className={cn(
                        "h-6 px-2 text-xs transition-colors",
                        message.feedback === "helpful"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "text-gray-500 hover:text-green-600 hover:bg-green-50",
                      )}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      有幫助
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(message.id, "not-helpful")}
                      className={cn(
                        "h-6 px-2 text-xs transition-colors",
                        message.feedback === "not-helpful"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50",
                      )}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      無幫助
                    </Button>
                  </div>
                )}

                {message.type === "assistant" && message.feedback && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      {message.feedback === "helpful" ? "感謝您的回饋！" : "我們會持續改進服務品質。"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[280px]">
                <div
                  className="bg-white border border-gray-200 px-3 py-2 text-sm text-gray-500"
                  style={{ borderRadius: "8px" }}
                >
                  正在思考中...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="h-[60px] border-t border-gray-200 p-3 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="請輸入您的問題..."
            className="flex-1 text-sm"
            style={{ borderRadius: "8px" }}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-9 w-9 p-0 text-white hover:opacity-90"
            style={{ backgroundColor: "#34C759", borderRadius: "8px" }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FeedbackReasonModal
        isOpen={feedbackModal.isOpen}
        onClose={handleCloseFeedbackModal}
        onReasonSelect={handleFeedbackReason}
        messageId={feedbackModal.messageId}
      />
    </>
  )
}
