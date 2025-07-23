'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategoryBudget } from '@/hooks/useCategoryBudget'
import { useCategories } from '@/hooks/useCategories'
import { Settings, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
// Función de formateo local
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface BudgetTableProps {
  userId?: string
}

export const BudgetTable = ({ userId }: BudgetTableProps) => {
  const { expensesByCategory, totalSpent, user } = useTransactions()
  const { budgetSummary, stats, saveBudget, deleteBudget } = useCategoryBudget(userId || user?.id || '')
  const { gastoCategories } = useCategories()
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string>('')
  const [editingAmount, setEditingAmount] = useState('')

  // Combinar datos de gastos actuales con presupuestos
  const budgetData = gastoCategories.map(cat => {
    const categoryName = cat.nombre
    const actualSpent = expensesByCategory[categoryName] || 0
    const budgetAmount = budgetSummary.find(b => b.categoria === categoryName)?.presupuestado || 0
    const difference = budgetAmount - actualSpent
    
    return {
      categoria: categoryName,
      actual: actualSpent,
      presupuestado: budgetAmount,
      excedente: difference,
      percentage: budgetAmount > 0 ? (actualSpent / budgetAmount) * 100 : 0
    }
  }).filter(item => item.actual > 0 || item.presupuestado > 0) // Solo mostrar categorías con datos

  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.presupuestado, 0)
  const totalDifference = totalBudgeted - totalSpent
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0

  const handleEditBudget = (categoria: string, currentAmount: number) => {
    setEditingCategory(categoria)
    setEditingAmount(currentAmount.toString())
    setIsEditModalOpen(true)
  }

  const handleSaveBudget = async () => {
    if (editingCategory && editingAmount) {
      const amount = parseFloat(editingAmount)
      if (amount > 0) {
        await saveBudget(editingCategory, amount)
      } else {
        await deleteBudget(editingCategory)
      }
      setIsEditModalOpen(false)
      setEditingCategory('')
      setEditingAmount('')
    }
  }

  const getStatusColor = (excedente: number, percentage: number) => {
    if (excedente > 0) {
      return 'text-[#9DFAD7]' // Verde de la landing para excedente
    } else if (percentage > 100) {
      return 'text-red-400' // Rojo claro para exceso
    } else if (percentage > 80) {
      return 'text-yellow-400' // Amarillo claro para advertencia
    }
    return 'text-white/70' // Blanco transparente por defecto
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-[#9DFAD7]'
    if (percentage <= 80) return 'bg-yellow-400'
    if (percentage <= 100) return 'bg-orange-400'
    return 'bg-red-400'
  }

  return (
    <Card className="w-full bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">Presupuesto Mensual</CardTitle>
            <CardDescription className="text-white/70">
              Seguimiento de gastos por categoría vs presupuesto asignado
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-[#9DFAD7] text-[#0D1D35] border-[#9DFAD7] hover:bg-[#9DFAD7]/90"
          >
            <Settings className="h-4 w-4" />
            Configurar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#9DFAD7]/20 to-[#A78BFA]/20 rounded-lg border border-white/10">
          <div className="text-center">
            <p className="text-sm text-white/70">Total Gastado</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/70">Total Presupuestado</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {totalDifference >= 0 ? (
                <TrendingUp className="h-5 w-5 text-[#9DFAD7]" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
              <p className="text-sm text-white/70">Balance</p>
            </div>
            <p className={`text-2xl font-bold ${totalDifference >= 0 ? 'text-[#9DFAD7]' : 'text-red-400'}`}>
              {formatCurrency(Math.abs(totalDifference))}
            </p>
            <p className="text-xs text-white/50">
              {totalDifference >= 0 ? 'Disponible' : 'Excedido'}
            </p>
          </div>
        </div>

        {/* Tabla de Presupuesto */}
        <div className="overflow-hidden rounded-lg border border-white/20">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
                  Presupuestado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
                  Excedente
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white/80 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white/80 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10">
              {budgetData.map((item) => (
                <tr key={item.categoria} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-[#9DFAD7] mr-2" />
                      <span className="text-sm font-medium text-white">
                        {item.categoria}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-white font-medium">
                      {formatCurrency(item.actual)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-white/70">
                      {item.presupuestado > 0 ? formatCurrency(item.presupuestado) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${getStatusColor(item.excedente, item.percentage)}`}>
                      {item.presupuestado > 0 ? (
                        <>
                          {item.excedente >= 0 ? '+' : ''}{formatCurrency(item.excedente)}
                        </>
                      ) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.presupuestado > 0 ? (
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(item.percentage)}`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-white/50">Sin presupuesto</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBudget(item.categoria, item.presupuestado)}
                      className="text-[#9DFAD7] hover:text-[#9DFAD7]/80 hover:bg-white/10"
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Configuración Rápida de Presupuestos */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-[#A78BFA]/10 to-[#9DFAD7]/10 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">⚙️ Configurar Presupuestos por Categoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gastoCategories.map((category) => {
              const currentBudget = budgetSummary.find(b => b.categoria === category.nombre)?.presupuestado || 0
              return (
                <div
                  key={category.id}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{category.nombre}</span>
                    <DollarSign className="h-4 w-4 text-[#9DFAD7]" />
                  </div>
                  <div className="text-xs text-white/60 mb-2">
                    Actual: {formatCurrency(expensesByCategory[category.nombre] || 0)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBudget(category.nombre, currentBudget)}
                    className="w-full text-[#9DFAD7] hover:text-[#9DFAD7]/80 hover:bg-white/10 border border-[#9DFAD7]/30"
                  >
                    {currentBudget > 0 ? `${formatCurrency(currentBudget)}` : 'Configurar'}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Estado de Metas de Ahorro */}
        <div className="p-4 rounded-lg border-2 border-dashed border-white/30">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Estado de Metas de Ahorro</h3>
            {totalBudgeted > 0 ? (
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${totalDifference >= 0 ? 'text-[#9DFAD7]' : 'text-red-400'}`}>
                  {overallPercentage.toFixed(1)}% del presupuesto utilizado
                </div>
                {totalDifference >= 0 ? (
                  <p className="text-[#9DFAD7] bg-[#9DFAD7]/10 px-4 py-2 rounded-lg border border-[#9DFAD7]/30">
                    🎉 ¡Excelente! Te quedan {formatCurrency(totalDifference)} de tu presupuesto mensual.
                  </p>
                ) : (
                  <p className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/30">
                    ⚠️ Has excedido tu presupuesto por {formatCurrency(Math.abs(totalDifference))}.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-white/70">
                Configure presupuestos por categoría para ver el seguimiento de sus metas de ahorro.
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* Modal de Edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-[#0D1D35] border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? `Editar Presupuesto - ${editingCategory}` : 'Configurar Presupuestos'}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Establece el monto mensual que planeas gastar en esta categoría.
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-white">Monto Mensual</Label>
                <Input
                  id="amount"
                  type="number"
                  value={editingAmount}
                  onChange={(e) => setEditingAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveBudget}
                  className="bg-[#9DFAD7] text-[#0D1D35] hover:bg-[#9DFAD7]/90"
                >
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                Selecciona una categoría de la tabla para configurar su presupuesto mensual.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)} 
                className="w-full bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 