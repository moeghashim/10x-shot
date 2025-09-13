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
  // Authenticate admin user
  static async authenticateAdmin(email: string, password: string): Promise<{ user: AdminUser | null, error: string | null }> {
    try {
      // Get user from admin_users table
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single()

      if (error || !user) {
        return { user: null, error: 'Invalid credentials' }
      }

      // Verify password (in production, use proper bcrypt comparison)
      const isValidPassword = await this.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        return { user: null, error: 'Invalid credentials' }
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)

      // Log login activity
      await this.logActivity(user.id, 'LOGIN', undefined, undefined, 'User logged in')

      const adminUser: AdminUser = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
        last_login: new Date().toISOString()
      }

      return { user: adminUser, error: null }
    } catch (error) {
      console.error('Authentication error:', error)
      return { user: null, error: 'Authentication failed' }
    }
  }

  // Create new admin user
  static async createAdminUser(userData: {
    email: string
    password: string
    full_name?: string
    role: 'admin' | 'super_admin'
  }): Promise<{ success: boolean, error: string | null }> {
    try {
      // Hash password
      const hashedPassword = await this.hashPassword(userData.password)

      // Insert user
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          email: userData.email,
          password_hash: hashedPassword,
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

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
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

  // Get current user from session
  static async getCurrentUser(): Promise<AdminUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Get admin user details
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
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