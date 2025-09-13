import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          }
        }
      }
    )

    // Create Supabase session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError || !signInData?.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify admin status via RLS-aware query
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id,email,role,is_active')
      .eq('email', email)
      .single()

    if (adminError || !adminUser || !adminUser.is_active) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ success: true, role: adminUser.role })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 500 })
  }
}


