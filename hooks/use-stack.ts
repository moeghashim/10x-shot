"use client"

import { useEffect, useState } from "react"
import type { StackItem } from "@/types/database"

export function useStack() {
  const [stackItems, setStackItems] = useState<StackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStack = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/stack")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch stack")
      }

      setStackItems(result.data || [])
    } catch (err: any) {
      setError(err.message)
      console.error("Failed to load stack:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveStackItem = async (stackItem: Omit<StackItem, "id"> | StackItem) => {
    try {
      const response = await fetch("/api/admin/stack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stackItem),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save stack item")
      }

      const data = result.data
      if (data) {
        if ("id" in stackItem && stackItem.id) {
          setStackItems((prev) => prev.map((item) => (item.id === data.id ? data : item)))
        } else {
          setStackItems((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
        }
      }

      return { success: true, error: null, data }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to save stack item"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const deleteStackItem = async (stackItemId: number) => {
    try {
      const response = await fetch("/api/admin/stack", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: stackItemId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete stack item")
      }

      setStackItems((prev) => prev.filter((item) => item.id !== stackItemId))
      return { success: true, error: null }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete stack item"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    loadStack()
  }, [])

  return {
    stackItems,
    loading,
    error,
    reload: loadStack,
    saveStackItem,
    deleteStackItem,
  }
}
