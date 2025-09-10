import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Crear cliente Supabase para middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        },
      },
    }
  )
  
  // Obtener sesión real de Supabase
  const { data: { session } } = await supabase.auth.getSession()
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = !!session?.user

  // Redirigir a dashboard si está autenticado y está en landing/login/register
  if (isAuthenticated && (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  // Redirigir a login si NO está autenticado y está en dashboard
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  const response = NextResponse.next()

  // Headers de seguridad
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Headers de rendimiento
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}