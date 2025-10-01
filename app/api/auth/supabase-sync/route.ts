import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    // Verify NextAuth session
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get admin password from server-side env
    const password = process.env.ADMIN_SUPABASE_PASSWORD
    if (!password) {
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    // Create Supabase client and sign in
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Return the session tokens
    return NextResponse.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
