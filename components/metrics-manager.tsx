"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Calendar, Users, DollarSign, Target, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import type { Metric } from "@/lib/validations"

export function MetricsManager() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear(),
    twitter_followers: 0,
    linkedin_followers: 0,
    newsletter_subscribers: 0,
    total_gmv: 0,
    productivity_gain: 0,
    skills_gained: [] as string[],
    milestones: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")
  const [newMilestone, setNewMilestone] = useState("")

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics || [])
      } else {
        toast.error("Failed to fetch metrics")
      }
    } catch (error) {
      toast.error("Error loading metrics")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Metrics added successfully!")
        await fetchMetrics()
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add metrics")
      }
    } catch (error) {
      toast.error("Error adding metrics")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      month: "",
      year: new Date().getFullYear(),
      twitter_followers: 0,
      linkedin_followers: 0,
      newsletter_subscribers: 0,
      total_gmv: 0,
      productivity_gain: 0,
      skills_gained: [],
      milestones: [],
    })
    setNewSkill("")
    setNewMilestone("")
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills_gained: [...prev.skills_gained, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills_gained: prev.skills_gained.filter((_, i) => i !== index),
    }))
  }

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setFormData((prev) => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone.trim()],
      }))
      setNewMilestone("")
    }
  }

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Metrics Form */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Monthly Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Month and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <select
                  id="month"
                  value={formData.month}
                  onChange={(e) => setFormData((prev) => ({ ...prev, month: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                  min="2020"
                  max="2030"
                  required
                />
              </div>
            </div>

            {/* Social Media Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Media Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter Followers</Label>
                  <Input
                    id="twitter"
                    type="number"
                    value={formData.twitter_followers}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, twitter_followers: Number.parseInt(e.target.value) || 0 }))
                    }
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Followers</Label>
                  <Input
                    id="linkedin"
                    type="number"
                    value={formData.linkedin_followers}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, linkedin_followers: Number.parseInt(e.target.value) || 0 }))
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Business Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Business Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newsletter">Newsletter Subscribers</Label>
                  <Input
                    id="newsletter"
                    type="number"
                    value={formData.newsletter_subscribers}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, newsletter_subscribers: Number.parseInt(e.target.value) || 0 }))
                    }
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gmv">Total GMV ($)</Label>
                  <Input
                    id="gmv"
                    type="number"
                    step="0.01"
                    value={formData.total_gmv}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, total_gmv: Number.parseFloat(e.target.value) || 0 }))
                    }
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productivity">Productivity Gain (x)</Label>
                  <Input
                    id="productivity"
                    type="number"
                    step="0.1"
                    value={formData.productivity_gain}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, productivity_gain: Number.parseFloat(e.target.value) || 0 }))
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Skills Gained */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skills Gained
              </h3>
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
                {formData.skills_gained.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(index)} className="ml-1 hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Milestones
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Add a milestone..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMilestone())}
                />
                <Button type="button" onClick={addMilestone} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.milestones.map((milestone, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {milestone}
                    <button type="button" onClick={() => removeMilestone(index)} className="ml-1 hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isSubmitting}>
              {isSubmitting ? "Adding Metrics..." : "Add Metrics"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Metrics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Existing Metrics ({metrics.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No metrics found. Add your first monthly metrics above.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-lg">
                      {metric.month} {metric.year}
                    </h4>
                    <Badge variant="outline">{metric.skills_gained.length} skills</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Twitter:</span>
                      <span className="ml-1 font-medium">{metric.twitter_followers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">LinkedIn:</span>
                      <span className="ml-1 font-medium">{metric.linkedin_followers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Newsletter:</span>
                      <span className="ml-1 font-medium">{metric.newsletter_subscribers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">GMV:</span>
                      <span className="ml-1 font-medium">${metric.total_gmv.toLocaleString()}</span>
                    </div>
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
