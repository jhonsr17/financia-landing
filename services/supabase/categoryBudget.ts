import { createSupabaseClient } from '@/utils/supabase/client'
import { CategoryBudget, CategoryBudgetCreate, CategoryBudgetSummary } from '@/types/database'

export class CategoryBudgetService {
  private supabase = createSupabaseClient()

  // Obtener presupuestos por categoría del mes actual
  async getCurrentCategoryBudgets(userId: string): Promise<CategoryBudget[]> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1

    const { data, error } = await this.supabase
      .from('presupuestos')
      .select('*')
      .eq('usuario_id', userId)
      .eq('mes', currentMonth)

    if (error) {
      console.error('Error fetching category budgets:', error)
      throw error
    }

    return data || []
  }

  // Crear o actualizar presupuesto de una categoría
  async saveCategoryBudget(userId: string, categoria: string, amount: number): Promise<CategoryBudget> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1

    // Intentar actualizar primero
    const { data: updateData, error: updateError } = await this.supabase
      .from('presupuestos')
      .update({ 
        valor: amount
      })
      .eq('usuario_id', userId)
      .eq('categoria_id', categoria)
      .eq('mes', currentMonth)
      .select()
      .single()

    if (updateData && !updateError) {
      return updateData
    }

    // Si no existe, crear nuevo
    const { data: insertData, error: insertError } = await this.supabase
      .from('presupuestos')
      .insert({
        usuario_id: userId,
        categoria_id: categoria,
        valor: amount,
        mes: currentMonth
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving category budget:', insertError)
      throw insertError
    }

    return insertData
  }

  // Obtener resumen completo de presupuesto vs gastos por categoría
  async getCategoryBudgetSummary(userId: string): Promise<CategoryBudgetSummary[]> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Obtener presupuestos por categoría
    const budgets = await this.getCurrentCategoryBudgets(userId)

    // Obtener gastos del mes actual por categoría
    const { data: transactions, error: transError } = await this.supabase
      .from('transacciones')
      .select('categoria, valor')
      .eq('usuario_id', userId)
      .eq('tipo', 'gasto')
      .gte('creado_en', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
      .lt('creado_en', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)

    if (transError) {
      console.error('Error fetching transactions for budget summary:', transError)
      throw transError
    }

    // Agrupar gastos por categoría
    const expensesByCategory: Record<string, number> = {}
    transactions?.forEach(transaction => {
      if (transaction.categoria) {
        expensesByCategory[transaction.categoria] = (expensesByCategory[transaction.categoria] || 0) + (transaction.valor || 0)
      }
    })

    // Crear resumen combinando presupuestos y gastos
    const summary: CategoryBudgetSummary[] = []

    // Agregar categorías con presupuesto definido
    budgets.forEach(budget => {
      const actual = expensesByCategory[budget.categoria_id] || 0
      const excedente = budget.valor - actual
      const porcentaje_usado = budget.valor > 0 
        ? (actual / budget.valor) * 100 
        : 0

      summary.push({
        categoria: budget.categoria_id,
        actual,
        presupuestado: budget.valor,
        excedente,
        porcentaje_usado
      })
    })

    // Agregar categorías con gastos pero sin presupuesto definido
    Object.entries(expensesByCategory).forEach(([categoria, actual]) => {
      const existsInBudgets = budgets.some(b => b.categoria_id === categoria)
      if (!existsInBudgets && actual > 0) {
        summary.push({
          categoria,
          actual,
          presupuestado: 0,
          excedente: -actual,
          porcentaje_usado: 0
        })
      }
    })

    // Ordenar por mayor gasto
    return summary.sort((a, b) => b.actual - a.actual)
  }

  // Eliminar presupuesto de una categoría
  async deleteCategoryBudget(userId: string, categoria: string): Promise<void> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1

    const { error } = await this.supabase
      .from('presupuestos')
      .delete()
      .eq('usuario_id', userId)
      .eq('categoria_id', categoria)
      .eq('mes', currentMonth)

    if (error) {
      console.error('Error deleting category budget:', error)
      throw error
    }
  }

  // Suscribirse a cambios en tiempo real
  subscribeToCategoryBudgets(userId: string, callback: (budgets: CategoryBudget[]) => void) {
    return this.supabase
      .channel('category-budgets')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'presupuestos',
          filter: `usuario_id=eq.${userId}`
        }, 
        () => {
          // Recargar presupuestos cuando hay cambios
          this.getCurrentCategoryBudgets(userId).then(callback)
        }
      )
      .subscribe()
  }
}

// Instancia singleton
export const categoryBudgetService = new CategoryBudgetService() 