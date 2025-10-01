import { NextResponse } from 'next/server'
import { signIn } from '@/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Use NextAuth signIn
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!result) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 500 })
  }
}


