"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAuth } from "@/components/admin-auth";
import { ProjectManager } from "@/components/project-manager";
import { MetricsManager } from "@/components/metrics-manager";
import { GlobalMetricsManager } from "@/components/global-metrics-manager";
import { RoadmapManager } from "@/components/roadmap-manager";
import { SiteCopyManager } from "@/components/site-copy-manager";
import { StackManager } from "@/components/stack-manager";
import { UserManager } from "@/components/user-manager";
import { authClient } from "@/lib/auth-client";

export default function AdminPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const isAuthenticated = Boolean(data?.session);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth />;
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
          <TabsList className="flex h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger className="shrink-0" value="projects">Projects</TabsTrigger>
            <TabsTrigger className="shrink-0" value="stack">Stack</TabsTrigger>
            <TabsTrigger className="shrink-0" value="project-metrics">Project Metrics</TabsTrigger>
            <TabsTrigger className="shrink-0" value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger className="shrink-0" value="global-metrics">Global Metrics</TabsTrigger>
            <TabsTrigger className="shrink-0" value="site-copy">Site Copy</TabsTrigger>
            <TabsTrigger className="shrink-0" value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="stack" className="mt-6">
            <StackManager />
          </TabsContent>

          <TabsContent value="project-metrics" className="mt-6">
            <MetricsManager />
          </TabsContent>

          <TabsContent value="roadmap" className="mt-6">
            <RoadmapManager />
          </TabsContent>

          <TabsContent value="global-metrics" className="mt-6">
            <GlobalMetricsManager />
          </TabsContent>

          <TabsContent value="site-copy" className="mt-6">
            <SiteCopyManager />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
