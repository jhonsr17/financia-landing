import { createSupabaseClient } from '@/utils/supabase/client'
import { Transaction, TransactionCreate, CategorySummary, WeeklySummary, TransactionCategory } from '@/types/database'

export class TransactionService {
  private supabase = createSupabaseClient()

  // Obtener todas las transacciones del usuario para el mes actual
  async getMonthlyTransactions(userId: string, year?: number, month?: number): Promise<Transaction[]> {
    const now = new Date()
    const currentYear = year || now.getFullYear()
    const currentMonth = month || (now.getMonth() + 1)
    
    const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
    const endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`

    const { data, error } = await this.supabase
      .from('transacciones')
      .select('*')
      .eq('user_id', userId)
      .gte('fecha', startDate)
      .lte('fecha', endDate)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }

    return data || []
  }

  // Obtener gastos agrupados por categoría para el mes actual
  async getCategorySummary(userId: string): Promise<CategorySummary[]> {
    const transactions = await this.getMonthlyTransactions(userId)
    
    // Colores para cada categoría
    const categoryColors: Record<TransactionCategory, string> = {
      'Alimentación': '#ff6b6b',
      'Vivienda': '#45b7d1',
      'Transporte': '#4ecdc4',
      'Educación': '#f9ca24',
      'Entretenimiento y Ocio': '#6c5ce7',
      'Deudas': '#e74c3c',
      'Compras personales': '#f39c12',
      'Salud': '#a29bfe',
      'Otros': '#a0a0a0',
      'Salario': '#27ae60',
      'Bonificaciones': '#2ecc71',
      'Arriendo': '#3498db',
      'Extras': '#9b59b6',
      'Regalos': '#e67e22'
    }

    // Agrupar por categoría
    const categoryTotals: Record<string, number> = {}
    let totalSpent = 0

    transactions.forEach(transaction => {
      const categoria = transaction.categoria as TransactionCategory
      categoryTotals[categoria] = (categoryTotals[categoria] || 0) + transaction.monto
      totalSpent += transaction.monto
    })

    // Convertir a formato CategorySummary
    const summary: CategorySummary[] = Object.entries(categoryTotals)
      .map(([categoria, total]) => ({
        categoria: categoria as TransactionCategory,
        total,
        porcentaje: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
        color: categoryColors[categoria as TransactionCategory] || categoryColors['Otros']
      }))
      .sort((a, b) => b.total - a.total)

    return summary
  }

  // Obtener resumen semanal de las últimas 4 semanas
  async getWeeklySummary(userId: string): Promise<WeeklySummary[]> {
    const now = new Date()
    const fourWeeksAgo = new Date(now.getTime() - (4 * 7 * 24 * 60 * 60 * 1000))
    
    const startDate = fourWeeksAgo.toISOString().split('T')[0]
    const endDate = now.toISOString().split('T')[0]

    const { data, error } = await this.supabase
      .from('transacciones')
      .select('*')
      .eq('user_id', userId)
      .gte('fecha', startDate)
      .lte('fecha', endDate)
      .order('fecha', { ascending: true })

    if (error) {
      console.error('Error fetching weekly summary:', error)
      throw error
    }

    const transactions = data || []
    
    // Agrupar por semana
    const weeklyTotals: WeeklySummary[] = []
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now.getTime() - ((3 - i) * 7 * 24 * 60 * 60 * 1000))
      const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000))
      
      weekStart.setHours(0, 0, 0, 0)
      weekEnd.setHours(23, 59, 59, 999)

      const weekTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.fecha)
        return transactionDate >= weekStart && transactionDate <= weekEnd
      })

      const total = weekTransactions.reduce((sum, t) => sum + t.monto, 0)

      weeklyTotals.push({
        week: i + 1,
        total,
        fecha_inicio: weekStart.toISOString().split('T')[0],
        fecha_fin: weekEnd.toISOString().split('T')[0]
      })
    }

    return weeklyTotals
  }

  // Calcular total gastado en el mes
  async getMonthlySpent(userId: string): Promise<number> {
    const transactions = await this.getMonthlyTransactions(userId)
    return transactions.reduce((total, transaction) => total + transaction.monto, 0)
  }

  // Crear nueva transacción
  async createTransaction(userId: string, transaction: TransactionCreate): Promise<Transaction> {
    const { data, error } = await this.supabase
      .from('transacciones')
      .insert({
        user_id: userId,
        ...transaction
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      throw error
    }

    return data
  }

  // Eliminar transacción
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('transacciones')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  }

  // Suscribirse a cambios en tiempo real
  subscribeToTransactions(userId: string, callback: (transactions: Transaction[]) => void) {
    return this.supabase
      .channel('transactions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transacciones',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          // Recargar transacciones cuando hay cambios
          this.getMonthlyTransactions(userId).then(callback)
        }
      )
      .subscribe()
  }
}

export const transactionService = new TransactionService() 