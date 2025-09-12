"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Edit, FolderOpen, ExternalLink, AlertCircle, Save, X } from "lucide-react"
import { toast } from "sonner"
import type { Project } from "@/lib/validations"

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    progress: 0,
    skills: [] as string[],
    tools: [] as string[],
    productivity: 0,
    timeframe: "",
    url: "",
  })
  const [newSkill, setNewSkill] = useState("")
  const [newTool, setNewTool] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      } else {
        toast.error("Failed to fetch projects")
      }
    } catch (error) {
      toast.error("Error loading projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingProject ? `/api/projects/${editingProject}` : "/api/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingProject ? "Project updated successfully!" : "Project added successfully!")
        await fetchProjects()
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save project")
      }
    } catch (error) {
      toast.error("Error saving project")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      domain: project.domain || "",
      progress: project.progress,
      skills: project.skills,
      tools: project.tools,
      productivity: project.productivity,
      timeframe: project.timeframe,
      url: project.url || "",
    })
    setEditingProject(project.id || null)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Project deleted successfully!")
        await fetchProjects()
      } else {
        toast.error("Failed to delete project")
      }
    } catch (error) {
      toast.error("Error deleting project")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      domain: "",
      progress: 0,
      skills: [],
      tools: [],
      productivity: 0,
      timeframe: "",
      url: "",
    })
    setEditingProject(null)
    setNewSkill("")
    setNewTool("")
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addTool = () => {
    if (newTool.trim()) {
      setFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()],
      }))
      setNewTool("")
    }
  }

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Project Form */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingProject ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingProject ? "Edit Project" : "Add New Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Input
                  id="timeframe"
                  value={formData.timeframe}
                  onChange={(e) => setFormData((prev) => ({ ...prev, timeframe: e.target.value }))}
                  placeholder="e.g., 3 months"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project"
                rows={3}
                required
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain (optional)</Label>
                <Input
                  id="domain"
                  type="url"
                  value={formData.domain}
                  onChange={(e) => setFormData((prev) => ({ ...prev, domain: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Project URL (optional)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            {/* Progress and Productivity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, progress: Number.parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productivity">Productivity Gain (x)</Label>
                <Input
                  id="productivity"
                  type="number"
                  step="0.1"
                  value={formData.productivity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productivity: Number.parseFloat(e.target.value) || 0 }))
                  }
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(index)} className="ml-1 hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <Label>Tools</Label>
              <div className="flex gap-2">
                <Input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="Add a tool..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTool())}
                />
                <Button type="button" onClick={addTool} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tool}
                    <button type="button" onClick={() => removeTool(index)} className="ml-1 hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
                {isSubmitting ? (
                  editingProject ? (
                    "Updating..."
                  ) : (
                    "Adding..."
                  )
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingProject ? "Update Project" : "Add Project"}
                  </>
                )}
              </Button>
              {editingProject && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Projects */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Existing Projects ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No projects found. Add your first project above.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{project.title}</h4>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => project.id && handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <span className="ml-1 font-medium">{project.progress}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Productivity:</span>
                      <span className="ml-1 font-medium">{project.productivity}x</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeframe:</span>
                      <span className="ml-1 font-medium">{project.timeframe}</span>
                    </div>
                    <div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Project
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
