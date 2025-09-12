"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Plus, Save, X } from "lucide-react"

interface Project {
  id: number
  title: string
  domain: string
  description: string
  progress: number
  status: "active" | "planning" | "completed"
  mySkills: string[]
  aiSkills: string[]
  tools: string[]
  productivity: number
  timeframe: string
  url: string
}

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id')

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Failed to load projects:", error)
      // Fallback to hardcoded data if database fails
      loadFallbackProjects()
    } finally {
      setLoading(false)
    }
  }

  const loadFallbackProjects = () => {
    // This uses the existing project data from project-grid.tsx as fallback
    const fallbackProjects: Project[] = [
      {
        id: 1,
        title: "AI E-commerce Platform",
        domain: "E-commerce",
        description: "Automated product descriptions, pricing optimization, and customer service",
        progress: 85,
        status: "active",
        mySkills: ["React", "Node.js", "Database Design"],
        aiSkills: ["Content Generation", "Price Optimization", "Customer Support"],
        tools: ["ChatGPT", "Stripe", "Vercel", "Supabase", "Midjourney"],
        productivity: 8.2,
        timeframe: "3 months",
        url: "https://ai-ecommerce-demo.vercel.app",
      },
      // Add more projects from the original data...
    ]
    setProjects(fallbackProjects)
  }

  const saveProject = async (project: Omit<Project, 'id'> | Project) => {
    try {
      if ('id' in project && project.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(project)
          .eq('id', project.id)

        if (error) throw error
        
        setProjects(prev => prev.map(p => p.id === project.id ? project : p))
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert([project])
          .select()

        if (error) throw error
        
        if (data) {
          setProjects(prev => [...prev, data[0]])
        }
      }
      
      setEditingProject(null)
      setIsCreating(false)
    } catch (error) {
      console.error("Failed to save project:", error)
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
      timeframe: project?.timeframe || "",
      url: project?.url || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (project) {
        onSave({ ...formData, id: project.id })
      } else {
        onSave(formData)
      }
    }

    const updateArrayField = (field: 'mySkills' | 'aiSkills' | 'tools', value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value.split(',').map(item => item.trim()).filter(Boolean)
      }))
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Timeframe"
                value={formData.timeframe}
                onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
              />
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
                value={formData.mySkills.join(', ')}
                onChange={(e) => updateArrayField('mySkills', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">AI Skills (comma-separated)</label>
              <Input
                placeholder="Content Generation, Optimization, Analysis"
                value={formData.aiSkills.join(', ')}
                onChange={(e) => updateArrayField('aiSkills', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tools (comma-separated)</label>
              <Input
                placeholder="ChatGPT, Vercel, Supabase"
                value={formData.tools.join(', ')}
                onChange={(e) => updateArrayField('tools', e.target.value)}
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
          onSave={saveProject}
          onCancel={() => {
            setIsCreating(false)
            setEditingProject(null)
          }}
        />
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Productivity: </span>
                    <span>{project.productivity}/10</span>
                  </div>
                  <div>
                    <span className="font-medium">Timeframe: </span>
                    <span>{project.timeframe}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-sm">My Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.mySkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm">AI Skills: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.aiSkills.map((skill, index) => (
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