"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const login = async (password: string) => {
    try {
      const result = await signIn("credentials", {
        password,
        redirect: false,
      })
      return result?.ok || false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
  }

  return {
    isAuthenticated: !!session,
    isLoading: status === "loading",
    login,
    logout,
    user: session?.user,
  }
}
