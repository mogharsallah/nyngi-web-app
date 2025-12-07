import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/server/lib/supabase/middleware'
import { apiAuthMiddleware } from '@/server/lib/api/middleware'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/health') || request.nextUrl.pathname.startsWith('/api/webhooks')) {
    const apiAuthResponse = await apiAuthMiddleware(request)
    if (apiAuthResponse) {
      return apiAuthResponse
    } else return NextResponse.next({ request })
  }

  return await updateSession(request)
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
