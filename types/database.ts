/**
 * Centralized type definitions for the application
 * Single source of truth for all database and application types
 */

/**
 * Project status types
 */
export type ProjectStatus = "active" | "planning" | "completed"

/**
 * User role types
 */
export type UserRole = "admin" | "super_admin"

/**
 * Project interface - used across the application
 */
export interface Project {
  id: number
  title: string
  domain: string
  description: string
  objectives?: string
  progress: number
  status: ProjectStatus
  mySkills: string[]
  aiSkills: string[]
  tools: string[]
  productivity: number
  timeframe?: string
  url: string
}

/**
 * Project metrics interface
 */
export interface ProjectMetric {
  id?: number
  project_id: number
  month: string
  progress: number
  productivity_score: number
  hours_worked: number
  ai_assistance_hours: number
  manual_hours: number
  notes?: string
  created_at?: string
}

/**
 * Global metrics interface
 */
export interface GlobalMetric {
  id?: number
  month: string
  twitter_followers: number
  youtube_subscribers: number
  tiktok_followers: number
  instagram_followers: number
  newsletter_subscribers: number
  total_gmv: number
  productivity_gain: number
  skills_gained: string[]
  milestones: string[]
  created_at?: string
}

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: UserRole
  is_active: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
}

/**
 * User activity interface
 */
export interface UserActivity {
  id: string
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: number
  details?: string
  created_at: string
}

/**
 * Project with limited fields for dropdowns/selects
 */
export interface ProjectSummary {
  id: number
  title: string
  domain: string
}

/**
 * Database response types
 */
export interface DbProject {
  id: number
  title: string
  domain: string
  description: string
  objectives?: string
  progress: number
  status: string
  my_skills: string[]
  ai_skills: string[]
  tools: string[]
  productivity: number
  timeframe?: string
  url: string
}

/**
 * Auth-related types
 */
export interface CreateAdminUserInput {
  email: string
  password: string
  full_name?: string
  role: UserRole
}

export interface AuthResult {
  success: boolean
  error: string | null
}

/**
 * Data fetching result wrapper
 */
export interface DataResult<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

