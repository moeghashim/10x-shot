/**
 * Supabase client configuration
 * 
 * This module exports a single Supabase client instance used throughout the application.
 * For server-side operations (API routes, server components), use the createClient directly
 * from @supabase/supabase-js with service role key when needed.
 * 
 * For client-side operations, use this exported client which uses the anon key.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function getSupabaseClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
  }

  return client
}

/**
 * Main Supabase client for the application
 * Uses the anon key for client-side operations with RLS enabled
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const activeClient = getSupabaseClient()
    const value = Reflect.get(activeClient, prop, receiver)
    return typeof value === "function" ? value.bind(activeClient) : value
  },
})
