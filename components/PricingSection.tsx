'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Check, User, Mic, Camera, Target, Bot, TrendingUp, BarChart3 } from 'lucide-react'

const PricingSection = () => {
  const features = [
    { icon: User, text: '1 cuenta' },
    { icon: Mic, text: 'Reconocimiento texto' },
    { icon: Mic, text: 'Reconocimiento audio' },
    { icon: Camera, text: 'Reconocimiento imagen' },
    { icon: Target, text: '1 presupuesto' },
    { icon: Bot, text: '5 gastos diarios vía bot' },
    { icon: BarChart3, text: 'Visualización de patrones gráficos' },
    { icon: TrendingUp, text: 'Asistente financiero' }
  ]

  return (
    <section id="plan" className="py-20 bg-gradient-to-br from-[#0D1D35] to-[#0D1D35]/90">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comienza tu{' '}
            <span className="bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] bg-clip-text text-transparent">
              transformación financiera
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Únete al lanzamiento exclusivo y sé de los primeros en experimentar FinancIA{' '}
            <span className="border-b-2 border-[#9DFAD7] text-[#9DFAD7]">totalmente gratis</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Header del plan */}
            <div className="bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] p-8 text-center text-[#0D1D35]">
              <h3 className="text-2xl font-bold mb-2">Plan Lanzamiento</h3>
              <p className="text-[#0D1D35]/70 text-sm">
                Acceso exclusivo para early adopters
              </p>
            </div>

            {/* Precio con blur y advertencia */}
            <div className="p-8 text-center border-b border-gray-100">
              <div className="relative inline-block">
                <div className="text-6xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse select-none tracking-wider">
                  OFF
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-lg rounded-lg animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500 animate-bounce" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 font-light animate-pulse">
                Algo especial se aproxima...
              </p>
            </div>

            {/* Features */}
            <div className="p-8">
              <h4 className="font-semibold text-gray-900 mb-6 text-center">
                Características incluidas:
              </h4>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-gray-700"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-[#9DFAD7]/20 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-3 h-3 text-[#9DFAD7]" />
                    </div>
                    <feature.icon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">{feature.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="p-8 pt-0">
              <motion.a
                href="https://wa.me/573223796302?text=¡Hola%20FinancIA!%20Me%20interesa%20el%20Plan%20Lanzamiento%20🚀"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] hover:from-[#9DFAD7]/90 hover:to-[#D4FFB5]/90 text-[#0D1D35] font-semibold py-4 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-xl block text-center"
              >
                Chatea ya con FinancIA
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-xs text-white/40 font-light max-w-md mx-auto">
            * Los precios y características pueden estar sujetos a cambios durante la fase de lanzamiento. 
            Los early adopters tendrán acceso a condiciones preferenciales.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection 