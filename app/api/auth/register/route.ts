import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // AQUÍ INTEGRAS LA LÓGICA DE REGISTRO DE TU AMIGO
    // Ejemplo:
    // const result = await friendsRegisterFunction(name, email, password)
    
    // Por ahora, simulación
    const user = {
      id: Date.now().toString(),
      name: name,
      email: email
    }
    
    const token = 'jwt-token-' + Date.now()
    
    return NextResponse.json({
      success: true,
      user,
      token
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
} 