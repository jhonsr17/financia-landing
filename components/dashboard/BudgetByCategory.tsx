'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, DollarSign, TrendingUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSupabaseClient } from '@/utils/supabase/client'
import { useCategories } from '@/hooks/useCategories'

interface BudgetByCategoryProps {
  userId: string
  onBudgetUpdate: () => void
}

interface CategoryBudget {
  id: string
  categorias: string  // Nombre de la columna en Supabase
  valor: number
  mes: string
}

export const BudgetByCategory = ({ userId, onBudgetUpdate }: BudgetByCategoryProps) => {
  const [budgets, setBudgets] = useState<CategoryBudget[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<CategoryBudget | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [budgetValue, setBudgetValue] = useState('')
  const [saving, setSaving] = useState(false)

  const { gastoCategories } = useCategories()
  const supabase = createSupabaseClient()

  // Cargar presupuestos por categoría
  const loadBudgets = async () => {
    if (!userId) {
      console.log('⚠️ BUDGET - No hay userId para cargar presupuestos')
      setLoading(false)
      return
    }

    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const monthStart = new Date(currentYear, currentMonth - 1, 1)
      const monthEnd = new Date(currentYear, currentMonth, 0)

      console.log('🔍 BUDGET - Cargando presupuestos por categoría:', {
        userId,
        mes: currentMonth,
        año: currentYear,
        monthStart: monthStart.toISOString().split('T')[0],
        monthEnd: monthEnd.toISOString().split('T')[0]
      })

      const { data, error } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('usuario_id', userId)
        .gte('mes', monthStart.toISOString().split('T')[0])
        .lte('mes', monthEnd.toISOString().split('T')[0])
        .order('categorias')

      if (error) {
        console.error('❌ BUDGET - Error cargando presupuestos por categoría:', error)
        return
      }

      console.log('✅ BUDGET - Presupuestos cargados:', data?.length || 0, 'categorías')
      if (data && data.length > 0) {
        console.log('✅ BUDGET - Primer presupuesto:', data[0])
        console.log('✅ BUDGET - Estructura:', Object.keys(data[0]))
        data.forEach((budget, index) => {
          console.log(`   Presupuesto ${index + 1}: ${budget.categorias} - $${budget.valor}`)
        })
      } else {
        console.log('📋 BUDGET - No hay presupuestos para este mes')
      }
      setBudgets(data || [])
    } catch (error) {
      console.error('💥 BUDGET - Error inesperado cargando presupuestos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudgets()
  }, [userId])

  // Calcular total de presupuestos
  const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.valor), 0)

  // Guardar presupuesto por categoría
  const handleSaveBudget = async () => {
    if (!selectedCategory || !budgetValue || !userId) {
      alert('Faltan datos requeridos para guardar el presupuesto')
      return
    }

    setSaving(true)
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const monthDate = new Date(currentYear, currentMonth - 1, 1)

      console.log('💾 BUDGET - Información de fecha:', {
        now: now.toISOString(),
        currentMonth,
        currentYear,
        monthDate: monthDate.toISOString(),
        monthDateString: monthDate.toISOString().split('T')[0]
      })

      console.log('💾 BUDGET - Guardando presupuesto:', {
        usuario_id: userId,
        mes: monthDate.toISOString().split('T')[0],
        categorias: selectedCategory,
        valor: parseFloat(budgetValue)
      })

      // Verificar que el usuario esté autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Error de autenticación:', authError)
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.')
        return
      }

      if (user.id !== userId) {
        console.error('ID de usuario no coincide')
        alert('Error de autenticación. ID de usuario no coincide.')
        return
      }

      // Primero verificar si ya existe un presupuesto para esta categoría en este mes
      const { data: existingBudget, error: checkError } = await supabase
        .from('presupuestos')
        .select('id')
        .eq('usuario_id', userId)
        .eq('categorias', selectedCategory)
        .eq('mes', monthDate.toISOString().split('T')[0])
        .maybeSingle()

      if (checkError) {
        console.error('Error verificando presupuesto existente:', checkError)
        alert(`Error al verificar presupuesto existente: ${checkError.message}`)
        return
      }

      let result
      if (existingBudget) {
        // Actualizar presupuesto existente
        console.log('📝 Actualizando presupuesto existente:', existingBudget.id)
        result = await supabase
          .from('presupuestos')
          .update({
            valor: parseFloat(budgetValue)
          })
          .eq('id', existingBudget.id)
      } else {
        // Crear nuevo presupuesto
        console.log('📝 Creando nuevo presupuesto')
        result = await supabase
          .from('presupuestos')
          .insert({
            usuario_id: userId,
            mes: monthDate.toISOString().split('T')[0],
            categorias: selectedCategory,
            valor: parseFloat(budgetValue)
          })
      }

      if (result.error) {
        console.error('❌ BUDGET - Error guardando presupuesto:', result.error)
        console.error('❌ BUDGET - Detalles del error:', {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code
        })
        alert(`Error al guardar el presupuesto: ${result.error.message}`)
        return
      }

      console.log('✅ BUDGET - Presupuesto guardado exitosamente')
      console.log('✅ BUDGET - Resultado:', result)

      // Recargar presupuestos
      await loadBudgets()
      onBudgetUpdate()
      
      // Limpiar formulario
      setSelectedCategory('')
      setBudgetValue('')
      setShowAddModal(false)
      setEditingBudget(null)

    } catch (error) {
      console.error('Error inesperado:', error)
      alert(`Error inesperado al guardar el presupuesto: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setSaving(false)
    }
  }

  // Eliminar presupuesto
  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) return

    try {
      console.log('🗑️ BUDGET - Eliminando presupuesto:', budgetId)

      // Verificar que el usuario esté autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('❌ BUDGET - Error de autenticación:', authError)
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.')
        return
      }

      const { error } = await supabase
        .from('presupuestos')
        .delete()
        .eq('id', budgetId)

      if (error) {
        console.error('❌ BUDGET - Error eliminando presupuesto:', error)
        console.error('❌ BUDGET - Detalles del error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        alert(`Error al eliminar el presupuesto: ${error.message}`)
        return
      }

      console.log('✅ BUDGET - Presupuesto eliminado exitosamente')
      await loadBudgets()
      onBudgetUpdate()
    } catch (error) {
      console.error('💥 BUDGET - Error inesperado:', error)
      alert(`Error inesperado al eliminar el presupuesto: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Editar presupuesto
  const handleEditBudget = (budget: CategoryBudget) => {
    setEditingBudget(budget)
    setSelectedCategory(budget.categorias)
    setBudgetValue(budget.valor.toString())
    setShowAddModal(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5ce1e6]"></div>
          <span className="ml-3 text-white/70">Cargando presupuestos...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#5ce1e6] to-[#4dd0e1] rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#0D1D35]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Presupuesto por Categorías</h2>
              <p className="text-white/70 text-sm">
                Total: {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#5ce1e6] to-[#4dd0e1] text-[#0D1D35] hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white/50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sin presupuestos</h3>
            <p className="text-white/70 text-sm mb-4">
              Configura presupuestos por categoría para mejor control
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#5ce1e6] to-[#4dd0e1] text-[#0D1D35] hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Presupuesto
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white text-lg">
                        {budget.categorias}
                      </span>
                      <span className="text-[#5ce1e6] font-bold text-lg">
                        {formatCurrency(budget.valor)}
                      </span>
                    </div>
                    <div className="text-xs text-white/50">
                      {new Date(budget.mes).toLocaleDateString('es-CO', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBudget(budget)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar/editar presupuesto */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#0D1D35] border-white/20 text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">
              {editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-white/80">
                Categoría
              </Label>
              <select
                id="categoria"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#5ce1e6]"
                required
              >
                <option value="" className="bg-[#0D1D35]">Selecciona una categoría</option>
                {gastoCategories.map(cat => (
                  <option key={cat.nombre} value={cat.nombre} className="bg-[#0D1D35]">
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="text-white/80">
                Valor
              </Label>
              <Input
                id="valor"
                type="number"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                placeholder="0"
                className="bg-white/10 border-white/20 text-white placeholder-white/40"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setEditingBudget(null)
                  setSelectedCategory('')
                  setBudgetValue('')
                }}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                disabled={saving}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={handleSaveBudget}
                disabled={saving || !selectedCategory || !budgetValue}
                className="flex-1 bg-gradient-to-r from-[#5ce1e6] to-[#4dd0e1] text-[#0D1D35] hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (editingBudget ? 'Actualizar' : 'Guardar')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
