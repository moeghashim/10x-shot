"use client"

import { useState } from "react"
import { Check, Pencil, Plus, Save, Table2, Trash2, X } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { useStack } from "@/hooks/use-stack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Project, StackCategory, StackGrade, StackItem } from "@/types/database"

type StackFormValue = Omit<StackItem, "id"> & {
  projectIds: number[]
}

type StackFormProps = {
  stackItem?: StackItem & { projectIds: number[] }
  projects: Project[]
  onSave: (stackItem: StackFormValue | (StackFormValue & { id: number })) => void
  onCancel: () => void
  isInline?: boolean
}

const stackGrades: StackGrade[] = ["A", "B", "C", "D", "E", "F"]

function StackForm({ stackItem, projects, onSave, onCancel, isInline = false }: StackFormProps) {
  const [formData, setFormData] = useState<StackFormValue>({
    name: stackItem?.name || "",
    category: stackItem?.category || "tool",
    grade: stackItem?.grade || "C",
    notes: stackItem?.notes || "",
    projectIds: stackItem?.projectIds || [],
  })
  const sortedProjects = [...projects].sort((left, right) => left.title.localeCompare(right.title))

  const toggleProject = (projectId: number) => {
    setFormData((prev) => ({
      ...prev,
      projectIds: prev.projectIds.includes(projectId)
        ? prev.projectIds.filter((id) => id !== projectId)
        : [...prev.projectIds, projectId],
    }))
  }

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

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          placeholder="Add context about when to use this stack item."
          value={formData.notes || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={4}
        />
      </div>

      <div className="space-y-3 rounded-md border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Linked Projects</p>
            <p className="text-xs text-gray-500">Assign this stack item directly to the projects that use it.</p>
          </div>
          <Badge variant="secondary">{formData.projectIds.length} selected</Badge>
        </div>

        {sortedProjects.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2">
            {sortedProjects.map((project) => {
              const checked = formData.projectIds.includes(project.id)

              return (
                <label
                  key={project.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                    checked ? "border-black bg-black text-white" : "border-gray-200 bg-white text-black hover:border-black"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    onChange={() => toggleProject(project.id)}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className={`text-xs ${checked ? "text-white/70" : "text-gray-500"}`}>{project.status}</p>
                  </div>
                </label>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No projects available yet.</p>
        )}
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
  const { projects, loading: projectsLoading, reload: reloadProjects } = useProjects()
  const [editingStackId, setEditingStackId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState("")
  const [isBackfilling, setIsBackfilling] = useState(false)
  const [view, setView] = useState<"cards" | "matrix">("cards")
  const sortedProjects = [...projects].sort((left, right) => left.title.localeCompare(right.title))

  const usageByStackId = new Map<number, { count: number; projects: Array<{ id: number; title: string }> }>()

  for (const project of projects) {
    const stackItemIds = Array.isArray(project.stackItemIds) ? project.stackItemIds : []

    for (const stackItemId of stackItemIds) {
      const entry = usageByStackId.get(stackItemId) ?? { count: 0, projects: [] }
      entry.count += 1
      entry.projects.push({ id: project.id, title: project.title })
      usageByStackId.set(stackItemId, entry)
    }
  }

  const filteredStackItems = stackItems.filter((item) => {
    if (!filter.trim()) {
      return true
    }

    return item.name.toLowerCase().includes(filter.trim().toLowerCase())
  })
  const editingStackItem =
    editingStackId === null
      ? null
      : stackItems.find((item) => item.id === editingStackId) ?? null

  const handleSaveStackItem = async (stackItem: StackFormValue | (StackFormValue & { id: number })) => {
    const result = await saveStackItem(stackItem)

    if (result.success) {
      await Promise.all([reloadStack(), reloadProjects()])
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

  if (loading || projectsLoading) {
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
        <StackForm projects={projects} onSave={handleSaveStackItem} onCancel={() => setIsCreating(false)} />
      ) : null}

      {editingStackItem ? (
        <StackForm
          stackItem={{
            ...editingStackItem,
            projectIds: (usageByStackId.get(editingStackItem.id)?.projects ?? []).map((project) => project.id),
          }}
          projects={projects}
          onSave={handleSaveStackItem}
          onCancel={() => setEditingStackId(null)}
        />
      ) : null}

      <Tabs value={view} onValueChange={(value) => setView(value as "cards" | "matrix")} className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="matrix">
            <Table2 className="mr-2 h-4 w-4" />
            Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-0">
          <div className="grid gap-4">
            {filteredStackItems.map((stackItem) => {
              const usage = usageByStackId.get(stackItem.id) ?? { count: 0, projects: [] }

              return (
                <Card key={stackItem.id} className={editingStackId === stackItem.id ? "ring-2 ring-blue-500" : ""}>
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
                          onClick={() => {
                            setEditingStackId(stackItem.id)
                            setIsCreating(false)
                          }}
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
                    {stackItem.notes ? <p className="text-sm leading-6 text-gray-600">{stackItem.notes}</p> : null}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Used In Projects</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {usage.projects.length > 0 ? (
                          usage.projects.map((project) => (
                            <Badge key={`${stackItem.id}-${project.id}`} variant="outline">
                              {project.title}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Not used in any project yet.</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {filteredStackItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="sticky left-0 z-20 min-w-[220px] border-r border-gray-200 bg-gray-50 px-4 py-3 text-left font-medium">
                          Stack
                        </th>
                        <th className="min-w-[100px] border-r border-gray-200 px-3 py-3 text-left font-medium">Type</th>
                        <th className="min-w-[90px] border-r border-gray-200 px-3 py-3 text-left font-medium">Grade</th>
                        <th className="min-w-[90px] border-r border-gray-200 px-3 py-3 text-left font-medium">Usage</th>
                        <th className="min-w-[120px] border-r border-gray-200 px-3 py-3 text-left font-medium">Actions</th>
                        {sortedProjects.map((project) => (
                          <th
                            key={project.id}
                            className="min-w-[140px] border-r border-gray-200 px-3 py-3 text-left font-medium last:border-r-0"
                          >
                            <div className="space-y-1">
                              <p className="line-clamp-2 min-w-0">{project.title}</p>
                              <p className="text-xs font-normal text-gray-500">{project.status}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStackItems.map((stackItem) => {
                        const usage = usageByStackId.get(stackItem.id) ?? { count: 0, projects: [] }
                        const linkedProjectIds = new Set(usage.projects.map((project) => project.id))

                        return (
                          <tr key={stackItem.id} className="border-b border-gray-200 last:border-b-0">
                            <td className="sticky left-0 z-10 border-r border-gray-200 bg-white px-4 py-3 align-top">
                              <div className="space-y-2">
                                <p className="font-medium">{stackItem.name}</p>
                                {stackItem.notes ? (
                                  <p className="line-clamp-3 text-xs leading-5 text-gray-500">{stackItem.notes}</p>
                                ) : null}
                              </div>
                            </td>
                            <td className="border-r border-gray-200 px-3 py-3 align-top">
                              <Badge variant="outline">{stackItem.category === "tool" ? "Tool" : "AI Skill"}</Badge>
                            </td>
                            <td className="border-r border-gray-200 px-3 py-3 align-top">
                              <Badge>Grade {stackItem.grade}</Badge>
                            </td>
                            <td className="border-r border-gray-200 px-3 py-3 align-top">{usage.count}</td>
                            <td className="border-r border-gray-200 px-3 py-3 align-top">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingStackId(stackItem.id)
                                    setIsCreating(false)
                                  }}
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
                            </td>
                            {sortedProjects.map((project) => (
                              <td
                                key={`${stackItem.id}-${project.id}`}
                                className="border-r border-gray-200 px-3 py-3 text-center align-middle last:border-r-0"
                              >
                                {linkedProjectIds.has(project.id) ? (
                                  <Check className="mx-auto h-4 w-4 text-green-600" />
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-8 text-sm text-gray-500">No stack items match the current filter.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
