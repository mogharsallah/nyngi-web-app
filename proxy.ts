import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/server/lib/supabase/middleware'

// 1. Specify protected and public routes
const protectedRoutes = ['/app']
const publicRoutes = ['/login', '/signup', '/']

export async function proxy(request: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  if (isProtectedRoute) {
    return await updateSession(request)
  } else if (isPublicRoute) {
    // Allow access to public routes without session checks
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
