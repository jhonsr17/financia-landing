'use client'

import { useState } from 'react'
import { Edit3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface BudgetMetricProps {
  totalBudget: number
  spentAmount: number
  totalIncome: number
  onBudgetUpdate: (newBudget: number) => void
  onOpenBudgetModal?: () => void
  isNewUser: boolean
}

export const BudgetMetric = ({ 
  totalBudget, 
  spentAmount, 
  totalIncome,
  onBudgetUpdate,
  onOpenBudgetModal, 
  isNewUser 
}: BudgetMetricProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  // Si no hay presupuesto configurado, mostrar solo balance de ingresos vs gastos
  if (totalBudget === 0) {
    const balance = totalIncome - spentAmount
    const hasTransactions = totalIncome > 0 || spentAmount > 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9DFAD7]/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#9DFAD7]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#0D1D35]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Balance Financiero</h2>
                <p className="text-white/70 text-sm">Ingresos vs Gastos</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={onOpenBudgetModal}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Configurar Presupuesto
            </Button>
          </div>

          {/* Contenido principal */}
          {!hasTransactions ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">¡Comienza tu Journey Financiero!</h3>
              <p className="text-white/70 mb-6">
                Registra tu primera transacción para ver tu balance en tiempo real
              </p>
              <div className="text-sm text-white/60">
                <p>• Haz clic en "Agregar Nueva Transacción" para empezar</p>
                <p>• Configura un presupuesto mensual para hacer seguimiento</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Balance principal */}
              <div className="text-center">
                <motion.div
                  className={`text-6xl md:text-7xl font-black mb-4 ${
                    balance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(Math.abs(balance))}
                </motion.div>
                
                <div className="flex items-center justify-center gap-2 mb-6">
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
              </div>

              {/* Desglose de ingresos y gastos */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-1">Total Ingresos</p>
                  <p className="text-2xl font-bold text-green-400">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
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
                    }).format(spentAmount)}
                  </p>
                </div>
              </div>

              {/* Mensaje motivacional */}
              <div className="text-center">
                <p className="text-white/60 text-sm">
                  {balance >= 0 
                    ? "¡Excelente manejo de tus finanzas! 🎉" 
                    : "Considera revisar tus gastos para equilibrar tu balance 📊"
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Lógica existente para cuando hay presupuesto configurado
  const remaining = totalBudget - spentAmount
  const percentage = Math.min((spentAmount / totalBudget) * 100, 100)
  const isOverBudget = spentAmount > totalBudget

  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-400'
    if (percentage > 80) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getStatusMessage = () => {
    if (isOverBudget) return '⚠️ Presupuesto superado'
    if (percentage > 80) return '⚡ Cuidado con el gasto'
    return '✅ ¡Vas por buen camino!'
  }

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500'
    if (percentage > 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9DFAD7]/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9DFAD7]/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Header con estado */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor()}`}>
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-semibold ${getStatusColor()}`}>
                  {getStatusMessage()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">Te quedan</h2>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={onOpenBudgetModal}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Monto principal */}
        <motion.div
          className={`text-6xl md:text-7xl font-black mb-4 ${getStatusColor()}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          }).format(isOverBudget ? 0 : Math.abs(remaining))}
        </motion.div>

        <p className="text-white/80 text-lg mb-6">
          de {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          }).format(totalBudget)} presupuesto mensual
        </p>

        {/* Barra de progreso */}
        <div className="space-y-3">
          <Progress 
            value={Math.min(percentage, 100)} 
            className="h-3 bg-white/20"
          />
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-400 font-semibold">
              {Math.max(100 - percentage, 0).toFixed(0)}% restante
            </span>
            <span className="text-white/70 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {percentage.toFixed(0)}% gastado
            </span>
          </div>
        </div>

        {/* Tooltip con información adicional */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap"
          >
            Haz clic para ver detalles del presupuesto
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
          </motion.div>
        )}

        {/* Estado de sobrepasar presupuesto */}
        {isOverBudget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-300 text-sm text-center">
              Has superado tu presupuesto por{' '}
              <span className="font-semibold">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(spentAmount - totalBudget)}
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 