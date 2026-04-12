/**
 * Centralized type definitions for the application
 * Single source of truth for all database and application types
 */

/**
 * Project status types
 */
export type ProjectStatus = "active" | "planning" | "completed"
export type StackGrade = "A" | "B" | "C" | "D" | "E" | "F"
export type StackCategory = "tool" | "ai_skill"

export type SupportedLocale = "en" | "ar"
export type TranslationStatus = "synced" | "failed" | "pending"

/**
 * User role types
 */
export type UserRole = "admin"

export interface LocalizedTextValue {
  en: string
  ar: string
  source_hash?: string
  translated_at?: string
  translation_model?: string
  translation_status?: TranslationStatus
}

export interface LocalizedStringListValue {
  en: string[]
  ar: string[]
  source_hash?: string
  translated_at?: string
  translation_model?: string
  translation_status?: TranslationStatus
}

export interface ProjectLocalizationBundle {
  title: LocalizedTextValue
  description: LocalizedTextValue
  objectives?: LocalizedTextValue
  timeframe?: LocalizedTextValue
  aiSkills: LocalizedStringListValue
  tools: LocalizedStringListValue
}

export interface GlobalMetricLocalizationBundle {
  skillsGained: LocalizedStringListValue
  milestones: LocalizedStringListValue
}

/**
 * Project interface - used across the application
 */
export interface Project {
  id: number
  title: string
  description: string
  objectives?: string
  progress: number
  status: ProjectStatus
  stackItemIds: number[]
  aiSkills: string[]
  tools: string[]
  timeframe?: string
  url?: string | null
}

export interface StackItem {
  id: number
  name: string
  category: StackCategory
  grade: StackGrade
}

export interface StackProjectReference {
  id: number
  title: string
  status: ProjectStatus
  url?: string | null
}

export interface StackItemWithProjects extends StackItem {
  usageCount: number
  projects: StackProjectReference[]
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
  skills_gained: string[]
  milestones: string[]
  created_at?: string
}

export interface SiteContentEntry {
  key: string
  en: string
  ar: string
  source_hash?: string
  translated_at?: string
  translation_model?: string
  translation_status?: TranslationStatus
  created_at?: string
  updated_at?: string
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
}

/**
 * Database response types
 */
export interface DbProject {
  id: number
  title: string
  description: string
  objectives?: string
  progress: number
  status: string
  stack_item_ids?: number[]
  ai_skills: string[]
  tools: string[]
  timeframe?: string
  url?: string | null
}

/**
 * Auth-related types
 */
export interface CreateAdminUserInput {
  email: string
  password: string
  full_name?: string
  role?: UserRole
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
