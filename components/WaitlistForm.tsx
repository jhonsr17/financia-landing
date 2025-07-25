'use client'

import { useState, useCallback } from 'react'

// Lista de países de América con sus prefijos
const countryOptions = [
  { code: 'AR', name: 'Argentina', prefix: '+54' },
  { code: 'BO', name: 'Bolivia', prefix: '+591' },
  { code: 'BR', name: 'Brasil', prefix: '+55' },
  { code: 'CA', name: 'Canadá', prefix: '+1' },
  { code: 'CL', name: 'Chile', prefix: '+56' },
  { code: 'CO', name: 'Colombia', prefix: '+57' },
  { code: 'CR', name: 'Costa Rica', prefix: '+506' },
  { code: 'CU', name: 'Cuba', prefix: '+53' },
  { code: 'DO', name: 'República Dominicana', prefix: '+1' },
  { code: 'EC', name: 'Ecuador', prefix: '+593' },
  { code: 'SV', name: 'El Salvador', prefix: '+503' },
  { code: 'GT', name: 'Guatemala', prefix: '+502' },
  { code: 'GY', name: 'Guyana', prefix: '+592' },
  { code: 'HT', name: 'Haití', prefix: '+509' },
  { code: 'HN', name: 'Honduras', prefix: '+504' },
  { code: 'JM', name: 'Jamaica', prefix: '+1' },
  { code: 'MX', name: 'México', prefix: '+52' },
  { code: 'NI', name: 'Nicaragua', prefix: '+505' },
  { code: 'PA', name: 'Panamá', prefix: '+507' },
  { code: 'PY', name: 'Paraguay', prefix: '+595' },
  { code: 'PE', name: 'Perú', prefix: '+51' },
  { code: 'PR', name: 'Puerto Rico', prefix: '+1' },
  { code: 'US', name: 'Estados Unidos', prefix: '+1' },
  { code: 'UY', name: 'Uruguay', prefix: '+598' },
  { code: 'VE', name: 'Venezuela', prefix: '+58' },
]

export const WaitlistForm = () => {
  const [name, setName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('CO') // Colombia por defecto
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const validatePhone = useCallback((phone: string) => {
    // Remover espacios y caracteres especiales
    const cleanPhone = phone.replace(/\s/g, '').replace(/[^\d]/g, '')
    
    if (!phone) {
      setPhoneError('El número de teléfono es requerido')
      return false
    }
    
    if (cleanPhone.length < 7) {
      setPhoneError('El número debe tener al menos 7 dígitos')
      return false
    }
    
    if (cleanPhone.length > 15) {
      setPhoneError('El número no puede tener más de 15 dígitos')
      return false
    }
    
    setPhoneError('')
    return true
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Solo permitir números, espacios, guiones y paréntesis
    const cleanValue = value.replace(/[^\d\s\-\(\)]/g, '')
    setPhoneNumber(cleanValue)
    
    if (phoneError) {
      validatePhone(cleanValue)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePhone(phoneNumber)) {
      return
    }

    setIsLoading(true)
    setMessage('')

    const selectedCountryData = countryOptions.find(country => country.code === selectedCountry)
    const fullPhoneNumber = `${selectedCountryData?.prefix} ${phoneNumber}`

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: fullPhoneNumber, 
          name,
          country: selectedCountryData?.name || ''
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('¡Gracias por registrarte! Te contactaremos pronto.')
        setPhoneNumber('')
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
          <div className="flex space-x-2">
            <div className="relative group flex-shrink-0">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-32 px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#9DFAD7] focus:border-transparent transition-all group-hover:border-white/30 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                {countryOptions.map((country) => (
                  <option key={country.code} value={country.code} className="bg-[#0D1D35] text-white">
                    {country.prefix}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative group flex-1">
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Número de teléfono"
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                  phoneError ? 'border-red-400' : 'border-white/20'
                } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#9DFAD7] focus:border-transparent transition-all group-hover:border-white/30`}
                required
              />
              {phoneError && (
                <p className="mt-2 text-sm text-red-400">{phoneError}</p>
              )}
            </div>
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
            'Chatea ya con FinancIA'
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