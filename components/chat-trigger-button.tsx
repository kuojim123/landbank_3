"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

interface ChatTriggerButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatTriggerButton({ isOpen, onClick }: ChatTriggerButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg text-white hover:shadow-xl transition-all duration-200"
      style={{ backgroundColor: "#34C759" }}
    >
      {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
    </Button>
  )
}
