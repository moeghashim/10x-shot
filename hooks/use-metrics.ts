/**
 * Custom hook for fetching and managing project metrics
 */

import { useState, useEffect } from 'react'
import { fetchProjectMetrics, saveProjectMetric } from '@/lib/data-fetching'
import type { ProjectMetric } from '@/types/database'

export function useProjectMetrics(projectId?: number) {
  const [metrics, setMetrics] = useState<ProjectMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: fetchError } = await fetchProjectMetrics(projectId)
    
    if (fetchError) {
      setError(fetchError)
    }
    
    setMetrics(data || [])
    setLoading(false)
  }

  const saveMetric = async (metric: Omit<ProjectMetric, 'id' | 'created_at'>) => {
    const { error: saveError } = await saveProjectMetric(metric)
    
    if (saveError) {
      setError(saveError)
      return { success: false, error: saveError }
    }

    // Reload metrics after saving
    await loadMetrics()

    return { success: true, error: null }
  }

  useEffect(() => {
    loadMetrics()
  }, [projectId])

  return {
    metrics,
    loading,
    error,
    reload: loadMetrics,
    saveMetric
  }
}

