/**
 * Custom hook for fetching and managing projects
 */

import { useState, useEffect } from 'react'
import { fetchProjects, saveProject as saveProjectDb } from '@/lib/data-fetching'
import type { Project } from '@/types/database'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    // Disable fallback for admin - we need real DB data
    const { data, error: fetchError } = await fetchProjects({ allowFallback: false })
    
    if (fetchError) {
      setError(fetchError)
      console.error('Failed to load projects from database:', fetchError)
    }
    
    setProjects(data || [])
    setLoading(false)
  }

  const saveProject = async (project: Omit<Project, 'id'> | Project) => {
    const { data, error: saveError } = await saveProjectDb(project)
    
    if (saveError) {
      setError(saveError)
      return { success: false, error: saveError }
    }

    // Update local state with data returned from DB
    if (data) {
      if ('id' in project && project.id) {
        setProjects(prev => prev.map(p => p.id === data.id ? data : p))
      } else {
        setProjects(prev => [...prev, data])
      }
    }

    return { success: true, error: null, data }
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

