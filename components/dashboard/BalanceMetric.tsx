'use client'

import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

interface BalanceMetricProps {
  totalIncome: number
  spentAmount: number
}

export const BalanceMetric = ({ 
  totalIncome,
  spentAmount
}: BalanceMetricProps) => {
  const balance = totalIncome - spentAmount
  const hasTransactions = totalIncome > 0 || spentAmount > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl relative overflow-hidden"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5ce1e6]/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-[#5ce1e6]/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-[#5ce1e6] to-[#4dd0e1] rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-[#0D1D35]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Balance Mensual</h2>
            <p className="text-white/70 text-sm">Ingresos vs Gastos</p>
          </div>
        </div>

        {hasTransactions ? (
          <>
            {/* Balance Principal */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                {balance >= 0 ? (
                  <>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Balance Positivo</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 font-semibold">Balance Negativo</span>
                  </>
                )}
              </div>
              <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(Math.abs(balance))}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {balance >= 0 ? 'Tienes un excedente' : 'Tienes un déficit'}
              </p>
            </div>

            {/* Desglose de ingresos y gastos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-white/70 text-sm mb-1">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-400">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(totalIncome)}
                </p>
              </div>

              <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-white/70 text-sm mb-1">Total Gastos</p>
                <p className="text-2xl font-bold text-red-400">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(spentAmount)}
                </p>
              </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                {balance >= 0 
                  ? '🎉 ¡Excelente! Estás ahorrando dinero este mes'
                  : '💡 Considera revisar tus gastos para mejorar tu balance'
                }
              </p>
            </div>
          </>
        ) : (
          /* Estado sin transacciones */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#5ce1e6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-[#5ce1e6]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              ¡Comienza a registrar tus finanzas!
            </h3>
            <p className="text-white/70 text-sm max-w-md mx-auto">
              Agrega tus primeros ingresos y gastos para ver tu balance mensual aquí.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
