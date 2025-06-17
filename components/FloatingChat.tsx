'use client'

import { useEffect, useState, useRef } from "react"
import { ChatMessage } from "./ChatMessage"

const chatMessages = [
  {
    message: "Hoy gasté $50.000 COP en el almuerzo con mis compañeros",
    isBot: false,
  },
  {
    message: "💰 Confirma tu transacción:\nMonto: $50.000 COP\nCategoría: Comida 🍔\nCuenta: Efectivo 💵\nDescripción: Almuerzo",
    isBot: true,
  },
  {
    message: "Sí",
    isBot: false,
  },
  {
    message: "Transacción registrada ✅",
    isBot: true,
  },
  {
    message: "🎤 Mensaje de voz (0:08)",
    isBot: false,
    isVoice: true
  },
  {
    message: "✅ He registrado un gasto de $35.000 COP en transporte. ¿Necesitas algo más?",
    isBot: true,
  }
]

export const FloatingChat = () => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [isTyping, setIsTyping] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [visibleMessages, isTyping])

  useEffect(() => {
    const showNextMessage = async () => {
      for (let i = 0; i < chatMessages.length; i++) {
        if (chatMessages[i].isBot) {
          setIsTyping(true)
          await new Promise(resolve => 
            setTimeout(resolve, Math.min(Math.max(chatMessages[i].message.length * 30, 1000), 2000))
          )
          setIsTyping(false)
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        setVisibleMessages(i + 1)
        if (i < chatMessages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }

    showNextMessage()

    return () => {
      setVisibleMessages(0)
      setIsTyping(false)
    }
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-4 bg-[#0D1D35]/30 backdrop-blur-sm rounded-2xl border border-white/10 h-[600px] overflow-hidden">
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/10">
        <div className="w-10 h-10 bg-[#9DFAD7] rounded-full flex items-center justify-center text-[#0D1D35] font-bold text-lg">
          F
        </div>
        <div>
          <div className="font-medium text-white text-lg">FinancIA</div>
          <div className="text-sm text-white/70">En línea</div>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="space-y-4 h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {chatMessages.slice(0, visibleMessages).map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.message}
            isBot={msg.isBot}
            isVoice={msg.isVoice}
            delay={0}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-message-in">
            <div className="bg-white/10 rounded-2xl p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/70 rounded-full animate-typing-1"></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-typing-2"></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-typing-3"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 