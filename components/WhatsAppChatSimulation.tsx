'use client'

import { useEffect, useState } from 'react'

interface ChatMessage {
  isUser: boolean
  text: string
  emoji?: string
}

interface MessagePair {
  user: ChatMessage
  bot: ChatMessage
}

const MESSAGE_PAIRS: MessagePair[] = [
  {
    user: {
      isUser: true,
      text: "Pagué el almuerzo con Juan $30.000"
    },
    bot: {
      isUser: false,
      text: "¡Registrado! 💸 He guardado tu gasto en la categoría de 'Comida'. ¿Algo más en lo que te pueda ayudar?"
    }
  },
  {
    user: {
      isUser: true,
      text: "FinancIA, ¿cómo va mi presupuesto este mes?"
    },
    bot: {
      isUser: false,
      text: "¡Hola! Has gastado el 65% de tu presupuesto de comidas. Te quedan $120.000 COP hasta fin de mes. ¡Sigue así! 💪"
    }
  },
  {
    user: {
      isUser: true,
      text: "Quiero ahorrar para un viaje a la costa en diciembre."
    },
    bot: {
      isUser: false,
      text: "¡Excelente meta! Para alcanzarla, te sugiero ahorrar $150.000 COP semanales. Te avisaré sobre tu progreso. 🏖️"
    }
  },
  {
    user: {
      isUser: true,
      text: "FinancIA, ¿en qué estoy gastando más?"
    },
    bot: {
      isUser: false,
      text: "¡Analizando tus datos! En el último mes, tus mayores gastos fueron en 'Entretenimiento', seguido de 'Transporte'. ¿Te gustaría explorar formas de optimizarlo?"
    }
  }
]

export const WhatsAppChatSimulation = () => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [fadeClass, setFadeClass] = useState('opacity-100')

  useEffect(() => {
    const showMessagePair = async () => {
      // Fade out current messages
      setFadeClass('opacity-0')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear messages
      setVisibleMessages([])
      setFadeClass('opacity-100')
      
      const currentPair = MESSAGE_PAIRS[currentPairIndex]
      
      // Show user message
      setVisibleMessages([currentPair.user])
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show typing indicator
      setIsTyping(true)
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Show bot response
      setIsTyping(false)
      setVisibleMessages([currentPair.user, currentPair.bot])
      
      // Wait before next cycle
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Move to next pair
      setCurrentPairIndex((prev) => (prev + 1) % MESSAGE_PAIRS.length)
    }

    showMessagePair()
    
    const interval = setInterval(() => {
      showMessagePair()
    }, 6500) // Total cycle time

    return () => clearInterval(interval)
  }, [currentPairIndex])

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* WhatsApp Header */}
      <div className="bg-[#128C7E] text-white p-4 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#9DFAD7] rounded-full flex items-center justify-center text-[#0D1D35] font-bold text-lg">
            F
          </div>
          <div>
            <div className="font-semibold text-white">FinancIA</div>
            <div className="text-xs text-green-100">en línea</div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-[#E5DDD5] min-h-[400px] p-4 space-y-3 overflow-hidden">
        <div className={`transition-opacity duration-500 ${fadeClass} space-y-3`}>
          {visibleMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-in`}
            >
              <div
                className={`${
                  message.isUser
                    ? 'bg-[#DCF8C6] text-gray-800'
                    : 'bg-white text-gray-800'
                } p-3 rounded-2xl max-w-[85%] shadow-sm relative`}
                style={{
                  borderBottomRightRadius: message.isUser ? '4px' : '18px',
                  borderBottomLeftRadius: message.isUser ? '18px' : '4px'
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.text}
                </p>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {new Date().toLocaleTimeString('es-CO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-message-in">
              <div className="bg-white p-3 rounded-2xl shadow-sm" style={{ borderBottomLeftRadius: '4px' }}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-1"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-2"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-3"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Footer */}
      <div className="bg-[#F0F0F0] p-3 rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">
            Escribe un mensaje...
          </div>
          <div className="w-8 h-8 bg-[#128C7E] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
