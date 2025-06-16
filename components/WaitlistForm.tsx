'use client'

import { useState } from 'react'

export const WaitlistForm = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || '¡Gracias por registrarte! Te contactaremos pronto.')
        setEmail('')
        setName('')
      } else {
        setMessage(data.error || 'Hubo un error. Por favor intenta de nuevo.')
      }
    } catch (error) {
      setMessage('Hubo un error. Por favor intenta de nuevo.')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo electrónico"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? 'Registrando...' : 'Unirme a la lista de espera'}
      </button>
      {message && (
        <p className={`text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </form>
  )
} 