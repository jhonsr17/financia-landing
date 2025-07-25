import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  // ===== LOGS DE DEBUG INICIALES MÁS VISIBLES =====
  console.log('🚀🚀🚀 API ROUTE CALLED - /api/auth/register')
  console.log('⏰⏰⏰ API ROUTE - Timestamp:', new Date().toISOString())
  
  try {
    const body = await request.json()
    console.log('📥📥📥 API ROUTE - Body recibido:', body)
    
    const { name, email, phone, password, repeatPassword } = body

    console.log('🔍 API ROUTE - Datos extraídos:', { 
      name: name || 'NULL', 
      email: email || 'NULL', 
      phone: phone || 'NULL',
      password: password ? '***' : 'NULL',
      repeatPassword: repeatPassword ? '***' : 'NULL'
    })

    // Validaciones básicas
    if (!name || !email || !phone || !password || !repeatPassword) {
      console.log('❌ API ROUTE - Validación falló: campos faltantes')
      return NextResponse.json({
        error: "Por favor completa todos los campos"
      }, { status: 400 })
    }

    if (name.trim().length < 2) {
      console.log('❌ API ROUTE - Validación falló: nombre muy corto')
      return NextResponse.json({
        error: "El nombre debe tener al menos 2 caracteres"
      }, { status: 400 })
    }

    if (!email.includes("@")) {
      console.log('❌ API ROUTE - Validación falló: email inválido')
      return NextResponse.json({
        error: "Por favor ingresa un email válido"
      }, { status: 400 })
    }

    if (!phone || phone.length < 10) {
      console.log('❌ API ROUTE - Validación falló: teléfono inválido', { phone, length: phone?.length })
      return NextResponse.json({
        error: "Por favor ingresa un número de teléfono válido"
      }, { status: 400 })
    }

    if (password.length < 6) {
      console.log('❌ API ROUTE - Validación falló: contraseña muy corta')
      return NextResponse.json({
        error: "La contraseña debe tener al menos 6 caracteres"
      }, { status: 400 })
    }

    if (password !== repeatPassword) {
      console.log('❌ API ROUTE - Validación falló: contraseñas no coinciden')
      return NextResponse.json({
        error: "Las contraseñas no coinciden"
      }, { status: 400 })
    }

    console.log('✅ API ROUTE - Todas las validaciones pasaron')

    const supabase = await createSupabaseClient()
    console.log('🔗 API ROUTE - Cliente Supabase creado')

    // 1. Crear usuario en auth.users
    console.log('📝 API ROUTE - Iniciando auth.signUp...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
        data: {
          full_name: name.trim()
        }
      }
    })

    console.log('📊 API ROUTE - Resultado auth.signUp:', { 
      userId: data.user?.id, 
      error: error?.message 
    })

    // 2. Si el registro fue exitoso, usar UPSERT en lugar de INSERT
    if (!error && data.user && (name || phone)) {
      try {
        console.log('💾 API ROUTE - Iniciando UPSERT en tabla usuarios...')
        console.log('📋 API ROUTE - Datos para UPSERT:', {
          id: data.user.id,
          nombre: name.trim(),
          gmail: email.trim(),
          telefono: phone.trim()
        })

        const { data: upsertData, error: userError } = await supabase
          .from('usuarios')
          .upsert({
            id: data.user.id,
            nombre: name.trim() || null,
            gmail: email.trim(),
            telefono: phone.trim() || null
          }, {
            onConflict: 'id'
          })

        console.log('📈 API ROUTE - Resultado UPSERT usuarios:', { 
          upsertData, 
          userError: userError?.message 
        })

        if (userError) {
          console.error('🚨 API ROUTE - Error al insertar datos del usuario:', userError)
          // No fallar el registro, pero loggearlo
        } else {
          console.log('🎉 API ROUTE - UPSERT exitoso en tabla usuarios')
        }
      } catch (insertError) {
        console.error('💥 API ROUTE - Error en catch de inserción:', insertError)
        // No fallar el registro, pero loggearlo
      }
    } else {
      console.log('⚠️ API ROUTE - No se ejecutó UPSERT:', {
        hasError: !!error,
        hasUser: !!data.user,
        hasNameOrPhone: !!(name || phone)
      })
    }

    if (error) {
      console.error('🔥 API ROUTE - Error en auth.signUp:', error)
      
      if (error.message.includes("User already registered")) {
        return NextResponse.json({ error: "Ya existe una cuenta con este email" }, { status: 400 })
      }
      if (error.message.includes("Password should be at least 6 characters")) {
        return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
      }
      if (error.message.includes("Unable to validate email address")) {
        return NextResponse.json({ error: "Email no válido. Verifica el formato" }, { status: 400 })
      }
      if (error.message.includes("Password should contain")) {
        return NextResponse.json({ error: "La contraseña no cumple con los requisitos de seguridad" }, { status: 400 })
      }
      if (error.message.includes("Email rate limit exceeded")) {
        return NextResponse.json({ error: "Demasiados intentos. Espera unos minutos e intenta de nuevo" }, { status: 400 })
      }
      if (error.message.includes("Invalid email")) {
        return NextResponse.json({ error: "Email inválido. Usa un formato válido como usuario@ejemplo.com" }, { status: 400 })
      }
      
      // Log del error completo para debugging
      console.error('📋 API ROUTE - Error completo de Supabase:', {
        message: error.message,
        status: error.status
      })
      
      return NextResponse.json({ error: `Error al crear la cuenta: ${error.message}` }, { status: 400 })
    }

    console.log('🏆 API ROUTE - Registro completado exitosamente')
    return NextResponse.json({
      success: "Cuenta creada exitosamente. Revisa tu email para confirmarla"
    })
  } catch (error) {
    console.error('💣 API ROUTE - Error en catch principal:', error)
    return NextResponse.json({
      error: "Error del servidor. Verifica tu conexión e intenta más tarde"
    }, { status: 500 })
  }
} 