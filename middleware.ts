import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function middleware(request: NextRequest) {
  // Check if route needs protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth()

    // If no session and not on login page, redirect to admin login
    if (!session && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // If session exists, verify they are an active admin
    if (session?.user) {
      try {
        // For additional admin verification, you can add a check here
        // The auth callback already verified admin status during login
        const userRole = (session.user as any).role
        if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
          return new NextResponse('Unauthorized', { status: 401 })
        }
      } catch {
        return new NextResponse('Unauthorized', { status: 401 })
      }
    }
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
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}