import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

// Create Supabase clients once at module level
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
)

const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if user exists in admin_users table
          const { data: adminUser, error } = await supabaseAdmin
            .from('admin_users')
            .select('id, email, full_name, role, is_active')
            .eq('email', credentials.email as string)
            .eq('is_active', true)
            .single()

          if (error || !adminUser) {
            console.error('Admin user not found:', error)
            return null
          }

          // Validate against Supabase Auth
          const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          })

          if (authError || !authData.user) {
            console.error('Supabase auth failed:', authError)
            return null
          }

          // Return user object for NextAuth session
          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.full_name || adminUser.email,
            role: adminUser.role,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
})
