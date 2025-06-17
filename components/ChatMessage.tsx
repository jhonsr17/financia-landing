'use client'

interface ChatMessageProps {
  message: string
  isBot: boolean
  delay: number
  isVoice?: boolean
}

export const ChatMessage = ({ message, isBot, isVoice }: ChatMessageProps) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-message-in`}>
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isBot 
            ? 'bg-white/10 text-white' 
            : 'bg-[#9DFAD7] text-[#0D1D35]'
        }`}
      >
        {isVoice ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-1 h-3 bg-current rounded-full animate-voice-1"></div>
              <div className="w-1 h-4 bg-current rounded-full animate-voice-2"></div>
              <div className="w-1 h-2 bg-current rounded-full animate-voice-3"></div>
              <div className="w-1 h-3 bg-current rounded-full animate-voice-2"></div>
              <div className="w-1 h-2 bg-current rounded-full animate-voice-1"></div>
            </div>
            <span className="text-sm whitespace-pre-line">{message}</span>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-line">{message}</p>
        )}
      </div>
    </div>
  )
} 