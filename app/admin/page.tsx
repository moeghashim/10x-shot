"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAuth } from "@/components/admin-auth"
import { ProjectManager } from "@/components/project-manager"
import { MetricsManager } from "@/components/metrics-manager"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
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
    return <AdminAuth onAuthSuccess={() => setIsAuthenticated(true)} />
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Project Management</TabsTrigger>
            <TabsTrigger value="metrics">Metrics Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-6">
            <ProjectManager />
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6">
            <MetricsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}