import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // AQUÍ INTEGRAS LA LÓGICA DE LOGIN DE TU AMIGO
    // Ejemplo:
    // const result = await friendsLoginFunction(email, password)
    
    // Por ahora, simulación
    if (email === 'demo@financia.com' && password === 'demo123') {
      const user = {
        id: '1',
        name: 'Usuario Demo',
        email: email
      }
      
      const token = 'jwt-token-' + Date.now()
      
      return NextResponse.json({
        success: true,
        user,
        token
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Credenciales inválidas' },
      { status: 401 }
    )
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
} 