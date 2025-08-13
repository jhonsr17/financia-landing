'use client'

import { useEffect, useState, useRef } from 'react'
import { MobileChat } from './MobileChat'

interface ChatMessage {
  id: number
  text: string
  isUser: boolean
  time: string
}

interface FeaturePair {
  id: number
  title: string
  description: string
  messages: ChatMessage[]
}

const FEATURE_PAIRS: FeaturePair[] = [
  {
    id: 1,
    title: "Registra tus gastos al instante",
    description: "Sin apps, sin formularios complejos. Solo escribe y listo.",
    messages: [
      {
        id: 1,
        text: "Pagué $25.000 en el almuerzo de hoy",
        isUser: true,
        time: "14:30"
      },
      {
        id: 2,
        text: "¡Perfecto! 💰 He registrado tu gasto:\n\n💵 Monto: $25.000\n🍽️ Categoría: Comida\n📅 Fecha: Hoy\n\n¿Algo más que quieras registrar?",
        isUser: false,
        time: "14:30"
      }
    ]
  },
  {
    id: 2,
    title: "Entiende en qué se va tu dinero",
    description: "Visualiza tus gastos y descubre tus puntos ciegos.",
    messages: [
      {
        id: 3,
        text: "¿Cómo van mis gastos este mes?",
        isUser: true,
        time: "16:45"
      },
      {
        id: 4,
        text: "📊 Tu resumen mensual:\n\n🍽️ Comida: $180.000 (45%)\n🚗 Transporte: $120.000 (30%)\n🎉 Entretenimiento: $100.000 (25%)\n\nHas gastado el 75% de tu presupuesto. ¡Vas muy bien! 💪",
        isUser: false,
        time: "16:45"
      }
    ]
  },
  {
    id: 3,
    title: "Alcanza tus metas financieras",
    description: "Te ayudamos a crear hábitos de ahorro sostenibles.",
    messages: [
      {
        id: 5,
        text: "Quiero ahorrar $500.000 para diciembre",
        isUser: true,
        time: "10:15"
      },
      {
        id: 6,
        text: "🎯 ¡Excelente meta!\n\nPara ahorrar $500.000 en 4 meses necesitas:\n💰 $125.000 mensuales\n📅 $31.250 semanales\n\nTe sugiero reducir $50.000 en entretenimiento. ¿Te parece bien? 🚀",
        isUser: false,
        time: "10:15"
      }
    ]
  },
  {
    id: 4,
    title: "Recibe consejos inteligentes",
    description: "Tu copiloto financiero te guía en cada decisión.",
    messages: [
      {
        id: 7,
        text: "¿Me conviene comprar este celular de $800.000?",
        isUser: true,
        time: "19:20"
      },
      {
        id: 8,
        text: "🤔 Analicemos juntos:\n\n💡 Tienes $1.200.000 ahorrados\n📊 Representa el 67% de tus ahorros\n⚠️ Te quedarían solo $400.000\n\nMi recomendación: Espera 2 meses más y tendrás mayor tranquilidad financiera 💪",
        isUser: false,
        time: "19:20"
      }
    ]
  }
]

export const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            
            // Start cycling through features
            const interval = setInterval(() => {
              setCurrentFeature((prev) => (prev + 1) % FEATURE_PAIRS.length)
            }, 8000) // 8 seconds per feature
            
            return () => clearInterval(interval)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const feature = FEATURE_PAIRS[currentFeature]

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Column - Feature Text */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 
                key={`title-${feature.id}`}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight animate-fade-in"
              >
                {feature.title}
              </h2>
              <p 
                key={`desc-${feature.id}`}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                {feature.description}
              </p>
            </div>
            
            {/* Feature Progress Indicator */}
            <div className="flex space-x-2">
              {FEATURE_PAIRS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentFeature 
                      ? 'bg-[#9DFAD7] w-8' 
                      : 'bg-gray-300 w-4'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Mobile Chat */}
          <div className="flex justify-center lg:justify-end">
            <MobileChat 
              messages={feature.messages} 
              isVisible={isVisible}
              key={feature.id}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
