'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export interface Transaction {
  id: string
  user_id: string
  monto: number
  categoria: string | null
  tipo: string | null
  descripcion: string | null
  fecha: string | null
  created_at: string | null
  updated_at: string | null
}

export interface WeeklyData {
  week: string
  amount: number
  date: string
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient()

  // Obtener usuario autenticado
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log('Cargando transacciones para usuario:', user.id)
      
      // Intentar con estructura principal
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        
        // Intentar con estructura alternativa
        const { data: altData, error: altError } = await supabase
          .from('transacciones')
          .select('*')
          .eq('usuario_id', user.id)
          .order('creado_en', { ascending: false })
        
        if (altError) {
          console.error('Error with alternative structure:', altError)
          setError(`Error al cargar transacciones: ${error.message}`)
          setTransactions([])
        } else {
          console.log('Transacciones cargadas con estructura alternativa:', altData?.length || 0)
          // Mapear a estructura unificada
          const mappedData = (altData || []).map(t => ({
            id: t.id,
            user_id: t.usuario_id,
            monto: t.valor || t.monto,
            categoria: t.categoria,
            tipo: t.tipo,
            descripcion: t.descripcion,
            fecha: t.fecha || t.creado_en?.split('T')[0],
            created_at: t.creado_en || t.created_at,
            updated_at: t.updated_at
          }))
          setTransactions(mappedData)
        }
      } else {
        console.log('Transacciones cargadas:', data?.length || 0)
        setTransactions(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error al cargar transacciones')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions()
      
      // Suscribirse a cambios en tiempo real
      const subscription = supabase
        .channel('transacciones_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transacciones',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            console.log('Cambio detectado en transacciones, recargando...')
            fetchTransactions()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  // Función auxiliar para verificar si una fecha está dentro de un rango
  const isDateInRange = (transactionDate: string, startDate: Date, endDate: Date) => {
    const tDate = new Date(transactionDate)
    return tDate >= startDate && tDate <= endDate
  }

  // Cálculos derivados
  const totalSpent = transactions
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + (t.monto || 0), 0)

  const totalIncome = transactions
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + (t.monto || 0), 0)

  // Gastos de hoy
  const todayExpenses = transactions
    .filter(t => {
      if (!t.created_at || t.tipo !== 'gasto') return false
      const today = new Date()
      const transactionDate = new Date(t.created_at)
      return today.toDateString() === transactionDate.toDateString()
    })
    .reduce((sum, t) => sum + (t.monto || 0), 0)

  // Gastos de esta semana (últimos 7 días)
  const weekExpenses = transactions
    .filter(t => {
      if (!t.created_at || t.tipo !== 'gasto') return false
      const today = new Date()
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const transactionDate = new Date(t.created_at)
      return transactionDate >= sevenDaysAgo && transactionDate <= today
    })
    .reduce((sum, t) => sum + (t.monto || 0), 0)

  // Gastos de este mes
  const monthExpenses = transactions
    .filter(t => {
      if (!t.created_at || t.tipo !== 'gasto') return false
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)
      const transactionDate = new Date(t.created_at)
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth
    })
    .reduce((sum, t) => sum + (t.monto || 0), 0)

  // Gastos por categoría
  const expensesByCategory = transactions
    .filter(t => t.tipo === 'gasto' && t.categoria)
    .reduce((acc, t) => {
      const category = t.categoria!
      acc[category] = (acc[category] || 0) + (t.monto || 0)
      return acc
    }, {} as Record<string, number>)

  // Tendencia semanal para las últimas 4 semanas
  const getWeeklyTrend = (): WeeklyData[] => {
    const weeks: WeeklyData[] = []
    const today = new Date()
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      
      const weekSpent = transactions
        .filter(t => {
          if (!t.created_at || t.tipo !== 'gasto') return false
          const transactionDate = new Date(t.created_at)
          return transactionDate >= weekStart && transactionDate < weekEnd
        })
        .reduce((sum, t) => sum + (t.monto || 0), 0)

      weeks.push({
        week: i === 0 ? 'Esta semana' : `Sem ${4 - i}`,
        amount: weekSpent,
        date: `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('es', { month: 'short' })}`
      })
    }
    
    return weeks.reverse()
  }

  return {
    transactions,
    loading,
    error,
    totalSpent,
    totalIncome,
    todayExpenses,
    weekExpenses,
    monthExpenses,
    expensesByCategory,
    weeklyTrend: getWeeklyTrend(),
    refetch: fetchTransactions,
    user
  }
} 