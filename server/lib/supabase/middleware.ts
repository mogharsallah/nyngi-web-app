import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Auth routes that authenticated users CAN still access
const AUTH_ROUTES_ALLOWED_WHEN_LOGGED_IN = ['/auth/update-password', '/auth/sign-up-success']

// Auth routes that REQUIRE authentication (subset of auth routes)
const AUTH_ROUTES_REQUIRING_LOGIN = ['/auth/update-password']

// Public routes accessible to everyone
const PUBLIC_ROUTES = ['/']

/**
 * Check if the pathname matches any of the given routes
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Create a redirect response to the given path
 */
function redirectTo(request: NextRequest, path: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value }) => supabaseResponse.cookies.set(name, value))
      },
    },
  })

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const { data } = await supabase.auth.getClaims()

  const isAuthenticated = !!data?.claims
  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/auth')
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES)

  if (isAuthenticated) {
    // Redirect logged-in users away from auth pages (except allowed ones)
    const canAccessAuthRoute = matchesRoute(pathname, AUTH_ROUTES_ALLOWED_WHEN_LOGGED_IN)
    if (isAuthRoute && !canAccessAuthRoute) {
      return redirectTo(request, '/studio')
    }
  } else {
    // Redirect guests away from protected auth routes (e.g., update-password)
    const requiresAuth = matchesRoute(pathname, AUTH_ROUTES_REQUIRING_LOGIN)
    if (requiresAuth) {
      return redirectTo(request, '/auth')
    }

    // Redirect guests away from protected app routes
    if (!isAuthRoute && !isPublicRoute) {
      return redirectTo(request, '/auth')
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
