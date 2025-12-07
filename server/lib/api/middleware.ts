import { NextResponse, type NextRequest } from 'next/server'

/**
 * Validates the API key from the request headers
 * @param request - The incoming request
 * @returns NextResponse if unauthorized, null if authorized
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
  const apiKey = request.headers.get('x-api-key')

  if (!process.env.API_KEY) {
    console.warn('API_KEY environment variable is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 401 })
  }

  if (apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }

  return null // Authorized
}

/**
 * API authentication middleware
 * Checks for valid API key in x-api-key header or Authorization Bearer token
 */
export async function apiAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const unauthorizedResponse = validateApiKey(request)

  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  return null // Continue to next middleware
}
