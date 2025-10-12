/**
 * Supabase client configuration
 * 
 * This module exports a single Supabase client instance used throughout the application.
 * For server-side operations (API routes, server components), use the createClient directly
 * from @supabase/supabase-js with service role key when needed.
 * 
 * For client-side operations, use this exported client which uses the anon key.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Main Supabase client for the application
 * Uses the anon key for client-side operations with RLS enabled
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)