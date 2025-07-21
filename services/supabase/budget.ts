import { createSupabaseClient } from '@/utils/supabase/client'
import { Budget, BudgetCreate } from '@/types/database'

export class BudgetService {
  private supabase = createSupabaseClient()

  // Obtener presupuesto del mes actual
  async getCurrentBudget(userId: string): Promise<Budget | null> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const { data, error } = await this.supabase
      .from('presupuestos')
      .select('*')
      .eq('user_id', userId)
      .eq('mes', currentMonth)
      .eq('año', currentYear)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No existe presupuesto para este mes
        return null
      }
      console.error('Error fetching budget:', error)
      throw error
    }

    return data
  }

  // Crear o actualizar presupuesto del mes actual
  async saveBudget(userId: string, amount: number): Promise<Budget> {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // Intentar actualizar primero
    const { data: updateData, error: updateError } = await this.supabase
      .from('presupuestos')
      .update({ 
        monto_mensual: amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('mes', currentMonth)
      .eq('año', currentYear)
      .select()
      .single()

    if (updateData && !updateError) {
      return updateData
    }

    // Si no existe, crear nuevo
    const { data: insertData, error: insertError } = await this.supabase
      .from('presupuestos')
      .insert({
        user_id: userId,
        monto_mensual: amount,
        mes: currentMonth,
        año: currentYear
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving budget:', insertError)
      throw insertError
    }

    return insertData
  }

  // Obtener presupuesto de un mes específico
  async getBudgetByMonth(userId: string, year: number, month: number): Promise<Budget | null> {
    const { data, error } = await this.supabase
      .from('presupuestos')
      .select('*')
      .eq('user_id', userId)
      .eq('mes', month)
      .eq('año', year)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching budget by month:', error)
      throw error
    }

    return data
  }

  // Obtener todos los presupuestos del usuario
  async getAllBudgets(userId: string): Promise<Budget[]> {
    const { data, error } = await this.supabase
      .from('presupuestos')
      .select('*')
      .eq('user_id', userId)
      .order('año', { ascending: false })
      .order('mes', { ascending: false })

    if (error) {
      console.error('Error fetching all budgets:', error)
      throw error
    }

    return data || []
  }

  // Suscribirse a cambios en tiempo real
  subscribeToBudgets(userId: string, callback: (budget: Budget | null) => void) {
    return this.supabase
      .channel('budgets')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'presupuestos',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          // Recargar presupuesto cuando hay cambios
          this.getCurrentBudget(userId).then(callback)
        }
      )
      .subscribe()
  }
}

export const budgetService = new BudgetService() 