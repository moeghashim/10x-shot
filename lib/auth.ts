/**
 * Authentication service and utilities
 * Provides business logic for user authentication and authorization
 */

import { auth } from "@/auth"
import { supabase } from "@/lib/supabase"
import { logActivity } from "@/lib/data-fetching"
import type { AdminUser, CreateAdminUserInput, AuthResult } from "@/types/database"

export class AuthService {
  /**
   * Create new admin user (for Supabase Auth)
   */
  static async createAdminUser(userData: CreateAdminUserInput): Promise<AuthResult> {
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

  /**
   * Log user activity - now delegates to data-fetching layer
   */
  static async logActivity(
    action: string,
    resourceType?: string,
    resourceId?: number,
    details?: string
  ) {
    await logActivity(action, resourceType, resourceId, details)
  }

  /**
   * Get current user from NextAuth session
   */
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

  /**
   * Check if user has permission for a specific action
   */
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

/**
 * Role-based access control decorator
 */
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