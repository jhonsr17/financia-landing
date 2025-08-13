'use client'

import { useEffect, useState } from 'react'

const AVATARS = [
  { 
    name: "María", 
    profession: "Contadora", 
    gradient: "from-purple-400 to-pink-400",
    initial: "M"
  },
  { 
    name: "Carlos", 
    profession: "Ingeniero", 
    gradient: "from-blue-400 to-cyan-400",
    initial: "C"
  },
  { 
    name: "Ana", 
    profession: "Médica", 
    gradient: "from-green-400 to-emerald-400",
    initial: "A"
  },
  { 
    name: "Luis", 
    profession: "Abogado", 
    gradient: "from-orange-400 to-red-400",
    initial: "L"
  },
  { 
    name: "Sofia", 
    profession: "Arquitecta", 
    gradient: "from-indigo-400 to-purple-400",
    initial: "S"
  }
]

export const ProfessionalAvatars = () => {
  const [visibleAvatars, setVisibleAvatars] = useState([0, 1, 2, 3])

  useEffect(() => {
    const rotateAvatars = () => {
      setVisibleAvatars(prev => {
        const next = [...prev]
        next.shift() // Remove first
        next.push((next[next.length - 1] + 1) % AVATARS.length) // Add next
        return next
      })
    }

    const interval = setInterval(rotateAvatars, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-center items-center space-x-1">
      {visibleAvatars.map((avatarIndex, index) => {
        const avatar = AVATARS[avatarIndex]
        return (
          <div
            key={`${avatarIndex}-${index}`}
            className={`w-12 h-12 bg-gradient-to-br ${avatar.gradient} rounded-full border-3 border-white flex items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-500 hover:scale-110 animate-fade-in`}
            style={{
              animationDelay: `${index * 0.1}s`,
              zIndex: 10 - index
            }}
          >
            {avatar.initial}
          </div>
        )
      })}
      
      {/* Plus indicator for more users */}
      <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-3 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg">
        +60
      </div>
    </div>
  )
}
