/**
 * Supabase admin client configuration
 * 
 * This client uses the service role key and bypasses Row Level Security (RLS).
 * ONLY use this for admin operations like creating/updating/deleting projects.
 * 
 * WARNING: Never expose this client to the frontend!
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

export function hasSupabaseAdminEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function getSupabaseAdminClient() {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }

  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }

  return adminClient
}

/**
 * Admin Supabase client that bypasses RLS
 * Use only for server-side admin operations
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const activeClient = getSupabaseAdminClient()
    const value = Reflect.get(activeClient, prop, receiver)
    return typeof value === "function" ? value.bind(activeClient) : value
  },
})
