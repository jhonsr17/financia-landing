import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Agregar headers de seguridad y rendimiento
  const { pathname } = request.nextUrl

  // Detectar sesión de Supabase por cookies (v2 usa cookies sb-... auth token)
  const cookies = request.cookies.getAll()
  const hasSupabaseSession = cookies.some(c =>
    c.name.includes('sb') && (
      c.name.includes('auth') || c.name.includes('access-token') || c.name.includes('refresh-token')
    )
  )

  // Redirigir a dashboard si ya está autenticado y está en landing/login/register
  if (hasSupabaseSession && (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const url = new URL('/dashboard', request.url)
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