'use client'

import { motion } from 'framer-motion'

interface ExpenseSummaryProps {
  todayExpenses: number
  weekExpenses: number
  monthExpenses: number
  totalExpenses: number
}

export const ExpenseSummary = ({
  todayExpenses,
  weekExpenses,
  monthExpenses,
  totalExpenses
}: ExpenseSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const summaryCards = [
    {
      title: 'Hoy',
      amount: todayExpenses,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Esta Semana',
      amount: weekExpenses,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'Este Mes',
      amount: monthExpenses,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Total',
      amount: totalExpenses,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30'
    }
  ]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Resumen de Gastos</h3>
        <p className="text-white/70 text-sm">Tus gastos organizados por período</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${card.bgColor} ${card.borderColor} border backdrop-blur-sm rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`}
          >
            <div className="text-center">
              <h4 className="text-white/80 text-sm font-medium mb-2 group-hover:text-white transition-colors">
                {card.title}
              </h4>
              
              <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
                {formatCurrency(card.amount).replace('COP', '').trim()}
              </div>
              
              <p className="text-white/60 text-xs font-medium">COP</p>
            </div>

            {/* Efecto hover sutil */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl pointer-events-none`} />
          </motion.div>
        ))}
      </div>

      {/* Indicador de actualización */}
      <div className="mt-4 text-center">
        <p className="text-white/50 text-xs">
          📊 Actualizado en tiempo real desde Supabase
        </p>
      </div>
    </div>
  )
} 