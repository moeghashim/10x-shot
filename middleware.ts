import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // Handle internationalization
  const response = intlMiddleware(request);

  // Check if route needs protection (handle both with and without locale)
  const isProtected = pathname.startsWith('/admin') || 
                      pathname.match(/^\/(en|ar)\/admin/);

  if (isProtected) {
    const session = await auth()

    // If no session and not on login page, redirect to admin login
    const isAdminLogin = pathname === '/admin' || pathname === '/en/admin' || pathname === '/ar/admin';
    if (!session && !isAdminLogin) {
      const localeMatch = pathname.match(/^\/(en|ar)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url))
    }

    // If session exists, verify they are an active admin
    if (session?.user) {
      const userRole = (session.user as any).role
      if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
