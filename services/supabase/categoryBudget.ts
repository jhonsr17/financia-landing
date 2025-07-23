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

      // Obtener presupuestos por categoría desde localStorage
      const savedBudgets = this.getCategoryBudgetsFromStorage(userId)

      // Obtener gastos del mes actual por categoría desde transacciones
      const { data: transactions, error: transError } = await this.supabase
        .from('transacciones')
        .select('categoria, monto')
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
          expensesByCategory[transaction.categoria] = (expensesByCategory[transaction.categoria] || 0) + Math.abs(transaction.monto || 0)
        }
      })

      // Crear resumen combinando presupuestos y gastos
      const summary: CategoryBudgetSummary[] = []

      // Agregar categorías con presupuesto definido
      Object.entries(savedBudgets).forEach(([categoria, presupuestado]) => {
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
        const existsInBudgets = savedBudgets.hasOwnProperty(categoria)
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
      throw error
    }
  }

  // Guardar presupuesto de una categoría en localStorage
  async saveCategoryBudget(userId: string, categoria: string, amount: number): Promise<void> {
    try {
      const savedBudgets = this.getCategoryBudgetsFromStorage(userId)
      savedBudgets[categoria] = amount
      
      localStorage.setItem(`category_budgets_${userId}`, JSON.stringify(savedBudgets))
    } catch (error) {
      console.error('Error saving category budget:', error)
      throw error
    }
  }

  // Eliminar presupuesto de una categoría
  async deleteCategoryBudget(userId: string, categoria: string): Promise<void> {
    try {
      const savedBudgets = this.getCategoryBudgetsFromStorage(userId)
      delete savedBudgets[categoria]
      
      localStorage.setItem(`category_budgets_${userId}`, JSON.stringify(savedBudgets))
    } catch (error) {
      console.error('Error deleting category budget:', error)
      throw error
    }
  }

  // Obtener presupuestos desde localStorage
  private getCategoryBudgetsFromStorage(userId: string): Record<string, number> {
    try {
      const saved = localStorage.getItem(`category_budgets_${userId}`)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.warn('Error reading category budgets from storage:', error)
      return {}
    }
  }

  // Suscribirse a cambios en tiempo real (mock para compatibilidad)
  subscribeToCategoryBudgets(userId: string, callback: () => void) {
    // Para localStorage, podemos simular suscripción con eventos de storage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `category_budgets_${userId}`) {
        callback()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return {
      unsubscribe: () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }
}

// Instancia singleton
export const categoryBudgetService = new CategoryBudgetService() 