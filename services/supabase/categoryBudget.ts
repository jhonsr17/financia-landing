import { createSupabaseClient } from '@/utils/supabase/client'
import { CategoryBudgetSummary } from '@/types/database'

export class CategoryBudgetService {
  private supabase = createSupabaseClient()

  // Obtener resumen completo de presupuesto vs gastos por categoría
  async getCategoryBudgetSummary(userId: string): Promise<CategoryBudgetSummary[]> {
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const currentMonthDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`

      // Obtener presupuestos por categoría desde Supabase
      const { data: budgets, error: budgetError } = await this.supabase
        .from('presupuesto')
        .select('categorias, valor')
        .eq('usuario_id', userId)
        .eq('mes', currentMonthDate)

      if (budgetError) {
        console.error('Error fetching budgets:', budgetError)
        // Fallback a localStorage si hay error
        return this.getCategoryBudgetSummaryFromStorage(userId)
      }

      // Obtener gastos del mes actual por categoría desde transacciones
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
          expensesByCategory[transaction.categoria] = (expensesByCategory[transaction.categoria] || 0) + Math.abs(transaction.valor || 0)
        }
      })

      // Crear mapa de presupuestos desde Supabase
      const budgetsByCategory: Record<string, number> = {}
      budgets?.forEach(budget => {
        if (budget.categorias) {
          budgetsByCategory[budget.categorias] = budget.valor || 0
        }
      })

      // Crear resumen combinando presupuestos y gastos
      const summary: CategoryBudgetSummary[] = []

      // Agregar categorías con presupuesto definido
      Object.entries(budgetsByCategory).forEach(([categoria, presupuestado]) => {
        const actual = expensesByCategory[categoria] || 0
        const excedente = presupuestado - actual
        const porcentaje_usado = presupuestado > 0 
          ? (actual / presupuestado) * 100 
          : 0

        summary.push({
          categoria,
          actual,
          presupuestado,
          excedente,
          porcentaje_usado
        })
      })

      // Agregar categorías con gastos pero sin presupuesto definido
      Object.entries(expensesByCategory).forEach(([categoria, actual]) => {
        const existsInBudgets = budgetsByCategory.hasOwnProperty(categoria)
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
    } catch (error) {
      console.error('Error getting category budget summary:', error)
      // Fallback a localStorage
      return this.getCategoryBudgetSummaryFromStorage(userId)
    }
  }

  // Guardar presupuesto de una categoría en Supabase
  async saveCategoryBudget(userId: string, categoria: string, amount: number): Promise<void> {
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const currentMonthDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`

      console.log('Guardando presupuesto:', { userId, categoria, amount, mes: currentMonthDate })

      // Verificar si ya existe un presupuesto para esta categoría este mes
      const { data: existing, error: checkError } = await this.supabase
        .from('presupuesto')
        .select('id')
        .eq('usuario_id', userId)
        .eq('mes', currentMonthDate)
        .eq('categorias', categoria)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking existing budget:', checkError)
        throw checkError
      }

      if (existing) {
        // Actualizar presupuesto existente
        const { error: updateError } = await this.supabase
          .from('presupuesto')
          .update({ valor: amount })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Error updating budget:', updateError)
          throw updateError
        }

        console.log('Presupuesto actualizado exitosamente')
      } else {
        // Crear nuevo presupuesto
        const { error: insertError } = await this.supabase
          .from('presupuesto')
          .insert({
            usuario_id: userId,
            mes: currentMonthDate,
            valor: amount,
            categorias: categoria
          })

        if (insertError) {
          console.error('Error inserting budget:', insertError)
          throw insertError
        }

        console.log('Presupuesto creado exitosamente')
      }

      // También guardamos en localStorage como backup
      this.saveCategoryBudgetToStorage(userId, categoria, amount)
    } catch (error) {
      console.error('Error saving category budget to Supabase, fallback to localStorage:', error)
      // Fallback a localStorage si falla Supabase
      this.saveCategoryBudgetToStorage(userId, categoria, amount)
    }
  }

  // Eliminar presupuesto de una categoría
  async deleteCategoryBudget(userId: string, categoria: string): Promise<void> {
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const currentMonthDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`

      console.log('Eliminando presupuesto:', { userId, categoria, mes: currentMonthDate })

      const { error } = await this.supabase
        .from('presupuesto')
        .delete()
        .eq('usuario_id', userId)
        .eq('mes', currentMonthDate)
        .eq('categorias', categoria)

      if (error) {
        console.error('Error deleting budget:', error)
        throw error
      }

      console.log('Presupuesto eliminado exitosamente')

      // También eliminar de localStorage
      this.deleteCategoryBudgetFromStorage(userId, categoria)
    } catch (error) {
      console.error('Error deleting category budget from Supabase, fallback to localStorage:', error)
      // Fallback a localStorage si falla Supabase
      this.deleteCategoryBudgetFromStorage(userId, categoria)
    }
  }

  // Métodos de fallback para localStorage
  private async getCategoryBudgetSummaryFromStorage(userId: string): Promise<CategoryBudgetSummary[]> {
    try {
      const savedBudgets = this.getCategoryBudgetsFromStorage(userId)

      // Obtener gastos desde transacciones (intentar Supabase primero)
      const expensesByCategory: Record<string, number> = {}
      try {
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear()

        const { data: transactions } = await this.supabase
          .from('transacciones')
          .select('categoria, valor')
          .eq('usuario_id', userId)
          .eq('tipo', 'gasto')
          .gte('creado_en', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
          .lt('creado_en', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)

        transactions?.forEach(transaction => {
          if (transaction.categoria) {
            expensesByCategory[transaction.categoria] = (expensesByCategory[transaction.categoria] || 0) + Math.abs(transaction.valor || 0)
          }
        })
      } catch (error) {
        console.error('Error fetching transactions for localStorage fallback:', error)
      }

      // Crear resumen
      const summary: CategoryBudgetSummary[] = []
      Object.entries(savedBudgets).forEach(([categoria, presupuestado]) => {
        const actual = expensesByCategory[categoria] || 0
        const excedente = presupuestado - actual
        const porcentaje_usado = presupuestado > 0 ? (actual / presupuestado) * 100 : 0

        summary.push({
          categoria,
          actual,
          presupuestado,
          excedente,
          porcentaje_usado
        })
      })

      return summary.sort((a, b) => b.actual - a.actual)
    } catch (error) {
      console.error('Error getting category budget summary from storage:', error)
      return []
    }
  }

  private saveCategoryBudgetToStorage(userId: string, categoria: string, amount: number): void {
    try {
      const savedBudgets = this.getCategoryBudgetsFromStorage(userId)
      savedBudgets[categoria] = amount
      localStorage.setItem(`category_budgets_${userId}`, JSON.stringify(savedBudgets))
    } catch (error) {
      console.error('Error saving category budget to storage:', error)
    }
  }

  private deleteCategoryBudgetFromStorage(userId: string, categoria: string): void {
    try {
      const savedBudgets = this.getCategoryBudgetsFromStorage(userId)
      delete savedBudgets[categoria]
      localStorage.setItem(`category_budgets_${userId}`, JSON.stringify(savedBudgets))
    } catch (error) {
      console.error('Error deleting category budget from storage:', error)
    }
  }

  private getCategoryBudgetsFromStorage(userId: string): Record<string, number> {
    try {
      const saved = localStorage.getItem(`category_budgets_${userId}`)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.warn('Error reading category budgets from storage:', error)
      return {}
    }
  }

  // Suscribirse a cambios en tiempo real
  subscribeToCategoryBudgets(userId: string, callback: () => void) {
    // Suscripción a cambios en Supabase
    const supabaseSubscription = this.supabase
      .channel('presupuesto_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presupuesto',
          filter: `usuario_id=eq.${userId}`
        },
        () => {
          console.log('Cambio detectado en presupuestos, recargando...')
          callback()
        }
      )
      .subscribe()

    // También suscripción a localStorage para fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `category_budgets_${userId}`) {
        callback()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return {
      unsubscribe: () => {
        supabaseSubscription.unsubscribe()
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }
}

// Instancia singleton
export const categoryBudgetService = new CategoryBudgetService() 