"use client"

import { useState } from "react"
import { Pencil, Plus, Save, Trash2, X } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { useStack } from "@/hooks/use-stack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StackCategory, StackGrade, StackItem } from "@/types/database"

type StackFormProps = {
  stackItem?: StackItem
  onSave: (stackItem: Omit<StackItem, "id"> | StackItem) => void
  onCancel: () => void
  isInline?: boolean
}

const stackGrades: StackGrade[] = ["A", "B", "C", "D", "E", "F"]

function StackForm({ stackItem, onSave, onCancel, isInline = false }: StackFormProps) {
  const [formData, setFormData] = useState<Omit<StackItem, "id">>({
    name: stackItem?.name || "",
    category: stackItem?.category || "tool",
    grade: stackItem?.grade || "C",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (stackItem) {
      onSave({ ...formData, id: stackItem.id })
      return
    }

    onSave(formData)
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          placeholder="ChatGPT"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value: StackCategory) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tool">Tool</SelectItem>
              <SelectItem value="ai_skill">AI Skill</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Grade</label>
          <Select
            value={formData.grade}
            onValueChange={(value: StackGrade) => setFormData((prev) => ({ ...prev, grade: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stackGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  )

  if (isInline) {
    return content
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{stackItem ? "Edit Stack Item" : "Create Stack Item"}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}

export function StackManager() {
  const { stackItems, loading, saveStackItem, deleteStackItem, reload: reloadStack } = useStack()
  const { projects, reload: reloadProjects } = useProjects()
  const [editingStackId, setEditingStackId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState("")
  const [isBackfilling, setIsBackfilling] = useState(false)

  const usageByStackId = new Map<number, { count: number; projects: string[] }>()

  for (const project of projects) {
    const stackItemIds = Array.isArray(project.stackItemIds) ? project.stackItemIds : []

    for (const stackItemId of stackItemIds) {
      const entry = usageByStackId.get(stackItemId) ?? { count: 0, projects: [] }
      entry.count += 1
      entry.projects.push(project.title)
      usageByStackId.set(stackItemId, entry)
    }
  }

  const filteredStackItems = stackItems.filter((item) => {
    if (!filter.trim()) {
      return true
    }

    return item.name.toLowerCase().includes(filter.trim().toLowerCase())
  })

  const handleSaveStackItem = async (stackItem: Omit<StackItem, "id"> | StackItem) => {
    const result = await saveStackItem(stackItem)

    if (result.success) {
      setEditingStackId(null)
      setIsCreating(false)
    } else if (result.error) {
      alert(`Failed to save stack item: ${result.error}`)
    }
  }

  const handleDeleteStackItem = async (stackItem: StackItem) => {
    const confirmed = window.confirm(`Delete "${stackItem.name}"?`)
    if (!confirmed) {
      return
    }

    const result = await deleteStackItem(stackItem.id)
    if (!result.success && result.error) {
      alert(`Failed to delete stack item: ${result.error}`)
      return
    }

    if (editingStackId === stackItem.id) {
      setEditingStackId(null)
    }
  }

  const handleBackfill = async () => {
    setIsBackfilling(true)

    try {
      const response = await fetch("/api/admin/stack/migrate", {
        method: "POST",
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to backfill stack")
      }

      await Promise.all([reloadStack(), reloadProjects()])
    } catch (error: any) {
      alert(`Failed to backfill stack: ${error.message || "Unknown error"}`)
    } finally {
      setIsBackfilling(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center">Loading stack...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stack Management</h2>
          <p className="text-sm text-gray-500">Manage the reusable stack catalog that projects can select from.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackfill} disabled={isBackfilling}>
            {isBackfilling ? "Backfilling..." : "Backfill Existing Stack"}
          </Button>
          <Input
            placeholder="Filter stack"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="md:w-60"
          />
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Stack Item
          </Button>
        </div>
      </div>

      {isCreating ? (
        <StackForm onSave={handleSaveStackItem} onCancel={() => setIsCreating(false)} />
      ) : null}

      <div className="grid gap-4">
        {filteredStackItems.map((stackItem) => {
          const usage = usageByStackId.get(stackItem.id) ?? { count: 0, projects: [] }

          return (
            <Card key={stackItem.id} className={editingStackId === stackItem.id ? "ring-2 ring-blue-500" : ""}>
              {editingStackId === stackItem.id ? (
                <CardContent className="pt-6">
                  <StackForm
                    stackItem={stackItem}
                    onSave={handleSaveStackItem}
                    onCancel={() => setEditingStackId(null)}
                    isInline
                  />
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle>{stackItem.name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{stackItem.category === "tool" ? "Tool" : "AI Skill"}</Badge>
                          <Badge>Grade {stackItem.grade}</Badge>
                          <Badge variant="secondary">{usage.count} project{usage.count === 1 ? "" : "s"}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingStackId(stackItem.id)}
                          aria-label={`Edit ${stackItem.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteStackItem(stackItem)}
                          aria-label={`Delete ${stackItem.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Used In Projects</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {usage.projects.length > 0 ? (
                          usage.projects.map((projectTitle) => (
                            <Badge key={`${stackItem.id}-${projectTitle}`} variant="outline">
                              {projectTitle}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Not used in any project yet.</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
