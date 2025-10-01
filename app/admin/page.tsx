"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAuth } from "@/components/admin-auth"
import { ProjectManager } from "@/components/project-manager"
import { MetricsManager } from "@/components/metrics-manager"
import { GlobalMetricsManager } from "@/components/global-metrics-manager"
import { UserManager } from "@/components/user-manager"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const isAuthenticated = !!session

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage projects and track metrics</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="project-metrics">Project Metrics</TabsTrigger>
            <TabsTrigger value="global-metrics">Global Metrics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
            <ProjectManager />
          </TabsContent>
          
          <TabsContent value="project-metrics" className="mt-6">
            <MetricsManager />
          </TabsContent>
          
          <TabsContent value="global-metrics" className="mt-6">
            <GlobalMetricsManager />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}