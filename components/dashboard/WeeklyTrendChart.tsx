'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface WeeklyData {
  week: string
  amount: number
  date: string
}

interface WeeklyTrendChartProps {
  weeklyData: WeeklyData[]
  onWeekClick?: (week: string) => void
}

export const WeeklyTrendChart = ({ weeklyData, onWeekClick }: WeeklyTrendChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calcular el promedio
  const average = weeklyData.length > 0 
    ? weeklyData.reduce((sum, item) => sum + item.amount, 0) / weeklyData.length 
    : 0

  // Calcular tendencia (comparar últimas dos semanas)
  const getTrend = () => {
    if (weeklyData.length < 2) return { direction: 'stable', percentage: 0 }
    
    const thisWeek = weeklyData[weeklyData.length - 1]?.amount || 0
    const lastWeek = weeklyData[weeklyData.length - 2]?.amount || 0
    
    if (lastWeek === 0) return { direction: 'stable', percentage: 0 }
    
    const percentage = ((thisWeek - lastWeek) / lastWeek) * 100
    
    if (Math.abs(percentage) < 5) return { direction: 'stable', percentage: 0 }
    
    return {
      direction: percentage > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    }
  }

  const trend = getTrend()

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-red-500" />
      case 'down':
        return <TrendingDown className="h-5 w-5 text-green-500" />
      default:
        return <Minus className="h-5 w-5 text-white/70" />
    }
  }

  const getTrendMessage = () => {
    switch (trend.direction) {
      case 'up':
        return `Gastos aumentaron ${trend.percentage.toFixed(1)}%`
      case 'down':
        return `Gastos disminuyeron ${trend.percentage.toFixed(1)}%`
      default:
        return 'Gastos estables'
    }
  }

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up':
        return 'text-red-500'
      case 'down':
        return 'text-green-500'
      default:
        return 'text-white/70'
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const weekData = weeklyData.find(w => w.week === label)
      
      return (
        <div className="bg-[#0D1D35] border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-white">{label}</p>
          <p className="text-[#9DFAD7]">{formatCurrency(data.value)}</p>
          {weekData && (
            <p className="text-white/70 text-sm">{weekData.date}</p>
          )}
        </div>
      )
    }
    return null
  }

  if (weeklyData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-[400px] flex items-center justify-center border border-white/20">
        <div className="text-center">
          <p className="text-white/70">No hay datos suficientes</p>
          <p className="text-sm text-white/50 mt-1">
            Las tendencias aparecerán con más transacciones
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Tendencia semanal</h3>
          <p className="text-sm text-white/70">
            Últimas 4 semanas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendMessage()}
          </span>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weeklyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="week" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Línea de promedio */}
            <ReferenceLine 
              y={average} 
              stroke="rgba(255,255,255,0.5)" 
              strokeDasharray="5 5"
              label={{ 
                value: "Promedio", 
                position: "insideTopRight",
                style: { fontSize: '12px', fill: 'rgba(255,255,255,0.7)' }
              }}
            />
            
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#9DFAD7"
              strokeWidth={3}
              dot={{ 
                fill: "#9DFAD7", 
                strokeWidth: 2, 
                r: 6,
                cursor: 'pointer'
              }}
              activeDot={{ 
                r: 8, 
                stroke: "#9DFAD7",
                strokeWidth: 2,
                fill: "#0D1D35",
                cursor: 'pointer'
              }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-white/70">
          Promedio semanal: {formatCurrency(average)}
        </p>
      </div>
    </div>
  )
} 