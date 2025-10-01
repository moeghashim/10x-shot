import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import bcrypt from 'bcryptjs'

export interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  last_login?: string
}

export class AuthService {
  // Create new admin user (for Supabase Auth)
  static async createAdminUser(userData: {
    email: string
    password: string
    full_name?: string
    role: 'admin' | 'super_admin'
  }): Promise<{ success: boolean, error: string | null }> {
    try {
      // Insert user into admin_users table
      // Note: Password is managed by Supabase Auth, not stored in admin_users
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          email: userData.email,
          password_hash: 'managed_by_supabase_auth',
          full_name: userData.full_name,
          role: userData.role
        }])

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('User creation error:', error)
      return { success: false, error: 'Failed to create user' }
    }
  }

  // Log user activity
  static async logActivity(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: number,
    details?: string
  ) {
    try {
      await supabase
        .from('admin_activity')
        .insert([{
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details
        }])
    } catch (error) {
      console.warn('Failed to log activity:', error)
    }
  }

  // Get current user from NextAuth session
  static async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const session = await auth()
      if (!session?.user) return null

      // Get admin user details from database
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single()

      if (!adminUser) return null

      return {
        id: adminUser.id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
        is_active: adminUser.is_active,
        last_login: adminUser.last_login
      }
    } catch (error) {
      console.warn('Failed to get current user:', error)
      return null
    }
  }

  // Check if user has permission
  static hasPermission(user: AdminUser, action: string): boolean {
    if (user.role === 'super_admin') return true

    // Define permissions for regular admin
    const adminPermissions = [
      'view_projects',
      'edit_projects',
      'view_metrics',
      'edit_metrics',
      'view_global_metrics'
    ]

    const superAdminOnlyPermissions = [
      'manage_users',
      'edit_global_metrics',
      'system_settings'
    ]

    if (superAdminOnlyPermissions.includes(action)) {
      return false
    }

    return adminPermissions.includes(action)
  }
}

// Role-based access control decorator
export function requirePermission(permission: string) {
  return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const user = await AuthService.getCurrentUser()
      if (!user || !AuthService.hasPermission(user, permission)) {
        throw new Error('Insufficient permissions')
      }
      
      return method.apply(this, args)
    }
  }
}