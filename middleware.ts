import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if route needs protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to admin login
    if (!user && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // If user exists, check if they have admin privileges
    if (user) {
      try {
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('id,email,role,is_active')
          .eq('email', user.email)
          .eq('is_active', true)
          .single()

        if (adminError || !adminUser) {
          return new NextResponse('Unauthorized', { status: 401 })
        }
      } catch {
        return new NextResponse('Unauthorized', { status: 401 })
      }
    }
  }

  return response
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