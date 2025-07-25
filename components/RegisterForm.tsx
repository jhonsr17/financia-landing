'use client'

import { useState } from 'react'
import { signUp } from '@/actions/auth'
import CountryCodeSelector from './CountryCodeSelector'

export const RegisterForm = () => {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [countryCode, setCountryCode] = useState('+57') // Default to Colombia

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('🚀 FORM SUBMIT - Iniciando proceso de registro')
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    setIsSuccessful(false)

    const formData = new FormData(e.currentTarget)
    // Añadir el código de país al número de teléfono
    const phoneNumber = formData.get('phone') as string
    const fullPhone = countryCode + phoneNumber
    console.log('📱 FORM SUBMIT - Teléfono:', { countryCode, phoneNumber, fullPhone })
    formData.set('phone', fullPhone)
    
    const form = e.currentTarget // Guardar referencia al formulario
    
    console.log('📋 FORM SUBMIT - FormData preparado:', {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: '***'
    })
    
    try {
      console.log('🔄 FORM SUBMIT - Llamando a signUp...')
      const result = await signUp(formData)
      console.log('✅ FORM SUBMIT - Resultado:', result)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
        setIsSuccessful(true)
        // Limpiar formulario después de mostrar éxito
        setTimeout(() => {
          form.reset()
        }, 3000) // Limpiar después de 3 segundos
      } else {
        setError('Error inesperado. Intenta nuevamente')
      }
    } catch (error) {
      console.error('❌ FORM SUBMIT - Error catch:', error)
      setError('Error de conexión. Intenta nuevamente')
    } finally {
      console.log('🏁 FORM SUBMIT - Finalizando proceso')
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {error && (
          <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-3'>
            <p className='text-red-400 text-sm'>{error}</p>
          </div>
        )}

        {success && (
          <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-3'>
            <p className='text-green-400 text-sm'>{success}</p>
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label 
              htmlFor='name' 
              className='block text-white font-medium mb-2'
            >
              Nombre completo
            </label>
            <input
              type='text'
              id='name'
              name='name'
              required
              disabled={isLoading}
              className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#9DFAD7] transition-colors'
              placeholder='Tu nombre completo'
            />
          </div>

          <div>
            <label 
              htmlFor='email' 
              className='block text-white font-medium mb-2'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              required
              disabled={isLoading}
              className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#9DFAD7] transition-colors'
              placeholder='tu@email.com'
            />
          </div>

          <div>
            <label 
              htmlFor='phone' 
              className='block text-white font-medium mb-2'
            >
              Número de teléfono
            </label>
            <div className='flex'>
              <CountryCodeSelector
                value={countryCode}
                onChange={setCountryCode}
                disabled={isLoading}
              />
              <input
                type='tel'
                id='phone'
                name='phone'
                required
                disabled={isLoading}
                className='flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-r-lg text-white placeholder-white/50 focus:outline-none focus:border-[#9DFAD7] transition-colors border-l-0'
                placeholder='300 123 4567'
                pattern='[0-9\s\-]+'
                title='Solo números, espacios y guiones'
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor='password' 
              className='block text-white font-medium mb-2'
            >
              Contraseña
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                required
                disabled={isLoading}
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#9DFAD7] transition-colors pr-12'
                placeholder='Mínimo 6 caracteres'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors'
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label 
              htmlFor='repeatPassword' 
              className='block text-white font-medium mb-2'
            >
              Confirmar contraseña
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='repeatPassword'
                name='repeatPassword'
                required
                disabled={isLoading}
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#9DFAD7] transition-colors pr-12'
                placeholder='Confirma tu contraseña'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors'
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
        </div>

        <div className='flex items-start'>
          <input
            type='checkbox'
            id='terms'
            required
            disabled={isLoading}
            className='w-4 h-4 text-[#9DFAD7] bg-white/5 border-white/10 rounded focus:ring-[#9DFAD7] focus:ring-2 mt-1'
          />
          <label htmlFor='terms' className='ml-2 text-white/80 text-sm'>
            Acepto los{' '}
            <a href='/terms' target='_blank' rel='noopener noreferrer' className='text-[#9DFAD7] hover:text-[#D4FFB5] transition-colors underline'>
              términos y condiciones
            </a>
            {' '}y la{' '}
            <a href='/privacy' target='_blank' rel='noopener noreferrer' className='text-[#9DFAD7] hover:text-[#D4FFB5] transition-colors underline'>
              política de privacidad
            </a>
          </label>
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-[#0D1D35] font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9DFAD7]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
        >
          {isLoading ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  )
} 