"use client"

import { useState } from "react"
import { ChatWindow } from "./chat-window"
import { ChatTriggerButton } from "./chat-trigger-button"

export function AfuAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <ChatTriggerButton isOpen={isOpen} onClick={toggleChat} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
