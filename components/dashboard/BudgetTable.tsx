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
      return 'text-green-600' // Verde para excedente
    } else if (percentage > 100) {
      return 'text-red-600' // Rojo para exceso
    } else if (percentage > 80) {
      return 'text-yellow-600' // Amarillo para advertencia
    }
    return 'text-gray-600' // Gris por defecto
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-green-500'
    if (percentage <= 80) return 'bg-yellow-500'
    if (percentage <= 100) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Presupuesto Mensual</CardTitle>
            <CardDescription>
              Seguimiento de gastos por categoría vs presupuesto asignado
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Gastado</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Presupuestado</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {totalDifference >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <p className="text-sm text-gray-600">Balance</p>
            </div>
            <p className={`text-2xl font-bold ${totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(totalDifference))}
            </p>
            <p className="text-xs text-gray-500">
              {totalDifference >= 0 ? 'Disponible' : 'Excedido'}
            </p>
          </div>
        </div>

        {/* Tabla de Presupuesto */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuestado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excedente
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetData.map((item) => (
                <tr key={item.categoria} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {item.categoria}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-900 font-medium">
                      {formatCurrency(item.actual)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-600">
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
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(item.percentage)}`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin presupuesto</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBudget(item.categoria, item.presupuestado)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Estado de Metas de Ahorro */}
        <div className="p-4 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado de Metas de Ahorro</h3>
            {totalBudgeted > 0 ? (
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallPercentage.toFixed(1)}% del presupuesto utilizado
                </div>
                {totalDifference >= 0 ? (
                  <p className="text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                    🎉 ¡Excelente! Te quedan {formatCurrency(totalDifference)} de tu presupuesto mensual.
                  </p>
                ) : (
                  <p className="text-red-700 bg-red-50 px-4 py-2 rounded-lg">
                    ⚠️ Has excedido tu presupuesto por {formatCurrency(Math.abs(totalDifference))}.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                Configure presupuestos por categoría para ver el seguimiento de sus metas de ahorro.
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* Modal de Edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? `Editar Presupuesto - ${editingCategory}` : 'Configurar Presupuestos'}
            </DialogTitle>
            <DialogDescription>
              Establece el monto mensual que planeas gastar en esta categoría.
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Monto Mensual</Label>
                <Input
                  id="amount"
                  type="number"
                  value={editingAmount}
                  onChange={(e) => setEditingAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveBudget}>
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Selecciona una categoría de la tabla para configurar su presupuesto mensual.
              </p>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 