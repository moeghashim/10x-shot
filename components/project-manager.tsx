"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Plus, Save, X } from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import type { Project } from "@/types/database"

export function ProjectManager() {
  const { projects, loading, saveProject: saveProjectDb } = useProjects()
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSaveProject = async (project: Omit<Project, 'id'> | Project) => {
    const result = await saveProjectDb(project)
    
    if (result.success) {
      setEditingProject(null)
      setIsCreating(false)
    } else if (result.error) {
      alert(`Failed to save: ${result.error}`)
    }
  }

  const ProjectForm = ({ project, onSave, onCancel }: {
    project?: Project
    onSave: (project: Omit<Project, 'id'> | Project) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
      title: project?.title || "",
      domain: project?.domain || "",
      description: project?.description || "",
      progress: project?.progress || 0,
      status: project?.status || "planning",
      mySkills: project?.mySkills || [],
      aiSkills: project?.aiSkills || [],
      tools: project?.tools || [],
      productivity: project?.productivity || 0,
      url: project?.url || "",
    })

    // Store string versions for editing
    const [mySkillsInput, setMySkillsInput] = useState(project?.mySkills?.join(', ') || '')
    const [aiSkillsInput, setAiSkillsInput] = useState(project?.aiSkills?.join(', ') || '')
    const [toolsInput, setToolsInput] = useState(project?.tools?.join(', ') || '')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const projectData = {
        ...formData,
        mySkills: mySkillsInput.split(',').map(item => item.trim()).filter(Boolean),
        aiSkills: aiSkillsInput.split(',').map(item => item.trim()).filter(Boolean),
        tools: toolsInput.split(',').map(item => item.trim()).filter(Boolean),
      }
      if (project) {
        onSave({ ...projectData, id: project.id })
      } else {
        onSave(projectData)
      }
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Project Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              <Input
                placeholder="Domain"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                required
              />
            </div>
            
            <Textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Progress (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData(prev => ({ ...prev, progress: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value: "active" | "planning" | "completed") => 
                  setFormData(prev => ({ ...prev, status: value }))
                }>
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
              <div>
                <label className="text-sm font-medium">Productivity Score</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.productivity}
                  onChange={(e) => setFormData(prev => ({ ...prev, productivity: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <Input
                placeholder="Project URL"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">My Skills (comma-separated)</label>
              <Input
                placeholder="React, Node.js, Database Design"
                value={mySkillsInput}
                onChange={(e) => setMySkillsInput(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">AI Skills (comma-separated)</label>
              <Input
                placeholder="Content Generation, Optimization, Analysis"
                value={aiSkillsInput}
                onChange={(e) => setAiSkillsInput(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tools (comma-separated)</label>
              <Input
                placeholder="ChatGPT, Vercel, Supabase"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {(isCreating || editingProject) && (
        <ProjectForm
          project={editingProject || undefined}
          onSave={handleSaveProject}
          onCancel={() => {
            setIsCreating(false)
            setEditingProject(null)
          }}
        />
      )}

      <div className="grid gap-4">
        {(projects || []).map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.title}
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{project.domain}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="text-sm">
                  <span className="font-medium">Productivity: </span>
                  <span>{project.productivity}/10</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-sm">My Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(project.mySkills || []).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm">AI Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(project.aiSkills || []).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}