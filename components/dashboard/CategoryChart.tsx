'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign } from 'lucide-react'

interface CategoryData {
  name: string
  value: number
  percentage: number
  intensity: number // 0-1 para el color del mapa de calor
}

interface CategoryChartProps {
  expensesByCategory: Record<string, number>
  onCategoryClick?: (category: string) => void
}

export const CategoryChart = ({ expensesByCategory, onCategoryClick }: CategoryChartProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  // Procesar datos para el mapa de calor
  const totalAmount = Object.values(expensesByCategory).reduce((sum, value) => sum + value, 0)
  
  const categoryData: CategoryData[] = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name,
      value,
      percentage: (value / totalAmount) * 100,
      intensity: value / Math.max(...Object.values(expensesByCategory)) // Normalizar 0-1
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Mostrar máximo 8 categorías

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getHeatmapColor = (intensity: number) => {
    // Gradiente de frío a caliente basado en la intensidad
    const colors = [
      'rgba(157, 250, 215, 0.1)', // Muy bajo - verde claro transparente
      'rgba(157, 250, 215, 0.3)', // Bajo - verde claro
      'rgba(34, 197, 94, 0.4)',   // Medio-bajo - verde
      'rgba(245, 158, 11, 0.5)',  // Medio - amarillo
      'rgba(239, 68, 68, 0.6)',   // Medio-alto - naranja
      'rgba(239, 68, 68, 0.8)',   // Alto - rojo
      'rgba(220, 38, 127, 0.9)',  // Muy alto - rosa intenso
    ]
    
    const index = Math.floor(intensity * (colors.length - 1))
    return colors[index] || colors[0]
  }

  const getBorderColor = (intensity: number) => {
    if (intensity > 0.8) return 'rgba(220, 38, 127, 0.5)'
    if (intensity > 0.6) return 'rgba(239, 68, 68, 0.4)'
    if (intensity > 0.4) return 'rgba(245, 158, 11, 0.3)'
    if (intensity > 0.2) return 'rgba(34, 197, 94, 0.3)'
    return 'rgba(157, 250, 215, 0.2)'
  }

  if (categoryData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-[400px] flex items-center justify-center border border-white/20">
        <div className="text-center">
          <p className="text-white/70">No hay gastos registrados</p>
          <p className="text-sm text-white/50 mt-1">
            Los gastos aparecerán aquí cuando registres transacciones
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Mapa de Calor por Categoría</h3>
        <p className="text-xs sm:text-sm text-white/70">
          Total: {formatCurrency(totalAmount)}
        </p>
      </div>
      
      {/* Mapa de calor - Grid responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {categoryData.map((category, index) => (
          <div
            key={category.name}
            className={`
              relative overflow-hidden rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 transform
              ${hoveredCategory === category.name ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
              ${hoveredCategory && hoveredCategory !== category.name ? 'opacity-60' : ''}
            `}
            style={{
              backgroundColor: getHeatmapColor(category.intensity),
              borderColor: getBorderColor(category.intensity),
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => onCategoryClick?.(category.name)}
          >
            {/* Indicador de intensidad */}
            <div className="absolute top-2 right-2">
              <div className={`
                w-2 h-2 rounded-full
                ${category.intensity > 0.8 ? 'bg-red-500' : 
                  category.intensity > 0.6 ? 'bg-orange-500' :
                  category.intensity > 0.4 ? 'bg-yellow-500' :
                  category.intensity > 0.2 ? 'bg-green-500' : 'bg-blue-400'}
              `} />
            </div>

            {/* Icono */}
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                ${category.intensity > 0.6 ? 'bg-white/20' : 'bg-white/10'}
              `}>
                {index === 0 ? <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> : 
                 <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />}
              </div>
            </div>

            {/* Información de categoría */}
            <div className="text-center">
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 truncate">
                {category.name}
              </h4>
              <p className="text-xs sm:text-sm text-white/90 font-bold">
                {formatCurrency(category.value)}
              </p>
              <p className="text-xs text-white/70">
                {category.percentage.toFixed(1)}%
              </p>
            </div>

            {/* Barra de intensidad en la parte inferior */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <div 
                className="h-full bg-white/50 transition-all duration-300"
                style={{ width: `${category.intensity * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda del mapa de calor */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span>Menor gasto</span>
          <div className="flex gap-1">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
              <div
                key={i}
                className="w-4 h-2 rounded-sm"
                style={{ backgroundColor: getHeatmapColor(intensity) }}
              />
            ))}
          </div>
          <span>Mayor gasto</span>
        </div>
      </div>
    </div>
  )
} 