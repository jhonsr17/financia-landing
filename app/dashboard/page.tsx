'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { logOut } from '@/actions/auth'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#0D1D35] flex items-center justify-center'>
        <div className='text-white text-xl'>Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null // El hook useEffect se encarga de la redirección
  }

  return (
    <main className='min-h-screen bg-[#0D1D35]'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 bg-[#0D1D35]/95 backdrop-blur-sm border-b border-white/10 container mx-auto px-4 py-4 md:py-6 flex justify-between items-center'>
        <Link href='/' className='text-xl md:text-2xl font-bold text-white hover:text-[#9DFAD7] transition-colors'>
          FinancIA
        </Link>
        <div className='flex items-center space-x-4 md:space-x-6'>
          <span className='text-white/80 text-sm md:text-base'>
            Hola, {user.user_metadata?.name || user.email}
          </span>
          <Link href='/' className='text-white hover:text-[#9DFAD7] transition-colors text-sm md:text-base'>
            Inicio
          </Link>
          <button
            onClick={handleLogout}
            className='text-white hover:text-red-400 transition-colors text-sm md:text-base'
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className='container mx-auto px-4 py-8 md:py-12'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              ¡Bienvenido a tu Dashboard!
            </h1>
            <p className='text-white/80 text-base md:text-lg'>
              Aquí podrás gestionar tus finanzas con FinancIA
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                Perfil
              </h3>
              <p className='text-white/80 mb-4'>
                Gestiona tu información personal
              </p>
              <div className='space-y-2'>
                <p className='text-white/60 text-sm'>
                  <span className='font-medium'>Email:</span> {user.email}
                </p>
                <p className='text-white/60 text-sm'>
                  <span className='font-medium'>ID:</span> {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                Finanzas
              </h3>
              <p className='text-white/80 mb-4'>
                Conecta tu WhatsApp y comienza a gestionar tus finanzas
              </p>
              <button className='bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-[#0D1D35] font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300 text-sm'>
                Conectar WhatsApp
              </button>
            </div>

            <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6'>
              <h3 className='text-xl font-semibold text-white mb-4'>
                Configuración
              </h3>
              <p className='text-white/80 mb-4'>
                Personaliza tu experiencia con FinancIA
              </p>
              <button className='bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm'>
                Configurar
              </button>
            </div>
          </div>

          {/* Supabase Integration Info */}
          <div className='mt-12 bg-gradient-to-r from-[#9DFAD7]/10 to-[#D4FFB5]/10 border border-[#9DFAD7]/20 rounded-xl p-6'>
            <h3 className='text-xl font-semibold text-white mb-4'>
              🚀 Sistema de Autenticación Supabase Integrado
            </h3>
            <p className='text-white/80 mb-4'>
              El sistema de autenticación de tu amigo está completamente integrado y funcionando.
            </p>
            <div className='space-y-2 text-sm text-white/60'>
              <p>✅ Autenticación con @supabase/ssr</p>
              <p>✅ Server Actions para login/registro</p>
              <p>✅ Middleware de protección de rutas</p>
              <p>✅ Gestión de sesiones con cookies</p>
              <p>✅ Navegación dinámica</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 