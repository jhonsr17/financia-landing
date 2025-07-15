'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token guardado al iniciar
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Aquí podrías verificar el token con el backend de tu amigo
      // Por ahora, simulamos que el token es válido
      const savedUser = localStorage.getItem('user_data')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // AQUÍ ES DONDE INTEGRARÍAS LA LÓGICA DE LOGIN DE TU AMIGO
      // Ejemplo de cómo sería la integración:
      
      // Opción 1: Si tu amigo tiene una API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // })
      
      // Opción 2: Si tu amigo tiene una función de login
      // const { user, token } = await friendsLoginFunction(email, password)
      
      // Por ahora, simulamos una autenticación exitosa
      const mockUser: User = {
        id: '1',
        name: 'Usuario Demo',
        email: email
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
      setUser(mockUser)
      
    } catch (error) {
      throw new Error('Error al iniciar sesión')
    }
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // AQUÍ ES DONDE INTEGRARÍAS LA LÓGICA DE REGISTRO DE TU AMIGO
      // Ejemplo de cómo sería la integración:
      
      // Opción 1: Si tu amigo tiene una API
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ name, email, password }),
      // })
      
      // Opción 2: Si tu amigo tiene una función de registro
      // const { user, token } = await friendsRegisterFunction(name, email, password)
      
      // Por ahora, simulamos un registro exitoso
      const mockUser: User = {
        id: '1',
        name: name,
        email: email
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user_data', JSON.stringify(mockUser))
      
      setUser(mockUser)
      
    } catch (error) {
      throw new Error('Error al crear la cuenta')
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para verificar si el usuario está autenticado
export const useRequireAuth = () => {
  const { user, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !user) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login'
    }
  }, [user, isLoading])
  
  return { user, isLoading }
} 