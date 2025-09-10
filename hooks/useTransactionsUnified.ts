'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export interface UnifiedTransaction {
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

export const useTransactionsUnified = () => {
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient()

  // Obtener usuario autenticado - Solo una vez
  useEffect(() => {
    let mounted = true
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
        }
      } catch (err) {
        console.error('Error getting user:', err)
      }
    }
    
    getUser()
    
    return () => {
      mounted = false
    }
  }, []) // Sin dependencias para evitar re-ejecuciones

  // Función para cargar transacciones - Memoizada
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        setError(`Error al cargar transacciones: ${error.message}`)
        setTransactions([])
      } else {
        setTransactions(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error al cargar transacciones')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  // Cargar transacciones cuando el usuario cambie - Solo cuando sea necesario
  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user, fetchTransactions])

  // Cálculos derivados - Optimizados con useMemo
  const totalSpent = useMemo(() => 
    transactions
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + (t.monto || 0), 0), 
    [transactions]
  )

  const totalIncome = useMemo(() => 
    transactions
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + (t.monto || 0), 0), 
    [transactions]
  )

  // Gastos de hoy
  const todayExpenses = useMemo(() => {
    const today = new Date()
    return transactions
      .filter(t => {
        if (!t.created_at || t.tipo !== 'gasto') return false
        const transactionDate = new Date(t.created_at)
        return today.toDateString() === transactionDate.toDateString()
      })
      .reduce((sum, t) => sum + (t.monto || 0), 0)
  }, [transactions])

  // Gastos de esta semana
  const weekExpenses = useMemo(() => {
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return transactions
      .filter(t => {
        if (!t.created_at || t.tipo !== 'gasto') return false
        const transactionDate = new Date(t.created_at)
        return transactionDate >= sevenDaysAgo && transactionDate <= today
      })
      .reduce((sum, t) => sum + (t.monto || 0), 0)
  }, [transactions])

  // Gastos de este mes
  const monthExpenses = useMemo(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    return transactions
      .filter(t => {
        if (!t.created_at || t.tipo !== 'gasto') return false
        const transactionDate = new Date(t.created_at)
        return transactionDate >= firstDayOfMonth && transactionDate <= today
      })
      .reduce((sum, t) => sum + (t.monto || 0), 0)
  }, [transactions])

  // Gastos por categoría
  const expensesByCategory = useMemo(() => 
    transactions
      .filter(t => t.tipo === 'gasto' && t.categoria)
      .reduce((acc, t) => {
        if (t.categoria) {
          acc[t.categoria] = (acc[t.categoria] || 0) + (t.monto || 0)
        }
        return acc
      }, {} as Record<string, number>), 
    [transactions]
  )

  // Tendencia semanal - Optimizada y sin logs
  const weeklyTrend = useMemo(() => {
    if (transactions.length === 0) {
      return []
    }
    
    const weeks = []
    const today = new Date()
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today.getTime() - (i * 7 * 24 * 60 * 60 * 1000))
      const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000))
      
      const weekTransactions = transactions.filter(t => {
        if (!t.created_at || t.tipo !== 'gasto') return false
        const transactionDate = new Date(t.created_at)
        return transactionDate >= weekStart && transactionDate <= weekEnd
      })
      
      const weekTotal = weekTransactions.reduce((sum, t) => sum + (t.monto || 0), 0)
      const weekLabel = i === 0 ? 'Esta semana' : `Hace ${i} semana${i > 1 ? 's' : ''}`
      
      weeks.push({
        amount: weekTotal,
        date: weekStart.toLocaleDateString('es-CO'),
        week: weekLabel
      })
    }
    
    return weeks
  }, [transactions])

  // Crear nueva transacción
  const createTransaction = useCallback(async (transactionData: {
    monto: number
    categoria: string
    tipo: 'gasto' | 'ingreso'
    descripcion?: string
  }) => {
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('transacciones')
      .insert({
        user_id: user.id,
        monto: transactionData.monto,
        categoria: transactionData.categoria,
        tipo: transactionData.tipo,
        descripcion: transactionData.descripcion || null,
        fecha: new Date().toISOString().split('T')[0]
      })
      .select()

    if (error) {
      console.error('Error creating transaction:', error)
      throw error
    }

    return data[0]
  }, [user, supabase])

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
    weeklyTrend,
    refetch: fetchTransactions,
    createTransaction,
    user
  }
}