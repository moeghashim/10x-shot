"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, DollarSign, Plus, Save, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useProjectMetrics } from "@/hooks/use-metrics"
import type { ProjectMetric, ProjectSummary } from "@/types/database"

type TrendField = "progress" | "productivity_score" | "hours_worked" | "ai_assistance_hours" | "manual_hours"

export function MetricsManager() {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const {
    metrics,
    loading,
    error: metricsError,
    saveMetric: saveMetricDb,
    deleteMetric: deleteMetricDb,
  } = useProjectMetrics(selectedProject || undefined)
  const [newMetric, setNewMetric] = useState<Omit<ProjectMetric, 'id' | 'created_at'>>({
    project_id: 0,
    month: format(new Date(), 'yyyy-MM'),
    progress: 0,
    sales_gmv: 0,
    productivity_score: 0,
    hours_worked: 0,
    ai_assistance_hours: 0,
    manual_hours: 0,
    achievements: [],
    notes: ""
  })
  const [achievementsInput, setAchievementsInput] = useState("")
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  const validateMetric = () => {
    if (!selectedProject || !newMetric.project_id) {
      return "Select a project before saving metrics."
    }

    if (!newMetric.month) {
      return "Select a month before saving metrics."
    }

    if (newMetric.progress < 0 || newMetric.progress > 100) {
      return "Progress must be between 0 and 100."
    }

    if (newMetric.productivity_score < 0 || newMetric.productivity_score > 10) {
      return "Productivity Score must be between 0 and 10."
    }

    if (
      newMetric.sales_gmv < 0 ||
      newMetric.hours_worked < 0 ||
      newMetric.ai_assistance_hours < 0 ||
      newMetric.manual_hours < 0
    ) {
      return "Sales and hours cannot be negative."
    }

    return null
  }

  useEffect(() => {
    if (selectedProject) {
      setNewMetric(prev => ({ ...prev, project_id: selectedProject }))
      setFormMessage(null)
    }
  }, [selectedProject])

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
        setSelectedProject((current) => current ?? data[0].id)
      }
    }

    void loadProjects()
  }, [])

  const handleSaveMetric = async () => {
    setFormMessage(null)
    const validationError = validateMetric()
    if (validationError) {
      setFormMessage({ type: "error", text: validationError })
      return
    }

    const result = await saveMetricDb({
      ...newMetric,
      achievements: achievementsInput
        .split(",")
        .map((achievement) => achievement.trim())
        .filter((achievement) => achievement.length > 0),
    })
    
    if (result.success) {
      setFormMessage({ type: "success", text: "Metric saved." })
      // Reset form
      setNewMetric({
        project_id: selectedProject || 0,
        month: format(new Date(), 'yyyy-MM'),
        progress: 0,
        sales_gmv: 0,
        productivity_score: 0,
        hours_worked: 0,
        ai_assistance_hours: 0,
        manual_hours: 0,
        achievements: [],
        notes: ""
      })
      setAchievementsInput("")
    } else {
      setFormMessage({
        type: "error",
        text: result.error || "Metric could not be saved.",
      })
    }
  }

  const handleDeleteMetric = async (metric: ProjectMetric) => {
    setFormMessage(null)
    if (!metric.id) {
      setFormMessage({ type: "error", text: "This metric cannot be deleted because it is missing an id." })
      return
    }

    const monthLabel = format(parseISO(metric.month + "-01"), "MMMM yyyy")
    const confirmed = window.confirm(`Delete the ${monthLabel} metric? This action cannot be undone.`)
    if (!confirmed) {
      return
    }

    const result = await deleteMetricDb(metric.id)
    if (result.success) {
      setFormMessage({ type: "success", text: `${monthLabel} metric deleted.` })
      return
    }

    setFormMessage({
      type: "error",
      text: result.error || "Metric could not be deleted.",
    })
  }

  const getProjectMetrics = (projectId: number) => {
    return metrics.filter(m => m.project_id === projectId)
  }

  const calculateTrend = (projectId: number, field: TrendField) => {
    const projectMetrics = getProjectMetrics(projectId)
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
    
    if (projectMetrics.length < 2) return null
    
    const current = Number(projectMetrics[0][field] ?? 0)
    const previous = Number(projectMetrics[1][field] ?? 0)
    
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

      {metricsError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {metricsError}
        </div>
      ) : null}

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
          {formMessage ? (
            <div
              className={`mt-4 rounded-md border px-4 py-3 text-sm ${
                formMessage.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {formMessage.text}
            </div>
          ) : null}
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
              <label className="text-sm font-medium">Sales GMV ($)</label>
              <Input
                type="number"
                min="0"
                value={newMetric.sales_gmv}
                onChange={(e) => setNewMetric(prev => ({ ...prev, sales_gmv: Number(e.target.value) }))}
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
            <label className="text-sm font-medium">Achievements (comma-separated)</label>
            <Textarea
              placeholder="First paid order, Closed partner pilot, Shipped analytics"
              value={achievementsInput}
              onChange={(e) => setAchievementsInput(e.target.value)}
              rows={3}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Monthly summary, challenges, achievements..."
              value={newMetric.notes}
              onChange={(e) => setNewMetric(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <Button onClick={handleSaveMetric} className="mt-4">
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
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(parseISO(metric.created_at || metric.month + '-01'), 'MMM dd')}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                          onClick={() => handleDeleteMetric(metric)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
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
                          <span className="font-medium">Sales GMV</span>
                          <DollarSign className="h-3 w-3 text-gray-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${metric.sales_gmv.toLocaleString()}
                        </div>
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

                      {metric.achievements.length > 0 && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Achievements: </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {metric.achievements.map((achievement) => (
                              <Badge key={`${metric.id}-${achievement}`} variant="outline">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
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
