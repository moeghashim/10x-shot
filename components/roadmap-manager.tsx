"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { usePlanningCards } from "@/hooks/use-planning-cards"
import type { PlanningCard, PlanningCardColumn, ProjectSummary } from "@/types/database"

const columns: Array<{ value: PlanningCardColumn; label: string }> = [
  { value: "now", label: "Now" },
  { value: "next", label: "Next" },
  { value: "later", label: "Later" },
  { value: "done", label: "Done" },
]

function getBlankCard(projectId = 0): PlanningCard {
  return {
    project_id: projectId,
    column: "now",
    title: "",
    description: "",
    order: 0,
  }
}

export function RoadmapManager() {
  const { cards, loading, error, saveCard, deleteCard } = usePlanningCards()
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [formData, setFormData] = useState<PlanningCard>(getBlankCard())
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    async function loadProjects() {
      const response = await fetch("/api/admin/projects")
      const result = await response.json()

      if (!response.ok) {
        return
      }

      const data = (result.data || []).map((project: ProjectSummary) => ({
        id: project.id,
        title: project.title,
      }))
      setProjects(data)
      if (data.length > 0) {
        setFormData((current) => ({
          ...current,
          project_id: current.project_id || data[0].id,
        }))
      }
    }

    void loadProjects()
  }, [])

  const projectById = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects]
  )

  const resetForm = () => {
    setEditingId(null)
    setFormData(getBlankCard(projects[0]?.id ?? 0))
  }

  const handleSave = async () => {
    if (!formData.project_id || !formData.title.trim() || !formData.description.trim()) {
      return
    }

    const result = await saveCard({
      ...formData,
      id: editingId ?? formData.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
    })

    if (result.success) {
      resetForm()
    }
  }

  const startEditing = (card: PlanningCard) => {
    setEditingId(card.id ?? null)
    setFormData(card)
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading roadmap cards...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Roadmap Kanban</h2>
          <p className="text-gray-600">Manage public planning cards shown on the progress page.</p>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? "Edit Planning Card" : "Add Planning Card"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Project</label>
              <Select
                value={formData.project_id ? String(formData.project_id) : undefined}
                onValueChange={(value) => setFormData((current) => ({ ...current, project_id: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Column</label>
              <Select
                value={formData.column}
                onValueChange={(value: PlanningCardColumn) =>
                  setFormData((current) => ({ ...current, column: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.value} value={column.value}>
                      {column.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(event) => setFormData((current) => ({ ...current, order: Number(event.target.value) }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                placeholder="Launch onboarding"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              placeholder="What is being planned, built, or shipped?"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Card
            </Button>
            {editingId ? (
              <Button variant="outline" onClick={resetForm}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => {
          const columnCards = cards.filter((card) => card.column === column.value)

          return (
            <Card key={column.value}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{column.label}</span>
                  <Badge variant="outline">{columnCards.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnCards.length === 0 ? (
                  <p className="text-sm text-gray-500">No cards yet.</p>
                ) : (
                  columnCards.map((card) => (
                    <div key={card.id} className="rounded-md border border-gray-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-950">{card.title}</p>
                          <p className="mt-1 text-sm text-gray-600">{card.description}</p>
                        </div>
                        <Badge variant="outline">{card.order}</Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {projectById.get(card.project_id)?.title ?? `Project ${card.project_id}`}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditing(card)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        {card.id ? (
                          <Button size="sm" variant="destructive" onClick={() => void deleteCard(card.id!)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
