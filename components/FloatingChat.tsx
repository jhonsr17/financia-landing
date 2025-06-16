'use client'

import { useEffect, useState } from "react"
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
    message: "¿Qué tal estuvo mi fin de semana en gastos? 🤔",
    isBot: false,
  },
  {
    message: "🎉 Wey, tu fin de semana costó $200.000 COP en fiestas... Te recomiendo que le bajes un poquito 😅🍻 ¿O quieres quebrar?",
    isBot: true,
  }
]

export const FloatingChat = () => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < chatMessages.length) {
          return prev + 1
        }
        clearInterval(interval)
        return prev
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {chatMessages.slice(0, visibleMessages).map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg.message}
          isBot={msg.isBot}
          delay={index * 200}
        />
      ))}
    </div>
  )
} 