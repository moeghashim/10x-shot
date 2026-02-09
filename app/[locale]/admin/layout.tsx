import type React from "react"
import AuthSessionProvider from "@/components/session-provider"
import { SupabaseAuthSync } from "@/components/supabase-auth-sync"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <SupabaseAuthSync>{children}</SupabaseAuthSync>
    </AuthSessionProvider>
  )
}

