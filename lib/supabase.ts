import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy client (for backwards compatibility)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client with SSR support (use this in client components)
export const supabaseBrowser = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)