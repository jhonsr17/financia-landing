'use client'

import { useEffect, useState } from 'react'

interface Message {
  isUser: boolean;
  text: string;
  time: string;
  emoji?: string;
}

interface ChatExampleProps {
  messages: Message[];
}

const ChatExample = ({ messages }: ChatExampleProps) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let isMounted = true;

    const showMessages = async () => {
      setVisibleMessages([])
      
      for (let i = 0; i < messages.length; i++) {
        if (!isMounted) return;
        
        if (!messages[i].isUser) {
          setIsTyping(true)
          // Tiempo de escritura basado en la longitud del mensaje (mínimo 1s, máximo 2.5s)
          await new Promise(resolve => 
            setTimeout(resolve, Math.min(Math.max(messages[i].text.length * 30, 1000), 2500))
          )
          if (!isMounted) return;
          setIsTyping(false)
          // Pequeña pausa antes de mostrar el mensaje
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        
        if (!isMounted) return;
        setVisibleMessages(prev => [...prev, messages[i]])
        
        // Pausa entre mensajes
        if (i < messages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }

    showMessages()

    return () => {
      isMounted = false
      setVisibleMessages([])
      setIsTyping(false)
    }
  }, [messages])

  return (
    <div className="bg-[#0D1D35]/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 shadow-xl w-[280px] md:w-[300px] mx-1 md:mx-2 flex-shrink-0 border border-white/10">
      {/* Header del chat */}
      <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4 pb-2 md:pb-3 border-b border-white/10">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-[#9DFAD7] rounded-full flex items-center justify-center text-[#0D1D35] font-bold text-sm md:text-base">
          F
        </div>
        <div>
          <div className="font-medium text-white text-sm md:text-base">FinancIA</div>
          <div className="text-xs md:text-sm text-white/70">En línea</div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="space-y-2 md:space-y-3 min-h-[180px] md:min-h-[200px]">
        {visibleMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-in`}
          >
            <div
              className={`${
                message.isUser
                  ? 'bg-[#9DFAD7] text-[#0D1D35]'
                  : 'bg-white/10 text-white'
              } p-2 md:p-3 rounded-xl md:rounded-2xl max-w-[85%]`}
            >
              <p className="text-xs md:text-sm whitespace-pre-line leading-relaxed">
                {message.emoji && <span className="mr-1">{message.emoji}</span>}
                {message.text}
              </p>
              <div className={`text-xs mt-1 ${
                message.isUser ? 'text-[#0D1D35]/70' : 'text-white/70'
              }`}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-message-in">
            <div className="bg-white/10 rounded-xl md:rounded-2xl p-2 md:p-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/70 rounded-full animate-typing-1"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/70 rounded-full animate-typing-2"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/70 rounded-full animate-typing-3"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
};

export default ChatExample; 