'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export const useBudget = () => {
  const [totalBudget, setTotalBudget] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const loadBudgetFromSupabase = async (userId: string) => {
    try {
      const supabase = createSupabaseClient()
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      console.log('🔍 BUDGET - Cargando presupuesto para:', { userId, mes: currentMonth, año: currentYear })

      const { data, error } = await supabase
        .from('presupuestos')
        .select('valor')
        .eq('usuario_id', userId)
        .eq('mes', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .maybeSingle()

      if (error) {
        console.error('❌ BUDGET - Error cargando presupuesto:', error)
        // Fallback a localStorage
        const savedBudget = localStorage.getItem(`budget_${userId}`)
        const budgetValue = savedBudget ? parseFloat(savedBudget) : 0
        console.log('📱 BUDGET - Usando localStorage fallback:', budgetValue)
        setTotalBudget(budgetValue)
        return
      }

      if (data?.valor) {
        console.log('✅ BUDGET - Presupuesto cargado desde Supabase:', data.valor)
        setTotalBudget(data.valor)
        // Sincronizar con localStorage como respaldo
        localStorage.setItem(`budget_${userId}`, data.valor.toString())
      } else {
        console.log('📭 BUDGET - No hay presupuesto en Supabase, usando localStorage')
        // No hay presupuesto en Supabase, intentar localStorage
        const savedBudget = localStorage.getItem(`budget_${userId}`)
        const budgetValue = savedBudget ? parseFloat(savedBudget) : 0
        setTotalBudget(budgetValue)
      }
    } catch (error) {
      console.error('💥 BUDGET - Error en catch:', error)
      // Fallback a localStorage en caso de error
      const savedBudget = localStorage.getItem(`budget_${userId}`)
      const budgetValue = savedBudget ? parseFloat(savedBudget) : 0
      setTotalBudget(budgetValue)
    }
  }

  useEffect(() => {
    const supabase = createSupabaseClient()
    
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      
      if (user) {
        loadBudgetFromSupabase(user.id)
      }
      
      setLoading(false)
    })

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        
        if (session?.user) {
          loadBudgetFromSupabase(session.user.id)
        } else {
          setTotalBudget(0)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const saveBudget = async (newBudget: number) => {
    if (!user) return false

    try {
      console.log('💾 BUDGET - Guardando presupuesto:', { userId: user.id, budget: newBudget })
      
      const supabase = createSupabaseClient()
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const monthDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`

      // Usar UPSERT para crear o actualizar
      const { data, error } = await supabase
        .from('presupuestos')
        .upsert({
          usuario_id: user.id,
          mes: monthDate,
          valor: newBudget
        }, {
          onConflict: 'usuario_id,mes'
        })
        .select()

      if (error) {
        console.error('❌ BUDGET - Error guardando en Supabase:', error)
        // Fallback a localStorage
        console.log('📱 BUDGET - Usando localStorage como fallback')
        localStorage.setItem(`budget_${user.id}`, newBudget.toString())
        setTotalBudget(newBudget)
        return true
      }

      console.log('✅ BUDGET - Presupuesto guardado en Supabase:', data)
      
      // Actualizar estado local
      setTotalBudget(newBudget)
      
      // Sincronizar con localStorage como respaldo
      localStorage.setItem(`budget_${user.id}`, newBudget.toString())
      
      return true
    } catch (error) {
      console.error('💥 BUDGET - Error en catch al guardar:', error)
      
      // Fallback a localStorage
      try {
        localStorage.setItem(`budget_${user.id}`, newBudget.toString())
        setTotalBudget(newBudget)
        return true
      } catch (localError) {
        console.error('Error al guardar en localStorage:', localError)
        return false
      }
    }
  }

  return {
    totalBudget,
    loading,
    error: null,
    saveBudget,
    user,
    refetch: () => user ? loadBudgetFromSupabase(user.id) : Promise.resolve()
  }
} 