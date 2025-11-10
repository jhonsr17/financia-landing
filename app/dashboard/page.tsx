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
import { BudgetTable } from '@/components/dashboard/BudgetTable'
import WhatsAppChatButton from '@/components/dashboard/WhatsAppChatButton'

import { BudgetSetupModal } from '@/components/dashboard/BudgetSetupModal'
import { BudgetByCategory } from '@/components/dashboard/BudgetByCategory'
import { TransactionsTableImproved } from '@/components/dashboard/TransactionsTableImproved'
import { useTransactionsUnified } from '@/hooks/useTransactionsUnified'
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
    refetch: refetchTransactions,
    deleteTransaction
  } = useTransactionsUnified()

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

  // Determinar si es un usuario nuevo (sin transacciones)
  const isNewUser = !transactionsLoading && (!transactions || transactions.length === 0)

  // Loading state
  if (isLoading || transactionsLoading || budgetLoading) {
    return (
      <div className="min-h-screen bg-[#0D1D35] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5ce1e6] mx-auto mb-4"></div>
          <p className="text-sm sm:text-base">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1D35]">
      {/* Header Navigation - Responsivo */}
      <header className="sticky top-0 z-40 bg-[#0D1D35]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-white hover:text-[#5ce1e6] transition-colors">
                FinancIA
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-white/80 text-xs sm:text-sm">
                ¡Hola, {user?.user_metadata?.full_name || 'Usuario'}!
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Métrica 1: Balance/Presupuesto principal - Responsivo */}
        <div className="mb-6 sm:mb-8">
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
          <div className="mb-6 sm:mb-8">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Métrica 2: Gastos por categoría */}
            <div className="order-1">
              <CategoryChart
                expensesByCategory={expensesByCategory}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            {/* Métrica 3: Tendencia semanal */}
            <div className="order-2">
              <WeeklyTrendChart
                weeklyData={weeklyTrend}
                onWeekClick={handleWeekClick}
              />
            </div>
          </div>
        )}

        {/* Presupuesto por Categorías */}
        <div className="mb-6 sm:mb-8">
          <BudgetByCategory 
            userId={user?.id || ''}
            onBudgetUpdate={() => {
              // Refrescar presupuesto total
              window.location.reload()
            }}
          />
        </div>

        {/* Tabla de Transacciones Mejorada */}
        <div className="mb-6 sm:mb-8">
          <TransactionsTableImproved 
            transactions={transactions}
            onTransactionDeleted={refetchTransactions}
            onDeleteTransaction={deleteTransaction}
            loading={transactionsLoading}
          />
        </div>

        {/* Formulario para agregar transacciones - Posición fija en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24">
              <AddTransactionForm 
                onTransactionAdded={refetchTransactions}
              />
            </div>
          </div>
          
          {/* Espacio para futuras métricas o información adicional */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#5ce1e6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl sm:text-3xl">📊</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  ¡Más funciones próximamente!
                </h3>
                <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto">
                  Estamos trabajando en nuevas métricas y análisis avanzados para ayudarte a tomar mejores decisiones financieras.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Chat Button - Al final de la página */}
        <div className="mb-6 sm:mb-8">
          <WhatsAppChatButton />
        </div>
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