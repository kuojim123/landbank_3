"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface FeedbackReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onReasonSelect: (reason: string, customReason?: string) => void
  messageId: string
}

const reasonOptions = [
  {
    id: "content-unclear",
    label: "內容看不懂",
    description: "回答內容過於複雜或表達不清楚",
  },
  {
    id: "content-incomplete",
    label: "內容不完整",
    description: "回答缺少重要資訊或步驟",
  },
  {
    id: "wrong-url",
    label: "網址不正確",
    description: "提供的連結無法使用或錯誤",
  },
  {
    id: "irrelevant-answer",
    label: "答非所問",
    description: "回答與問題不相關或偏離主題",
  },
  {
    id: "other",
    label: "其他原因",
    description: "以上選項都不符合",
  },
]

export default function FeedbackReasonModal({ isOpen, onClose, onReasonSelect, messageId }: FeedbackReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [customReason, setCustomReason] = useState<string>("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  if (!isOpen) return null

  const handleReasonClick = (reasonId: string) => {
    setSelectedReason(reasonId)
    if (reasonId === "other") {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      // Automatically submit for predefined reasons
      onReasonSelect(reasonId)
      handleClose()
    }
  }

  const handleSubmitCustom = () => {
    if (customReason.trim()) {
      onReasonSelect(selectedReason, customReason.trim())
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedReason("")
    setCustomReason("")
    setShowCustomInput(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-background border border-border rounded-lg shadow-2xl w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-primary">請選擇沒有幫助的原因</h2>
          <button onClick={handleClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!showCustomInput ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">您的回饋將幫助我們改善服務品質</p>

              {reasonOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleReasonClick(option.id)}
                  className="w-full p-4 text-left bg-card hover:bg-muted border border-border rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md group"
                >
                  <div className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                    {option.label}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">請詳細說明問題：</p>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="請描述具體的問題..."
                className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                >
                  返回
                </button>
                <button
                  onClick={handleSubmitCustom}
                  disabled={!customReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  提交回饋
                </button>
              </div>
            </div>
          )}
        </div>

        {!showCustomInput && (
          <div className="flex justify-end p-6 pt-0">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
            >
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
