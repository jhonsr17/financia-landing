'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export const useBudget = () => {
  const [totalBudget, setTotalBudget] = useState(0) // Sin valor por defecto
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createSupabaseClient()
    
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      
      if (user) {
        // Cargar presupuesto desde localStorage
        const savedBudget = localStorage.getItem(`budget_${user.id}`)
        if (savedBudget) {
          setTotalBudget(parseFloat(savedBudget))
        }
      }
      
      setLoading(false)
    })

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        
        if (session?.user) {
          // Cargar presupuesto del nuevo usuario
          const savedBudget = localStorage.getItem(`budget_${session.user.id}`)
          if (savedBudget) {
            setTotalBudget(parseFloat(savedBudget))
          } else {
            setTotalBudget(0) // Sin presupuesto configurado
          }
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
      // Guardar en localStorage
      localStorage.setItem(`budget_${user.id}`, newBudget.toString())
      setTotalBudget(newBudget)
      return true
    } catch (error) {
      console.error('Error al guardar presupuesto:', error)
      return false
    }
  }

  return {
    totalBudget,
    loading,
    error: null,
    saveBudget,
    user
  }
} 