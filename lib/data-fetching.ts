/**
 * Centralized data fetching layer
 * Single source of truth for all database operations with consistent error handling
 */

import { supabase } from "@/lib/supabase"
import { FALLBACK_PROJECTS, FALLBACK_GLOBAL_METRICS, mapDbProjectToApp } from "@/lib/constants"
import type { Project, ProjectMetric, GlobalMetric, ProjectSummary, AdminUser, UserActivity } from "@/types/database"

/**
 * Fetch all projects with fallback to hardcoded data
 */
export async function fetchProjects(): Promise<{ data: Project[], error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.warn('Database not ready, using fallback data:', error)
      return { data: FALLBACK_PROJECTS, error: null }
    }

    // Map database fields to app format
    const mappedProjects = (data || []).map(mapDbProjectToApp)
    return { data: mappedProjects, error: null }
  } catch (error) {
    console.warn('Database connection failed, using fallback data:', error)
    return { data: FALLBACK_PROJECTS, error: null }
  }
}

/**
 * Fetch project summaries (id, title, domain only) for dropdowns
 */
export async function fetchProjectSummaries(): Promise<{ data: ProjectSummary[], error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, domain')
      .order('title')

    if (error) {
      console.warn('Database not ready for projects, using fallback:', error)
      const fallbackSummaries = FALLBACK_PROJECTS.map(p => ({
        id: p.id,
        title: p.title,
        domain: p.domain
      }))
      return { data: fallbackSummaries, error: null }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.warn('Failed to load project summaries, using fallback:', error)
    const fallbackSummaries = FALLBACK_PROJECTS.map(p => ({
      id: p.id,
      title: p.title,
      domain: p.domain
    }))
    return { data: fallbackSummaries, error: null }
  }
}

/**
 * Fetch project metrics
 */
export async function fetchProjectMetrics(projectId?: number): Promise<{ data: ProjectMetric[], error: string | null }> {
  try {
    let query = supabase
      .from('project_metrics')
      .select(`
        *,
        projects:project_id (title, domain)
      `)
      .order('month', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Database error loading metrics:', error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.warn('Failed to load metrics:', error)
    return { data: [], error: 'Failed to load metrics' }
  }
}

/**
 * Fetch global metrics with fallback
 */
export async function fetchGlobalMetrics(): Promise<{ data: GlobalMetric[], error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('global_metrics')
      .select('*')
      .order('month', { ascending: false })

    if (error) {
      console.warn('Database not ready for global metrics, using fallback:', error)
      return { data: FALLBACK_GLOBAL_METRICS, error: null }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.warn('Error loading global metrics, using fallback:', error)
    return { data: FALLBACK_GLOBAL_METRICS, error: null }
  }
}

/**
 * Fetch latest global metric
 */
export async function fetchLatestGlobalMetric(): Promise<{ data: GlobalMetric | null, error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('global_metrics')
      .select('*')
      .order('month', { ascending: false })
      .limit(1)

    if (error) {
      console.warn('Global metrics not ready, using fallback:', error)
      return { data: FALLBACK_GLOBAL_METRICS[0] || null, error: null }
    }

    return { data: data?.[0] || null, error: null }
  } catch (error) {
    console.warn('Failed to load latest metric:', error)
    return { data: FALLBACK_GLOBAL_METRICS[0] || null, error: null }
  }
}

/**
 * Fetch admin users
 */
export async function fetchAdminUsers(): Promise<{ data: AdminUser[], error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Database not ready for users, using fallback:', error)
      const fallbackUsers: AdminUser[] = [
        {
          id: 'fallback-1',
          email: 'admin@example.com',
          full_name: 'System Admin',
          role: 'super_admin',
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      return { data: fallbackUsers, error: null }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.warn('Failed to load users:', error)
    return { data: [], error: 'Failed to load users' }
  }
}

/**
 * Fetch user activity logs
 */
export async function fetchUserActivity(limit: number = 50): Promise<{ data: UserActivity[], error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('admin_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.warn('Failed to load activity:', error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.warn('Failed to load activity:', error)
    return { data: [], error: 'Failed to load activity' }
  }
}

/**
 * Save or update a project
 */
export async function saveProject(project: Omit<Project, 'id'> | Project): Promise<{ data: Project | null, error: string | null }> {
  try {
    const { mapAppProjectToDb } = await import('@/lib/constants')
    const dbProject = mapAppProjectToDb(project)

    if ('id' in project && project.id) {
      // Update existing project
      const { data, error } = await supabase
        .from('projects')
        .update(dbProject)
        .eq('id', project.id)
        .select()

      if (error) {
        console.error("Database error:", error)
        return { data: null, error: error.message }
      }
      
      if (data && data[0]) {
        return { data: mapDbProjectToApp(data[0]), error: null }
      }
      
      return { data: null, error: 'Failed to update project' }
    } else {
      // Create new project
      const { data, error } = await supabase
        .from('projects')
        .insert([dbProject])
        .select()

      if (error) {
        console.error("Database error:", error)
        return { data: null, error: error.message }
      }
      
      if (data && data[0]) {
        return { data: mapDbProjectToApp(data[0]), error: null }
      }
      
      return { data: null, error: 'Failed to create project' }
    }
  } catch (error: any) {
    console.warn("Failed to save project:", error)
    return { data: null, error: error.message || 'Failed to save project' }
  }
}

/**
 * Save a project metric
 */
export async function saveProjectMetric(metric: Omit<ProjectMetric, 'id' | 'created_at'>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('project_metrics')
      .insert([metric])

    if (error) {
      console.warn("Database error:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    console.warn("Failed to save metric:", error)
    return { error: error.message || 'Failed to save metric' }
  }
}

/**
 * Save or upsert a global metric
 */
export async function saveGlobalMetric(metric: Omit<GlobalMetric, 'id' | 'created_at'>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('global_metrics')
      .upsert([metric])

    if (error) {
      console.warn('Error saving metric:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    console.warn('Error saving metric:', error)
    return { error: error.message || 'Failed to save metric' }
  }
}

/**
 * Update admin user
 */
export async function updateAdminUser(userId: string, updates: Partial<AdminUser>): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', userId)

    if (error) {
      console.warn('Failed to update user:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    console.warn('Failed to update user:', error)
    return { error: error.message || 'Failed to update user' }
  }
}

/**
 * Log user activity
 */
export async function logActivity(
  action: string,
  resourceType?: string,
  resourceId?: number,
  details?: string
): Promise<void> {
  try {
    await supabase
      .from('admin_activity')
      .insert([{
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details
      }])
  } catch (error) {
    console.warn('Failed to log activity:', error)
  }
}

