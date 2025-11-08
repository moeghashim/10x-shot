/**
 * Custom hook for fetching and managing projects (admin version)
 * Uses API routes with service role key for admin operations
 */

import { useState, useEffect } from 'react'
import type { Project } from '@/types/database'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Use admin API route to fetch projects
      const response = await fetch('/api/admin/projects')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch projects')
      }
      
      setProjects(result.data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to load projects from database:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async (project: Omit<Project, 'id'> | Project) => {
    try {
      // Use admin API route to save project
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save project')
      }
      
      const data = result.data
      
      // Update local state with data returned from DB
      if (data) {
        if ('id' in project && project.id) {
          setProjects(prev => prev.map(p => p.id === data.id ? data : p))
        } else {
          setProjects(prev => [...prev, data])
        }
      }

      return { success: true, error: null, data }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to save project'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    reload: loadProjects,
    saveProject
  }
}

