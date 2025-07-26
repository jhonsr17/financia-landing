'use client'

import { useState, useEffect } from 'react'
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
      
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        
        // Intentar con la estructura alternativa si falla
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
      
      // Suscribirse a cambios en tiempo real - CORREGIDO para usar usuario_id
      const subscription = supabase
        .channel('transacciones_unified')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transacciones',
            filter: `usuario_id=eq.${user.id}` // 🎯 CORREGIDO: usar usuario_id en lugar de user_id
          },
          (payload) => {
            console.log('🔄 Cambio detectado en transacciones:', payload)
            console.log('🔃 Recargando datos de transacciones...')
            fetchTransactions()
          }
        )
        .subscribe()

      // También intentar con estructura alternativa si la primera no funciona
      const subscriptionAlt = supabase
        .channel('transacciones_alt')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transacciones',
            filter: `user_id=eq.${user.id}` // Fallback para user_id
          },
          (payload) => {
            console.log('🔄 Cambio detectado en transacciones (alt):', payload)
            console.log('🔃 Recargando datos de transacciones...')
            fetchTransactions()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
        subscriptionAlt.unsubscribe()
      }
    }
  }, [user])

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

  // Gastos de esta semana
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
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const transactionDate = new Date(t.created_at)
      return transactionDate >= firstDayOfMonth && transactionDate <= today
    })
    .reduce((sum, t) => sum + (t.monto || 0), 0)

  // Gastos por categoría
  const expensesByCategory = transactions
    .filter(t => t.tipo === 'gasto' && t.categoria)
    .reduce((acc, t) => {
      if (t.categoria) {
        acc[t.categoria] = (acc[t.categoria] || 0) + (t.monto || 0)
      }
      return acc
    }, {} as Record<string, number>)

  // Tendencia semanal (últimas 4 semanas)
  const getWeeklyTrend = () => {
    console.log('🔄 Calculando tendencia semanal con', transactions.length, 'transacciones')
    
    const weeks = []
    const today = new Date()
    
    for (let i = 3; i >= 0; i--) {
      // Calcular el inicio de la semana (lunes)
      const currentWeekStart = new Date(today)
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Ir al lunes de esta semana
      
      const weekStart = new Date(currentWeekStart.getTime() - (i * 7 * 24 * 60 * 60 * 1000))
      const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000))
      weekEnd.setHours(23, 59, 59, 999) // Final del domingo
      
      const weekTransactions = transactions.filter(t => {
        if (!t.created_at || t.tipo !== 'gasto') return false
        const transactionDate = new Date(t.created_at)
        return transactionDate >= weekStart && transactionDate <= weekEnd
      })
      
      const weekTotal = weekTransactions.reduce((sum, t) => sum + (t.monto || 0), 0)
      
      const weekLabel = i === 0 ? 'Esta semana' : `Hace ${i} semana${i > 1 ? 's' : ''}`
      
      console.log(`📊 Semana ${4 - i}:`, {
        label: weekLabel,
        inicio: weekStart.toLocaleDateString(),
        fin: weekEnd.toLocaleDateString(),
        transacciones: weekTransactions.length,
        total: weekTotal
      })
      
      weeks.push({
        amount: weekTotal,
        date: weekStart.toLocaleDateString('es-CO'),
        week: weekLabel
      })
    }
    
    console.log('📈 Tendencia semanal completa:', weeks)
    return weeks
  }

  // Crear nueva transacción
  const createTransaction = async (transactionData: {
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
    createTransaction,
    user
  }
} 