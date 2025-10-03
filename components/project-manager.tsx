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

      if (error) {
        console.warn("Database not ready, using fallback data:", error)
        loadFallbackProjects()
        return
      }
      setProjects(data || [])
    } catch (error) {
      console.warn("Failed to load projects:", error)
      // Fallback to hardcoded data if database fails
      loadFallbackProjects()
    } finally {
      setLoading(false)
    }
  }

  const loadFallbackProjects = () => {
    // Complete 10x experiment portfolio fallback data
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
        url: "https://ai-ecommerce-demo.vercel.app",
      },
      {
        id: 2,
        title: "Bannaa - Arabic AI School",
        domain: "Media & Content",
        description: "AI‑focused school targeting the Arab world.",
        progress: 2,
        status: "active",
        mySkills: ["Content Strategy", "Management"],
        aiSkills: ["Writing", "Video Editing", "Image Generation"],
        tools: ["ChatGPT", "Claude", "Runway ML", "N8N", "Airtable", "VEO", "Gemini", "Midjourney"],
        productivity: 0.1,
        url: "https://bannaa.ai",
      },
      {
        id: 3,
        title: "Data Analytics Dashboard",
        domain: "Analytics",
        description: "Automated data processing, visualization, and insight generation",
        progress: 78,
        status: "active",
        mySkills: ["Data Analysis", "Visualization", "Statistics"],
        aiSkills: ["Data Processing", "Pattern Recognition", "Report Generation"],
        tools: ["ChatGPT", "Tableau", "Python", "Jupyter", "AWS", "MongoDB"],
        productivity: 6.8,
        url: "https://analytics-ai-dashboard.vercel.app",
      },
      {
        id: 4,
        title: "Mobile Fitness App",
        domain: "Health & Fitness",
        description: "Personalized workout plans, nutrition tracking, and progress monitoring",
        progress: 65,
        status: "active",
        mySkills: ["Mobile Development", "UI/UX", "Health Domain"],
        aiSkills: ["Personalization", "Computer Vision", "Nutrition Analysis"],
        tools: ["ChatGPT", "React Native", "Firebase", "TensorFlow", "Figma"],
        productivity: 5.2,
        url: "https://fitness-ai-app.vercel.app",
      },
      {
        id: 5,
        title: "Legal Document Processor",
        domain: "Legal Tech",
        description: "Contract analysis, document generation, and compliance checking",
        progress: 45,
        status: "active",
        mySkills: ["Legal Research", "Document Processing", "Compliance"],
        aiSkills: ["NLP", "Document Analysis", "Legal Reasoning"],
        tools: ["ChatGPT", "Claude", "LangChain", "Pinecone", "Notion", "DocuSign"],
        productivity: 4.1,
        url: "https://legal-ai-processor.vercel.app",
      },
      {
        id: 6,
        title: "Educational Platform",
        domain: "EdTech",
        description: "Personalized learning paths, automated grading, and content adaptation",
        progress: 58,
        status: "active",
        mySkills: ["Education", "Curriculum Design", "Learning Theory"],
        aiSkills: ["Personalization", "Content Generation", "Assessment"],
        tools: ["ChatGPT", "Teachable Machine", "Moodle", "Zoom", "Loom", "Calendly"],
        productivity: 7.3,
        url: "https://edu-ai-platform.vercel.app",
      },
      {
        id: 7,
        title: "Financial Planning Tool",
        domain: "FinTech",
        description: "Investment recommendations, risk assessment, and portfolio optimization",
        progress: 72,
        status: "active",
        mySkills: ["Finance", "Investment Strategy", "Risk Management"],
        aiSkills: ["Market Analysis", "Risk Modeling", "Optimization"],
        tools: ["ChatGPT", "Alpha Vantage", "Plaid", "Chart.js", "Vercel", "PostgreSQL"],
        productivity: 9.1,
        url: "https://fintech-ai-planner.vercel.app",
      },
      {
        id: 8,
        title: "Smart Home Automation",
        domain: "IoT",
        description: "Intelligent device control, energy optimization, and predictive maintenance",
        progress: 25,
        status: "planning",
        mySkills: ["IoT", "Hardware Integration", "System Architecture"],
        aiSkills: ["Predictive Analytics", "Optimization", "Pattern Recognition"],
        tools: ["ChatGPT", "Arduino", "Raspberry Pi", "MQTT", "InfluxDB", "Grafana"],
        productivity: 3.2,
        url: "https://smarthome-ai-demo.vercel.app",
      },
      {
        id: 9,
        title: "Marketing Automation Suite",
        domain: "Marketing",
        description: "Campaign optimization, lead scoring, and personalized messaging",
        progress: 15,
        status: "planning",
        mySkills: ["Marketing Strategy", "Campaign Management", "Analytics"],
        aiSkills: ["Personalization", "Optimization", "Predictive Modeling"],
        tools: ["ChatGPT", "HubSpot", "Mailchimp", "Google Analytics", "Zapier", "Airtable"],
        productivity: 2.8,
        url: "https://marketing-ai-suite.vercel.app",
      },
      {
        id: 10,
        title: "Creative Design Studio",
        domain: "Design",
        description: "Automated design generation, brand consistency, and creative workflows",
        progress: 8,
        status: "planning",
        mySkills: ["Design Principles", "Brand Strategy", "Creative Direction"],
        aiSkills: ["Image Generation", "Design Automation", "Style Transfer"],
        tools: ["ChatGPT", "Midjourney", "DALL-E", "Figma", "Adobe Creative Suite", "Framer"],
        productivity: 1.9,
        url: "https://design-ai-studio.vercel.app",
      },
    ]
    setProjects(fallbackProjects)
  }

  const saveProject = async (project: Omit<Project, 'id'> | Project) => {
    try {
      // Map camelCase to snake_case for database
      const dbProject = {
        title: project.title,
        domain: project.domain,
        description: project.description,
        progress: project.progress,
        status: project.status,
        my_skills: project.mySkills,
        ai_skills: project.aiSkills,
        tools: project.tools,
        productivity: project.productivity,
        url: project.url,
      }

      if ('id' in project && project.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(dbProject)
          .eq('id', project.id)

        if (error) {
          console.error("Database error:", error)
          alert(`Failed to save: ${error.message}`)
          return
        }
        
        setProjects(prev => prev.map(p => p.id === project.id ? project : p))
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert([dbProject])
          .select()

        if (error) {
          console.error("Database error:", error)
          alert(`Failed to create: ${error.message}`)
          return
        }
        
        if (data) {
          setProjects(prev => [...prev, data[0]])
        }
      }
      
      setEditingProject(null)
      setIsCreating(false)
    } catch (error) {
      console.warn("Failed to save project:", error)
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
          onSave={saveProject}
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