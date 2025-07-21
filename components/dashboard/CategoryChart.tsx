'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useState } from 'react'

interface CategoryData {
  name: string
  value: number
  color: string
}

interface CategoryChartProps {
  expensesByCategory: Record<string, number>
  onCategoryClick?: (category: string) => void
}

// Paleta de colores específica
const COLORS = [
  '#8B5CF6', // Púrpura
  '#06B6D4', // Cyan
  '#10B981', // Esmeralda
  '#F59E0B', // Ámbar
  '#EF4444', // Rojo
  '#6B7280', // Gris para "Otros"
]

export const CategoryChart = ({ expensesByCategory, onCategoryClick }: CategoryChartProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  
  // Procesar datos para mostrar máximo 5 categorías + "Otros"
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }))

  const topCategories = sortedCategories.slice(0, 5)
  const otherCategories = sortedCategories.slice(5)
  
  const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.value, 0)
  
  const chartData: CategoryData[] = [
    ...topCategories.map((cat, index) => ({
      name: cat.name,
      value: cat.value,
      color: COLORS[index],
    })),
    ...(otherTotal > 0 ? [{
      name: 'Otros',
      value: otherTotal,
      color: COLORS[5],
    }] : [])
  ]

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / totalAmount) * 100).toFixed(1)
      
      return (
        <div className="bg-[#0D1D35] border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-[#9DFAD7]">{formatCurrency(data.value)}</p>
          <p className="text-white/70 text-sm">{percentage}% del total</p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all duration-200 ${
              hoveredCategory === entry.value ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
            onMouseEnter={() => setHoveredCategory(entry.value)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => onCategoryClick?.(entry.value)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (chartData.length === 0) {
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
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white">Gastos por categoría</h3>
        <p className="text-sm text-white/70">
          Total: {formatCurrency(totalAmount)}
        </p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke={hoveredCategory === entry.name ? '#ffffff' : 'transparent'}
                  strokeWidth={hoveredCategory === entry.name ? 2 : 0}
                  style={{
                    filter: hoveredCategory && hoveredCategory !== entry.name ? 'opacity(0.6)' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => onCategoryClick?.(entry.name)}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 