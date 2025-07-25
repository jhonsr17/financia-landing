"use server";

import { createSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validaciones básicas
  if (!email || !password) {
    return {
      error: "Por favor completa todos los campos"
    };
  }

  if (!email.includes("@")) {
    return {
      error: "Por favor ingresa un email válido"
    };
  }

  if (password.length < 6) {
    return {
      error: "La contraseña debe tener al menos 6 caracteres"
    };
  }

  const supabase = await createSupabaseClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Manejo específico de errores de Supabase
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Email o contraseña incorrectos" };
      }
      if (error.message.includes("Email not confirmed")) {
        return { error: "Por favor confirma tu email antes de iniciar sesión" };
      }
      if (error.message.includes("Too many requests")) {
        return { error: "Demasiados intentos. Intenta más tarde" };
      }
      return { error: "Error al iniciar sesión. Verifica tus datos" };
    }

    // Solo redirigir si no hay error
    redirect("/dashboard");
  } catch (error) {
    return {
      error: "Error del servidor. Intenta más tarde"
    };
  }
}

export async function signUp(formData: FormData) {
  // ===== LOGS DE DEBUG INICIALES =====
  console.log('🚀 SERVER - Función signUp iniciada');
  console.log('📥 SERVER - FormData recibido:', Array.from(formData.entries()));
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeatPassword") as string;

  console.log('🔍 SERVER - Datos extraídos:', { 
    name: name || 'NULL', 
    email: email || 'NULL', 
    phone: phone || 'NULL',
    password: password ? '***' : 'NULL',
    repeatPassword: repeatPassword ? '***' : 'NULL'
  });

  // Validaciones básicas
  if (!name || !email || !phone || !password || !repeatPassword) {
    console.log('❌ SERVER - Validación falló: campos faltantes');
    return {
      error: "Por favor completa todos los campos"
    };
  }

  if (name.trim().length < 2) {
    console.log('❌ SERVER - Validación falló: nombre muy corto');
    return {
      error: "El nombre debe tener al menos 2 caracteres"
    };
  }

  if (!email.includes("@")) {
    console.log('❌ SERVER - Validación falló: email inválido');
    return {
      error: "Por favor ingresa un email válido"
    };
  }

  if (!phone || phone.length < 10) {
    console.log('❌ SERVER - Validación falló: teléfono inválido', { phone, length: phone?.length });
    return {
      error: "Por favor ingresa un número de teléfono válido"
    };
  }

  if (password.length < 6) {
    console.log('❌ SERVER - Validación falló: contraseña muy corta');
    return {
      error: "La contraseña debe tener al menos 6 caracteres"
    };
  }

  if (password !== repeatPassword) {
    console.log('❌ SERVER - Validación falló: contraseñas no coinciden');
    return {
      error: "Las contraseñas no coinciden"
    };
  }

  console.log('✅ SERVER - Todas las validaciones pasaron');

  const supabase = await createSupabaseClient();
  console.log('🔗 SERVER - Cliente Supabase creado');

  try {
    // 1. Crear usuario en auth.users - LÓGICA DEL INSIGHTS
    console.log('📝 SERVER - Iniciando auth.signUp...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
        data: {
          full_name: name.trim()
        }
      }
    });

    console.log('📊 SERVER - Resultado auth.signUp:', { 
      userId: data.user?.id, 
      error: error?.message 
    });

    // 2. Si el registro fue exitoso, usar UPSERT en lugar de INSERT - LÓGICA DEL INSIGHTS
    if (!error && data.user && (name || phone)) {
      try {
        console.log('💾 SERVER - Iniciando UPSERT en tabla usuarios...');
        console.log('📋 SERVER - Datos para UPSERT:', {
          id: data.user.id,
          nombre: name.trim(),
          gmail: email.trim(),
          telefono: phone.trim()
        });

        const { data: upsertData, error: userError } = await supabase
          .from('usuarios')
          .upsert({
            id: data.user.id,
            nombre: name.trim() || null,
            gmail: email.trim(),
            telefono: phone.trim() || null
          }, {
            onConflict: 'id'
          });

        console.log('📈 SERVER - Resultado UPSERT usuarios:', { 
          upsertData, 
          userError: userError?.message 
        });

        if (userError) {
          console.error('🚨 SERVER - Error al insertar datos del usuario:', userError);
          // No fallar el registro, pero loggearlo
        } else {
          console.log('🎉 SERVER - UPSERT exitoso en tabla usuarios');
        }
      } catch (insertError) {
        console.error('💥 SERVER - Error en catch de inserción:', insertError);
        // No fallar el registro, pero loggearlo
      }
    } else {
      console.log('⚠️ SERVER - No se ejecutó UPSERT:', {
        hasError: !!error,
        hasUser: !!data.user,
        hasNameOrPhone: !!(name || phone)
      });
    }

    if (error) {
      console.error('🔥 SERVER - Error en auth.signUp:', error);
      
      if (error.message.includes("User already registered")) {
        return { error: "Ya existe una cuenta con este email" };
      }
      if (error.message.includes("Password should be at least 6 characters")) {
        return { error: "La contraseña debe tener al menos 6 caracteres" };
      }
      if (error.message.includes("Unable to validate email address")) {
        return { error: "Email no válido. Verifica el formato" };
      }
      if (error.message.includes("Password should contain")) {
        return { error: "La contraseña no cumple con los requisitos de seguridad" };
      }
      if (error.message.includes("Email rate limit exceeded")) {
        return { error: "Demasiados intentos. Espera unos minutos e intenta de nuevo" };
      }
      if (error.message.includes("Invalid email")) {
        return { error: "Email inválido. Usa un formato válido como usuario@ejemplo.com" };
      }
      
      // Log del error completo para debugging
      console.error('📋 SERVER - Error completo de Supabase:', {
        message: error.message,
        status: error.status
      });
      
      return { error: `Error al crear la cuenta: ${error.message}` };
    }

    console.log('🏆 SERVER - Registro completado exitosamente');
    return {
      success: "Cuenta creada exitosamente. Revisa tu email para confirmarla"
    };
  } catch (error) {
    console.error('💣 SERVER - Error en catch principal:', error);
    return {
      error: "Error del servidor. Verifica tu conexión e intenta más tarde"
    };
  }
}

export async function logOut() {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error al cerrar sesión:', error);
  }
  
  redirect("/");
} 