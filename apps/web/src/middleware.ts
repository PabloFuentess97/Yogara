import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/clases', '/horarios', '/retiros', '/membresias', '/login', '/registro', '/verificar']
const AUTH_ROUTES = ['/comunidad', '/perfil', '/reservas', '/online']
const ADMIN_ROUTES = ['/admin']

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') ?? ''

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'localhost:3000'

  // Resolve tenant from hostname
  let tenantSlug: string | null = null

  if (hostname === appDomain || hostname === `www.${appDomain}`) {
    // Main platform domain — no tenant, show marketing/landing
    // For now, pass through
  } else if (hostname.endsWith(`.${appDomain}`)) {
    // Subdomain: {slug}.yogara.app
    tenantSlug = hostname.replace(`.${appDomain}`, '')
  } else {
    // Custom domain — will resolve via DB lookup
    // For now, set a header so the app can resolve it
    const response = NextResponse.next()
    response.headers.set('x-custom-domain', hostname)
    return response
  }

  const response = NextResponse.next()

  if (tenantSlug) {
    response.headers.set('x-tenant-slug', tenantSlug)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
}
