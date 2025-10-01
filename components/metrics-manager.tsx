"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Save, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { format, parseISO } from "date-fns"

interface Metric {
  id?: number
  project_id: number
  month: string
  progress: number
  productivity_score: number
  hours_worked: number
  ai_assistance_hours: number
  manual_hours: number
  notes?: string
  created_at?: string
}

interface Project {
  id: number
  title: string
  domain: string
}

export function MetricsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [newMetric, setNewMetric] = useState<Omit<Metric, 'id' | 'created_at'>>({
    project_id: 0,
    month: format(new Date(), 'yyyy-MM'),
    progress: 0,
    productivity_score: 0,
    hours_worked: 0,
    ai_assistance_hours: 0,
    manual_hours: 0,
    notes: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
    loadMetrics()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      setNewMetric(prev => ({ ...prev, project_id: selectedProject }))
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, domain')
        .order('title')

      if (error) {
        console.warn("Database not ready for projects, using fallback:", error)
        // Use fallback projects for metrics manager
        const fallbackProjects = [
          { id: 1, title: "AI E-commerce Platform", domain: "E-commerce" },
          { id: 2, title: "Bannaa - Arabic AI School", domain: "Media & Content" },
          { id: 3, title: "Data Analytics Dashboard", domain: "Analytics" },
          { id: 4, title: "Mobile Fitness App", domain: "Health & Fitness" },
          { id: 5, title: "Legal Document Processor", domain: "Legal Tech" },
          { id: 6, title: "Educational Platform", domain: "EdTech" },
          { id: 7, title: "Financial Planning Tool", domain: "FinTech" },
          { id: 8, title: "Smart Home Automation", domain: "IoT" },
          { id: 9, title: "Marketing Automation Suite", domain: "Marketing" },
          { id: 10, title: "Creative Design Studio", domain: "Design" },
        ]
        setProjects(fallbackProjects)
        if (!selectedProject) {
          setSelectedProject(1)
        }
        return
      }
      setProjects(data || [])
      
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id)
      }
    } catch (error) {
      console.warn("Failed to load projects, using fallback:", error)
      const fallbackProjects = [
        { id: 1, title: "AI E-commerce Platform", domain: "E-commerce" },
        { id: 2, title: "Bannaa - Arabic AI School", domain: "Media & Content" },
        { id: 3, title: "Data Analytics Dashboard", domain: "Analytics" },
        { id: 4, title: "Mobile Fitness App", domain: "Health & Fitness" },
        { id: 5, title: "Legal Document Processor", domain: "Legal Tech" },
        { id: 6, title: "Educational Platform", domain: "EdTech" },
        { id: 7, title: "Financial Planning Tool", domain: "FinTech" },
        { id: 8, title: "Smart Home Automation", domain: "IoT" },
        { id: 9, title: "Marketing Automation Suite", domain: "Marketing" },
        { id: 10, title: "Creative Design Studio", domain: "Design" },
      ]
      setProjects(fallbackProjects)
      if (!selectedProject) {
        setSelectedProject(1)
      }
    }
  }

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('project_metrics')
        .select(`
          *,
          projects:project_id (title, domain)
        `)
        .order('month', { ascending: false })

      if (error) {
        console.warn("Database error:", error)
        return
      }
      setMetrics(data || [])
    } catch (error) {
      console.warn("Failed to load metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveMetric = async () => {
    try {
      const { error } = await supabase
        .from('project_metrics')
        .insert([newMetric])

      if (error) {
        console.warn("Database error:", error)
        return
      }

      // Reset form
      setNewMetric({
        project_id: selectedProject || 0,
        month: format(new Date(), 'yyyy-MM'),
        progress: 0,
        productivity_score: 0,
        hours_worked: 0,
        ai_assistance_hours: 0,
        manual_hours: 0,
        notes: ""
      })

      // Reload metrics
      loadMetrics()
    } catch (error) {
      console.warn("Failed to save metric:", error)
    }
  }

  const getProjectMetrics = (projectId: number) => {
    return metrics.filter(m => m.project_id === projectId)
  }

  const calculateTrend = (projectId: number, field: keyof Metric) => {
    const projectMetrics = getProjectMetrics(projectId)
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
    
    if (projectMetrics.length < 2) return null
    
    const current = projectMetrics[0][field] as number
    const previous = projectMetrics[1][field] as number
    
    if (current > previous) return 'up'
    if (current < previous) return 'down'
    return 'same'
  }

  if (loading) {
    return <div className="text-center py-8">Loading metrics...</div>
  }

  const filteredMetrics = selectedProject ? getProjectMetrics(selectedProject) : metrics

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Metrics Tracking</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedProject?.toString()} onValueChange={(value) => setSelectedProject(Number(value))}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {(projects || []).map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add New Metric Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Monthly Metric
          </CardTitle>
          <CardDescription>
            Track progress and productivity for the selected project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Month</label>
              <Input
                type="month"
                value={newMetric.month}
                onChange={(e) => setNewMetric(prev => ({ ...prev, month: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Progress (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newMetric.progress}
                onChange={(e) => setNewMetric(prev => ({ ...prev, progress: Number(e.target.value) }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Productivity Score</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={newMetric.productivity_score}
                onChange={(e) => setNewMetric(prev => ({ ...prev, productivity_score: Number(e.target.value) }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Total Hours</label>
              <Input
                type="number"
                min="0"
                value={newMetric.hours_worked}
                onChange={(e) => setNewMetric(prev => ({ ...prev, hours_worked: Number(e.target.value) }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">AI Assistance Hours</label>
              <Input
                type="number"
                min="0"
                value={newMetric.ai_assistance_hours}
                onChange={(e) => setNewMetric(prev => ({ ...prev, ai_assistance_hours: Number(e.target.value) }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Manual Hours</label>
              <Input
                type="number"
                min="0"
                value={newMetric.manual_hours}
                onChange={(e) => setNewMetric(prev => ({ ...prev, manual_hours: Number(e.target.value) }))}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Monthly summary, challenges, achievements..."
              value={newMetric.notes}
              onChange={(e) => setNewMetric(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <Button onClick={saveMetric} className="mt-4">
            <Save className="h-4 w-4 mr-2" />
            Save Metric
          </Button>
        </CardContent>
      </Card>

      {/* Metrics History */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          {selectedProject ? `Metrics for ${projects.find(p => p.id === selectedProject)?.title}` : 'All Metrics'}
        </h3>
        
        {filteredMetrics.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No metrics recorded yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {(filteredMetrics || []).map((metric) => {
              const project = projects.find(p => p.id === metric.project_id)
              const progressTrend = calculateTrend(metric.project_id, 'progress')
              const productivityTrend = calculateTrend(metric.project_id, 'productivity_score')
              
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {format(parseISO(metric.month + '-01'), 'MMMM yyyy')}
                        </CardTitle>
                        {!selectedProject && (
                          <CardDescription>{project?.title}</CardDescription>
                        )}
                      </div>
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(parseISO(metric.created_at || metric.month + '-01'), 'MMM dd')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">Progress</span>
                          {progressTrend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {progressTrend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                          {progressTrend === 'same' && <Minus className="h-3 w-3 text-gray-500" />}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{metric.progress}%</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">Productivity</span>
                          {productivityTrend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                          {productivityTrend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                          {productivityTrend === 'same' && <Minus className="h-3 w-3 text-gray-500" />}
                        </div>
                        <div className="text-2xl font-bold text-green-600">{metric.productivity_score}/10</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-medium">Total Hours</div>
                        <div className="text-2xl font-bold text-purple-600">{metric.hours_worked}h</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-medium">AI Efficiency</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {metric.hours_worked > 0 
                            ? Math.round((metric.ai_assistance_hours / metric.hours_worked) * 100)
                            : 0}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">AI Hours:</span> {metric.ai_assistance_hours}h | 
                        <span className="font-medium"> Manual Hours:</span> {metric.manual_hours}h
                      </div>
                      
                      {metric.notes && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Notes: </span>
                          <span className="text-sm text-gray-600">{metric.notes}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}