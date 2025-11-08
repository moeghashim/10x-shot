/**
 * Supabase admin client configuration
 * 
 * This client uses the service role key and bypasses Row Level Security (RLS).
 * ONLY use this for admin operations like creating/updating/deleting projects.
 * 
 * WARNING: Never expose this client to the frontend!
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not found - admin operations will fail')
}

/**
 * Admin Supabase client that bypasses RLS
 * Use only for server-side admin operations
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
