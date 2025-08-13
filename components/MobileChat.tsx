'use client'

import { useEffect, useState } from 'react'

interface ChatMessage {
  id: number
  text: string
  isUser: boolean
  time: string
}

interface MobileChatProps {
  messages: ChatMessage[]
  isVisible: boolean
}

export const MobileChat = ({ messages, isVisible }: MobileChatProps) => {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setVisibleMessages([])
      setIsTyping(false)
      return
    }

    const showMessages = async () => {
      setVisibleMessages([])
      
      for (let i = 0; i < messages.length; i++) {
        // Wait before showing user message
        if (messages[i].isUser) {
          await new Promise(resolve => setTimeout(resolve, 500))
          setVisibleMessages(prev => [...prev, messages[i]])
          await new Promise(resolve => setTimeout(resolve, 1000))
        } else {
          // Show typing for bot messages
          setIsTyping(true)
          await new Promise(resolve => setTimeout(resolve, 1200))
          setIsTyping(false)
          setVisibleMessages(prev => [...prev, messages[i]])
          await new Promise(resolve => setTimeout(resolve, 800))
        }
      }
    }

    showMessages()
  }, [messages, isVisible])

  return (
    <div className="relative mx-auto w-72 h-[600px]">
      {/* iPhone Frame */}
      <div className="relative w-full h-full bg-black rounded-[3rem] p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
          {/* iPhone Notch */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-10"></div>
          
          {/* WhatsApp Header */}
          <div className="bg-[#128C7E] text-white p-4 pt-8">
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
          <div className="bg-[#E5DDD5] h-[calc(100%-100px)] p-4 overflow-hidden relative">
            <div className="space-y-3 h-full overflow-y-auto">
              {visibleMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-in`}
                >
                  <div
                    className={`${
                      message.isUser
                        ? 'bg-[#DCF8C6] text-gray-800'
                        : 'bg-white text-gray-800'
                    } p-3 rounded-2xl max-w-[80%] shadow-sm relative`}
                    style={{
                      borderBottomRightRadius: message.isUser ? '4px' : '18px',
                      borderBottomLeftRadius: message.isUser ? '18px' : '4px'
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text}
                    </p>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {message.time}
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

          {/* WhatsApp Input */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#F0F0F0] p-3">
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
      </div>
    </div>
  )
}
