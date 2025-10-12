/**
 * Custom hook for fetching and managing global metrics
 */

import { useState, useEffect } from 'react'
import { fetchGlobalMetrics, saveGlobalMetric } from '@/lib/data-fetching'
import type { GlobalMetric } from '@/types/database'

export function useGlobalMetrics() {
  const [metrics, setMetrics] = useState<GlobalMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: fetchError } = await fetchGlobalMetrics()
    
    if (fetchError) {
      setError(fetchError)
    }
    
    setMetrics(data || [])
    setLoading(false)
  }

  const saveMetric = async (metric: Omit<GlobalMetric, 'id' | 'created_at'>) => {
    const { error: saveError } = await saveGlobalMetric(metric)
    
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
  }, [])

  return {
    metrics,
    loading,
    error,
    reload: loadMetrics,
    saveMetric
  }
}

