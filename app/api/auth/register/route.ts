import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  console.log('🚀🚀🚀 API ROUTE CALLED - /api/auth/register')
  console.log('⏰⏰⏰ API ROUTE - Timestamp:', new Date().toISOString())
  
  try {
    const body = await request.json()
    console.log('📥📥📥 API ROUTE - Body recibido:', body)
    
    const { name, email, phone, password, repeatPassword } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }
    if (password !== repeatPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    console.log('🔍 API ROUTE - Datos extraídos:', {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: '***',
      repeatPassword: '***'
    })

    console.log('✅ API ROUTE - Todas las validaciones pasaron')

    const supabase = await createSupabaseClient()
    console.log('🔗 API ROUTE - Cliente Supabase creado')

    console.log('📝 API ROUTE - Iniciando auth.signUp...')
    
    // Create user in Supabase Auth with phone in metadata
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
        data: {
          full_name: name.trim(),
          phone: phone.trim() // 👈 Guardar teléfono en metadata
        }
      }
    });

    console.log('📊 API ROUTE - Resultado auth.signUp:', { 
      userId: data?.user?.id, 
      error: error?.message,
      userMetadata: data?.user?.user_metadata
    })

    if (error) {
      console.log('❌ API ROUTE - Error en auth.signUp:', error)
      return NextResponse.json({ 
        error: `Error al crear la cuenta: ${error.message}` 
      }, { status: 400 })
    }

    if (!data?.user) {
      console.log('❌ API ROUTE - No se creó el usuario')
      return NextResponse.json({ 
        error: 'Error al crear la cuenta' 
      }, { status: 400 })
    }

    // ✅ NUEVO FLUJO: Solo guardamos en metadata, el trigger se encarga del resto
    console.log('⏳ API ROUTE - Datos guardados en auth.user_metadata, esperando confirmación de email')
    console.log('📋 API ROUTE - Metadata guardado:', {
      full_name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    })
    
    console.log('🏆 API ROUTE - Registro completado exitosamente')

    return NextResponse.json({ 
      success: 'Cuenta creada exitosamente. Revisa tu email para confirmarla' 
    })

  } catch (error) {
    console.log('💥 API ROUTE - Error general:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
} 