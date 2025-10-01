"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'

export function SupabaseAuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // Sign in to Supabase Auth to enable RLS policies
      supabase.auth.signInWithPassword({
        email: session.user.email,
        password: 'admin123456' // This matches the password we set earlier
      }).catch(err => {
        console.warn('Supabase auth sync failed:', err.message)
      })
    } else if (status === 'unauthenticated') {
      // Sign out from Supabase Auth
      supabase.auth.signOut().catch(() => {})
    }
  }, [session, status])

  return <>{children}</>
}
