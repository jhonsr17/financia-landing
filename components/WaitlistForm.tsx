'use client'

import { useState, useCallback } from 'react'

export const WaitlistForm = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('El correo es requerido')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Por favor ingresa un correo válido')
      return false
    }
    setEmailError('')
    return true
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('¡Gracias por registrarte! Te contactaremos pronto.')
        setEmail('')
        setName('')
      } else {
        throw new Error(data.error || 'Error del servidor')
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || 'Hubo un error. Por favor intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-[#0D1D35]/60 to-[#0D1D35]/40 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/10 hover:border-[#9DFAD7]/20 transition-all duration-300">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-transparent bg-clip-text">
          ¡Únete a la revolución financiera!
        </h2>
        <p className="text-white/70">
          Sé de los primeros en experimentar el futuro de las finanzas personales 🚀
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#9DFAD7] focus:border-transparent transition-all group-hover:border-white/30"
            />
          </div>
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) validateEmail(e.target.value)
              }}
              placeholder="Correo electrónico"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                emailError ? 'border-red-400' : 'border-white/20'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#9DFAD7] focus:border-transparent transition-all group-hover:border-white/30`}
              required
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-400">{emailError}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#9DFAD7] to-[#D4FFB5] text-[#0D1D35] font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#9DFAD7]/20"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[#0D1D35] border-t-transparent rounded-full animate-spin mr-2"></div>
              Registrando...
            </div>
          ) : (
            'Asegura tu lugar'
          )}
        </button>

        {message && (
          <div 
            className={`p-4 rounded-xl ${
              message.includes('error') || message.includes('Hubo un error')
                ? 'bg-red-500/20 text-red-200 border border-red-500/20' 
                : 'bg-[#9DFAD7]/10 text-[#9DFAD7] border border-[#9DFAD7]/20'
            } animate-fade-in`}
          >
            <p className="text-sm">{message}</p>
          </div>
        )}
      </form>
    </div>
  )
} 