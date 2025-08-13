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
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([])
  const [phoneVisible, setPhoneVisible] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Observer for phone visibility
    const phoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPhoneVisible(true)
          }
        })
      },
      { threshold: 0.5 }
    )

    // Observer for individual features
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = parseInt(entry.target.getAttribute('data-feature-id') || '0')
            setVisibleFeatures(prev => {
              if (!prev.includes(featureId)) {
                return [...prev, featureId]
              }
              return prev
            })
          }
        })
      },
      { threshold: 0.6 }
    )

    if (phoneRef.current) {
      phoneObserver.observe(phoneRef.current)
    }

    featureRefs.current.forEach((ref) => {
      if (ref) {
        featureObserver.observe(ref)
      }
    })

    return () => {
      phoneObserver.disconnect()
      featureObserver.disconnect()
    }
  }, [])

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Phone in center - shows when scrolled into view */}
        <div ref={phoneRef} className="flex justify-center mb-20">
          <div className={`transition-all duration-1000 ${phoneVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <MobileChat 
              messages={FEATURE_PAIRS[Math.max(...visibleFeatures) - 1]?.messages || FEATURE_PAIRS[0].messages} 
              isVisible={phoneVisible}
              key={Math.max(...visibleFeatures) || 1}
            />
          </div>
        </div>

        {/* Feature sections - appear on scroll */}
        <div className="space-y-32">
          {FEATURE_PAIRS.map((feature, index) => (
            <div 
              key={feature.id}
              ref={(el) => featureRefs.current[index] = el}
              data-feature-id={feature.id}
              className="grid lg:grid-cols-2 gap-12 items-center min-h-[400px]"
            >
              {/* Feature Text - Left side */}
              <div className={`space-y-6 transition-all duration-1000 ${
                visibleFeatures.includes(feature.id) 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {feature.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Feature indicator */}
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#9DFAD7] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-500">Beneficio {feature.id}</span>
                </div>
              </div>

              {/* Spacer for right column */}
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
