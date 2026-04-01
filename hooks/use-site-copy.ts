"use client"

import { useEffect, useState } from "react"
import type { SiteContentEntry } from "@/types/database"

export function useSiteCopy() {
  const [entries, setEntries] = useState<SiteContentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntries = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/site-copy")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to load site copy")
      }

      setEntries(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load site copy")
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const saveEntry = async (entry: Pick<SiteContentEntry, "key" | "en">) => {
    try {
      const response = await fetch("/api/admin/site-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save site copy")
      }

      await loadEntries()
      return { success: true, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save site copy"
      setError(message)
      return { success: false, error: message }
    }
  }

  useEffect(() => {
    void loadEntries()
  }, [])

  return {
    entries,
    loading,
    error,
    reload: loadEntries,
    saveEntry,
  }
}
