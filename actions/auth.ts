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
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeatPassword") as string;

  // Validaciones básicas
  if (!name || !email || !password || !repeatPassword) {
    return {
      error: "Por favor completa todos los campos"
    };
  }

  if (name.trim().length < 2) {
    return {
      error: "El nombre debe tener al menos 2 caracteres"
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

  if (password !== repeatPassword) {
    return {
      error: "Las contraseñas no coinciden"
    };
  }

  const supabase = await createSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
          display_name: name.trim()
        }
      }
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        return { error: "Ya existe una cuenta con este email" };
      }
      if (error.message.includes("Password should be at least 6 characters")) {
        return { error: "La contraseña debe tener al menos 6 caracteres" };
      }
      return { error: "Error al crear la cuenta. Intenta nuevamente" };
    }

    return {
      success: "Cuenta creada exitosamente. Revisa tu email para confirmarla"
    };
  } catch (error) {
    return {
      error: "Error del servidor. Intenta más tarde"
    };
  }
}

export async function logOut() {
  const supabase = await createSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
} 