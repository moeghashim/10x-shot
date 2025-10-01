"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'

export function SupabaseAuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // Get Supabase session tokens from secure API endpoint
      fetch('/api/auth/supabase-sync', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.access_token && data.refresh_token) {
            // Set the session in Supabase client
            supabase.auth.setSession({
              access_token: data.access_token,
              refresh_token: data.refresh_token
            })
          }
        })
        .catch(err => {
          console.warn('Supabase auth sync failed:', err.message)
        })
    } else if (status === 'unauthenticated') {
      // Sign out from Supabase Auth
      supabase.auth.signOut().catch(() => {})
    }
  }, [session, status])

  return <>{children}</>
}
