'use client'

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ChatMessageProps {
  message: string
  isBot: boolean
  delay: number
}

export const ChatMessage = ({ message, isBot, delay }: ChatMessageProps) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-[80%] rounded-3xl px-4 py-2 ${
        isBot 
          ? 'bg-white/10 text-white' 
          : 'bg-[#9DFAD7] text-[#0D1D35]'
      }`}>
        <p className="whitespace-pre-line">{message}</p>
      </div>
    </motion.div>
  )
} 