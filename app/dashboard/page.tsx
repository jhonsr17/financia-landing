'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { logOut } from '@/actions/auth'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { BudgetMetric } from '@/components/dashboard/BudgetMetric'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { WeeklyTrendChart } from '@/components/dashboard/WeeklyTrendChart'
import { ExpenseSummary } from '@/components/dashboard/ExpenseSummary'
import { AddTransactionForm } from '@/components/dashboard/AddTransactionForm'
import { CategoryBudgetTable } from '@/components/dashboard/CategoryBudgetTable'
import { BudgetSetupModal } from '@/components/dashboard/BudgetSetupModal'
import { useTransactions } from '@/hooks/useTransactions'
import { useBudget } from '@/hooks/useBudget'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const router = useRouter()

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    totalSpent,
    totalIncome,
    todayExpenses,
    weekExpenses,
    monthExpenses,
    expensesByCategory,
    weeklyTrend,
    refetch: refetchTransactions
  } = useTransactions()

  const {
    totalBudget,
    loading: budgetLoading,
    saveBudget
  } = useBudget()

  useEffect(() => {
    const supabase = createSupabaseClient()
    
    // Obtener el usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setIsLoading(false)
    })

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          router.push('/login')
          return
        }
        setUser(session.user)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleBudgetUpdate = async (newBudget: number) => {
    await saveBudget(newBudget)
  }

  const handleBudgetSetup = async (newBudget: number) => {
    await saveBudget(newBudget)
    setShowBudgetModal(false)
  }

  const handleCategoryClick = (category: string) => {
    console.log('Categoría seleccionada:', category)
    // TODO: Implementar filtrado por categoría
  }

  const handleWeekClick = (week: string) => {
    console.log('Semana seleccionada:', week)
    // TODO: Implementar drill-down semanal
  }

  const handleTransactionAdded = () => {
    // Recargar transacciones cuando se añade una nueva
    refetchTransactions()
  }

  if (isLoading || transactionsLoading || budgetLoading) {
    return (
      <div className="min-h-screen bg-[#0D1D35] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9DFAD7] mx-auto mb-4"></div>
          <p className="text-white/70">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (transactionsError) {
    return (
      <div className="min-h-screen bg-[#0D1D35] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-4">Error al cargar los datos</h1>
          <p className="text-white/70 mb-6">
            {transactionsError}
          </p>
          <button
            onClick={() => {
              refetchTransactions()
              window.location.reload()
            }}
            className="bg-[#9DFAD7] text-[#0D1D35] px-6 py-2 rounded-lg hover:bg-[#9DFAD7]/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Verificar si es usuario nuevo (sin transacciones)
  const isNewUser = transactions.length === 0

  return (
    <div className="min-h-screen bg-[#0D1D35]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:text-[#9DFAD7] transition-colors">
                FinancIA
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-white/80 hidden md:block">
                Hola, {user?.user_metadata?.name || user?.email}
              </span>
              <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
              <button
                onClick={handleLogout}
                className="text-white/70 hover:text-red-400 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Métrica 1: Balance/Presupuesto principal - 40% del viewport */}
        <div className="mb-8" style={{ minHeight: '40vh' }}>
                        <BudgetMetric
                totalBudget={totalBudget}
                spentAmount={totalSpent}
                totalIncome={totalIncome}
                onBudgetUpdate={handleBudgetUpdate}
                onOpenBudgetModal={() => setShowBudgetModal(true)}
                isNewUser={isNewUser}
              />
        </div>

        {/* Resumen de Gastos - Solo si hay transacciones */}
        {!isNewUser && (
          <div className="mb-8">
            <ExpenseSummary
              todayExpenses={todayExpenses}
              weekExpenses={weekExpenses}
              monthExpenses={monthExpenses}
              totalExpenses={totalSpent}
            />
          </div>
        )}

        {/* Métricas 2 y 3: Grid responsivo - Solo si hay transacciones */}
        {!isNewUser && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Métrica 2: Gastos por categoría - bottom-left */}
            <div className="order-1">
              <CategoryChart
                expensesByCategory={expensesByCategory}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Métrica 3: Tendencia semanal - bottom-right */}
            <div className="order-2">
              <WeeklyTrendChart
                weeklyData={weeklyTrend}
                onWeekClick={handleWeekClick}
              />
            </div>
          </div>
        )}

        {/* Tabla de Presupuesto por Categorías */}
        <div className="mb-8">
          <CategoryBudgetTable userId={user?.id || ''} />
        </div>

        {/* Resumen de estadísticas generales - Solo si hay transacciones */}
        {!isNewUser && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
              <h4 className="text-white/70 text-sm font-medium">Total Ingresos</h4>
              <p className="text-2xl font-bold text-green-400 mt-2">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(totalIncome)}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
              <h4 className="text-white/70 text-sm font-medium">Total Gastos</h4>
              <p className="text-2xl font-bold text-red-400 mt-2">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(totalSpent)}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
              <h4 className="text-white/70 text-sm font-medium">Balance</h4>
              <p className={`text-2xl font-bold mt-2 ${
                totalIncome - totalSpent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(totalIncome - totalSpent)}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Modal de configuración de presupuesto */}
      <BudgetSetupModal
        isOpen={showBudgetModal}
        currentBudget={totalBudget}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleBudgetSetup}
      />
    </div>
  )
} 