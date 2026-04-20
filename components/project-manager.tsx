"use client"

import { useState } from "react"
import { Pencil, Plus, Save, Trash2, Wrench, X, Sparkles } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { useStack } from "@/hooks/use-stack"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getProjectStatusStyles } from "@/lib/project-status"
import type { Project, StackItem } from "@/types/database"

function deriveProjectStack(stackItems: StackItem[], stackItemIds: number[]) {
  const selectedItems = stackItems.filter((item) => stackItemIds.includes(item.id))

  return {
    aiSkills: selectedItems.filter((item) => item.category === "ai_skill").map((item) => item.name),
    tools: selectedItems.filter((item) => item.category === "tool").map((item) => item.name),
  }
}

type ProjectFormProps = {
  project?: Project
  stackItems: StackItem[]
  stackLoading: boolean
  onSave: (project: Omit<Project, "id"> | Project) => void
  onCancel: () => void
  isInline?: boolean
}

function StackSelector({
  category,
  label,
  icon,
  stackItems,
  selectedIds,
  onToggle,
  filter,
}: {
  category: "tool" | "ai_skill"
  label: string
  icon: typeof Wrench
  stackItems: StackItem[]
  selectedIds: number[]
  onToggle: (id: number) => void
  filter: string
}) {
  const filteredItems = stackItems.filter((item) => {
    if (item.category !== category) {
      return false
    }

    if (!filter.trim()) {
      return true
    }

    return item.name.toLowerCase().includes(filter.trim().toLowerCase())
  })

  const Icon = icon

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline">{filteredItems.length}</Badge>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-2 md:grid-cols-2">
          {filteredItems.map((item) => {
            const checked = selectedIds.includes(item.id)

            return (
              <label
                key={item.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                  checked ? "border-black bg-black text-white" : "border-gray-200 bg-white text-black hover:border-black"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => onToggle(item.id)}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant={checked ? "secondary" : "outline"} className="text-[10px]">
                      Grade {item.grade}
                    </Badge>
                  </div>
                </div>
              </label>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No matching stack items.</p>
      )}
    </div>
  )
}

function ProjectForm({
  project,
  stackItems,
  stackLoading,
  onSave,
  onCancel,
  isInline = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: project?.title || "",
    description: project?.description || "",
    objectives: project?.objectives || "",
    progress: project?.progress || 0,
    status: project?.status || "planning",
    stackItemIds: project?.stackItemIds || [],
    aiSkills: project?.aiSkills || [],
    tools: project?.tools || [],
    timeframe: project?.timeframe || "",
    url: project?.url || "",
  })
  const [stackFilter, setStackFilter] = useState("")

  const selectedStack = deriveProjectStack(stackItems, formData.stackItemIds)

  const toggleStackItem = (stackItemId: number) => {
    setFormData((prev) => ({
      ...prev,
      stackItemIds: prev.stackItemIds.includes(stackItemId)
        ? prev.stackItemIds.filter((id) => id !== stackItemId)
        : [...prev.stackItemIds, stackItemId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nextProject = {
      ...formData,
      aiSkills: selectedStack.aiSkills,
      tools: selectedStack.tools,
    }

    if (project) {
      onSave({ ...nextProject, id: project.id })
      return
    }

    onSave(nextProject)
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Input
          placeholder="Project Title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <Textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        required
      />

      <div>
        <label className="text-sm font-medium">Objectives (max 15 words)</label>
        <Input
          placeholder="Brief project objectives"
          value={formData.objectives || ""}
          onChange={(e) => {
            const words = e.target.value.trim().split(/\s+/).filter(Boolean)
            if (words.length <= 15) {
              setFormData((prev) => ({ ...prev, objectives: e.target.value }))
            }
          }}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.objectives ? formData.objectives.trim().split(/\s+/).filter(Boolean).length : 0}/15 words
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Progress (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData((prev) => ({ ...prev, progress: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value: "active" | "planning" | "completed") =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Input
          placeholder="Timeframe"
          value={formData.timeframe || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, timeframe: e.target.value }))}
        />
      </div>

      <div>
        <Input
          placeholder="Project URL"
          value={formData.url ?? ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
        />
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium">Project Stack</p>
            <p className="text-xs text-gray-500">Select tools and AI skills from the managed stack catalog.</p>
          </div>
          <Input
            className="md:max-w-xs"
            placeholder="Filter stack"
            value={stackFilter}
            onChange={(e) => setStackFilter(e.target.value)}
          />
        </div>

        {stackLoading ? (
          <p className="text-sm text-gray-500">Loading stack items...</p>
        ) : stackItems.length === 0 ? (
          <p className="text-sm text-gray-500">No stack items yet. Add them from the Stack tab first.</p>
        ) : (
          <div className="space-y-5">
            <StackSelector
              category="tool"
              label="Tools"
              icon={Wrench}
              stackItems={stackItems}
              selectedIds={formData.stackItemIds}
              onToggle={toggleStackItem}
              filter={stackFilter}
            />
            <StackSelector
              category="ai_skill"
              label="AI Skills"
              icon={Sparkles}
              stackItems={stackItems}
              selectedIds={formData.stackItemIds}
              onToggle={toggleStackItem}
              filter={stackFilter}
            />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Selected Stack</p>
          <div className="flex flex-wrap gap-2">
            {selectedStack.tools.map((tool) => (
              <Badge key={tool} variant="outline">
                {tool}
              </Badge>
            ))}
            {selectedStack.aiSkills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
            {selectedStack.tools.length === 0 && selectedStack.aiSkills.length === 0 ? (
              <span className="text-sm text-gray-500">No stack items selected.</span>
            ) : null}
          </div>
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
        <CardTitle>{project ? "Edit Project" : "Create New Project"}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}

export function ProjectManager() {
  const {
    projects,
    loading,
    saveProject: saveProjectDb,
    deleteProject: deleteProjectDb,
  } = useProjects()
  const { stackItems, loading: stackLoading } = useStack()
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSaveProject = async (project: Omit<Project, "id"> | Project) => {
    const result = await saveProjectDb(project)

    if (result.success) {
      setEditingProjectId(null)
      setIsCreating(false)
    } else if (result.error) {
      alert(`Failed to save: ${result.error}`)
    }
  }

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(`Delete "${project.title}"? This action cannot be undone.`)
    if (!confirmed) {
      return
    }

    const result = await deleteProjectDb(project.id)
    if (!result.success && result.error) {
      alert(`Failed to delete project: ${result.error}`)
      return
    }

    if (editingProjectId === project.id) {
      setEditingProjectId(null)
    }
  }

  if (loading) {
    return <div className="py-8 text-center">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-sm text-gray-500">Projects now select stack items from the managed stack catalog.</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {isCreating ? (
        <ProjectForm
          stackItems={stackItems}
          stackLoading={stackLoading}
          onSave={handleSaveProject}
          onCancel={() => setIsCreating(false)}
        />
      ) : null}

      <div className="grid gap-4">
        {projects.map((project) => {
          const { status, badge: statusBadgeClass } = getProjectStatusStyles(project.status)

          return (
            <Card key={project.id} className={editingProjectId === project.id ? "ring-2 ring-blue-500" : ""}>
              {editingProjectId === project.id ? (
                <CardContent className="pt-6">
                  <ProjectForm
                    project={project}
                    stackItems={stackItems}
                    stackLoading={stackLoading}
                    onSave={handleSaveProject}
                    onCancel={() => setEditingProjectId(null)}
                    isInline
                  />
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {project.title}
                          <Badge variant="outline" className={statusBadgeClass}>
                            {status}
                          </Badge>
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProjectId(project.id)}
                          aria-label={`Edit ${project.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project)}
                          aria-label={`Delete ${project.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-600">{project.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">AI Skills: </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {project.aiSkills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-medium">Tools: </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {project.tools.map((tool) => (
                              <Badge key={tool} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
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
