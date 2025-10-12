"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Plus, 
  Save, 
  Twitter,
  Youtube,
  Heart,
  Instagram,
  Mail,
  DollarSign,
  Zap,
  TrendingUp
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { useGlobalMetrics } from "@/hooks/use-global-metrics"
import type { GlobalMetric } from "@/types/database"

export function GlobalMetricsManager() {
  const { metrics, loading, saveMetric, reload } = useGlobalMetrics()
  const [newMetric, setNewMetric] = useState<Omit<GlobalMetric, 'id' | 'created_at'>>({
    month: format(new Date(), 'yyyy-MM-01'),
    twitter_followers: 0,
    youtube_subscribers: 0,
    tiktok_followers: 0,
    instagram_followers: 0,
    newsletter_subscribers: 0,
    total_gmv: 0,
    productivity_gain: 0,
    skills_gained: [],
    milestones: []
  })
  const [skillsInput, setSkillsInput] = useState("")
  const [milestonesInput, setMilestonesInput] = useState("")

  const handleSaveMetric = async () => {
    const metricData = {
      ...newMetric,
      skills_gained: skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0),
      milestones: milestonesInput.split(',').map(m => m.trim()).filter(m => m.length > 0)
    }

    const result = await saveMetric(metricData)
    
    if (result.success) {
      // Reset form
      setNewMetric({
        month: format(new Date(), 'yyyy-MM-01'),
        twitter_followers: 0,
        youtube_subscribers: 0,
        tiktok_followers: 0,
        instagram_followers: 0,
        newsletter_subscribers: 0,
        total_gmv: 0,
        productivity_gain: 0,
        skills_gained: [],
        milestones: []
      })
      setSkillsInput("")
      setMilestonesInput("")
    }
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { change: 0, percentage: 0 }
    const change = current - previous
    const percentage = ((change / previous) * 100)
    return { change, percentage }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  if (loading) {
    return <div className="text-center">Loading metrics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Global Metrics</h2>
          <p className="text-gray-600">Track overall progress and key metrics</p>
        </div>
      </div>

      {/* Add New Metric */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Month
          </CardTitle>
          <CardDescription>
            Add metrics for a new month or update existing ones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <Input
                type="month"
                value={newMetric.month.slice(0, 7)}
                onChange={(e) => setNewMetric({...newMetric, month: e.target.value + '-01'})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter Followers</label>
              <Input
                type="number"
                value={newMetric.twitter_followers}
                onChange={(e) => setNewMetric({...newMetric, twitter_followers: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube Subscribers</label>
              <Input
                type="number"
                value={newMetric.youtube_subscribers}
                onChange={(e) => setNewMetric({...newMetric, youtube_subscribers: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">TikTok Followers</label>
              <Input
                type="number"
                value={newMetric.tiktok_followers}
                onChange={(e) => setNewMetric({...newMetric, tiktok_followers: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram Followers</label>
              <Input
                type="number"
                value={newMetric.instagram_followers}
                onChange={(e) => setNewMetric({...newMetric, instagram_followers: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Newsletter Subscribers</label>
              <Input
                type="number"
                value={newMetric.newsletter_subscribers}
                onChange={(e) => setNewMetric({...newMetric, newsletter_subscribers: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total GMV ($)</label>
              <Input
                type="number"
                value={newMetric.total_gmv}
                onChange={(e) => setNewMetric({...newMetric, total_gmv: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Productivity Gain (x)</label>
              <Input
                type="number"
                step="0.1"
                value={newMetric.productivity_gain}
                onChange={(e) => setNewMetric({...newMetric, productivity_gain: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skills Gained (comma-separated)</label>
              <Textarea
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="UI/UX Design, Team Leadership, Advanced Coding"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Milestones (comma-separated)</label>
              <Textarea
                value={milestonesInput}
                onChange={(e) => setMilestonesInput(e.target.value)}
                placeholder="5k Instagram followers, $40k month, New product launch"
                rows={3}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveMetric} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Metric
          </Button>
        </CardContent>
      </Card>

      {/* Metrics List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Monthly Progress</h3>
        
        {(metrics || []).map((metric, index) => {
          const previousMetric = metrics[index + 1]
          
          return (
            <Card key={metric.id || metric.month} className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <CardTitle className="text-xl text-black">
                      {format(parseISO(metric.month), 'MMMM yyyy')}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-gray-600 border-gray-300">
                    Month {metrics.length - index}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Media Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Twitter className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">
                        {formatNumber(metric.twitter_followers)}
                      </div>
                      <div className="text-xs text-blue-600">Twitter</div>
                      {previousMetric && (
                        <div className="text-xs text-blue-500">
                          {calculateChange(metric.twitter_followers, previousMetric.twitter_followers).change > 0 ? '+' : ''}
                          {formatNumber(calculateChange(metric.twitter_followers, previousMetric.twitter_followers).change)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-900">
                        {formatNumber(metric.youtube_subscribers)}
                      </div>
                      <div className="text-xs text-red-600">YouTube</div>
                      {previousMetric && (
                        <div className="text-xs text-red-500">
                          {calculateChange(metric.youtube_subscribers, previousMetric.youtube_subscribers).change > 0 ? '+' : ''}
                          {formatNumber(calculateChange(metric.youtube_subscribers, previousMetric.youtube_subscribers).change)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <div>
                      <div className="font-semibold text-pink-900">
                        {formatNumber(metric.tiktok_followers)}
                      </div>
                      <div className="text-xs text-pink-600">TikTok</div>
                      {previousMetric && (
                        <div className="text-xs text-pink-500">
                          {calculateChange(metric.tiktok_followers, previousMetric.tiktok_followers).change > 0 ? '+' : ''}
                          {formatNumber(calculateChange(metric.tiktok_followers, previousMetric.tiktok_followers).change)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Instagram className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-purple-900">
                        {formatNumber(metric.instagram_followers)}
                      </div>
                      <div className="text-xs text-purple-600">Instagram</div>
                      {previousMetric && (
                        <div className="text-xs text-purple-500">
                          {calculateChange(metric.instagram_followers, previousMetric.instagram_followers).change > 0 ? '+' : ''}
                          {formatNumber(calculateChange(metric.instagram_followers, previousMetric.instagram_followers).change)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(metric.newsletter_subscribers)}
                      </div>
                      <div className="text-xs text-gray-600">Newsletter</div>
                      {previousMetric && (
                        <div className="text-xs text-gray-500">
                          {calculateChange(metric.newsletter_subscribers, previousMetric.newsletter_subscribers).change > 0 ? '+' : ''}
                          {formatNumber(calculateChange(metric.newsletter_subscribers, previousMetric.newsletter_subscribers).change)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-900">
                        ${formatNumber(metric.total_gmv)}
                      </div>
                      <div className="text-xs text-green-600">Total GMV</div>
                      {previousMetric && (
                        <div className="text-xs text-green-500">
                          {calculateChange(metric.total_gmv, previousMetric.total_gmv).change > 0 ? '+' : ''}
                          ${formatNumber(calculateChange(metric.total_gmv, previousMetric.total_gmv).change)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-orange-900">
                        {metric.productivity_gain}x
                      </div>
                      <div className="text-xs text-orange-600">Productivity</div>
                      {previousMetric && (
                        <div className="text-xs text-orange-500">
                          {calculateChange(metric.productivity_gain, previousMetric.productivity_gain).change > 0 ? '+' : ''}
                          {calculateChange(metric.productivity_gain, previousMetric.productivity_gain).change.toFixed(1)}x
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <Zap className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-indigo-900">
                        {metric.skills_gained.length}
                      </div>
                      <div className="text-xs text-indigo-600">Skills Gained</div>
                    </div>
                  </div>
                </div>

                {/* Skills Gained */}
                {metric.skills_gained && metric.skills_gained.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Skills Gained This Month
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(metric.skills_gained || []).map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="outline"
                          className="text-gray-700 border-gray-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones */}
                {metric.milestones && metric.milestones.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Key Milestones
                    </h4>
                    <ul className="space-y-1">
                      {(metric.milestones || []).map((milestone, milestoneIndex) => (
                        <li key={milestoneIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}