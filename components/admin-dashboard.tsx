"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FolderOpen, TrendingUp, Users, DollarSign, Target, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { MetricsManager } from "./metrics-manager"
import { ProjectsManager } from "./projects-manager"

export function AdminDashboard() {
  const { logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const overviewStats = [
    {
      title: "Total Projects",
      value: "5",
      change: "+1 this month",
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "Avg Productivity Gain",
      value: "2.8x",
      change: "+0.3x from last month",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Newsletter Subscribers",
      value: "950",
      change: "+130 this month",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total GMV",
      value: "$38.9k",
      change: "+23% from last month",
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your 10xBuilder.ai experiment</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <Card key={index} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-black">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setActiveTab("metrics")}
                    className="justify-start h-auto p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    variant="outline"
                  >
                    <div className="text-left">
                      <div className="font-medium">Add Monthly Metrics</div>
                      <div className="text-sm opacity-70">Update your progress data</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("projects")}
                    className="justify-start h-auto p-4 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    variant="outline"
                  >
                    <div className="text-left">
                      <div className="font-medium">Manage Projects</div>
                      <div className="text-sm opacity-70">Edit or add new projects</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bannaa project updated</p>
                      <p className="text-xs text-gray-500">Progress increased to 15%</p>
                    </div>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">May metrics added</p>
                      <p className="text-xs text-gray-500">Newsletter subscribers: 950</p>
                    </div>
                    <span className="text-xs text-gray-400">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsManager />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
