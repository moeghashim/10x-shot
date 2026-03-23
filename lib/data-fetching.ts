import "server-only";

import { unstable_cache } from "next/cache";
import { api } from "@/convex/_generated/api";
import { PROJECTS_CACHE_TAG } from "@/lib/cache-tags";
import { FALLBACK_GLOBAL_METRICS, FALLBACK_PROJECTS } from "@/lib/constants";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  fetchConvexQuery,
  hasConvexEnv,
} from "@/lib/auth-server";
import type {
  AdminUser,
  GlobalMetric,
  Project,
  ProjectMetric,
  ProjectSummary,
  UserActivity,
} from "@/types/database";

const fetchProjectsFromDbCached = unstable_cache(
  async () => {
    if (!hasConvexEnv()) {
      return {
        data: null,
        errorMessage: "Convex is not configured",
      };
    }

    try {
      const data = await fetchConvexQuery(api.projects.listPublic, {});
      return {
        data,
        errorMessage: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: error instanceof Error ? error.message : "Failed to fetch projects",
      };
    }
  },
  ["projects:v2"],
  { revalidate: 60, tags: [PROJECTS_CACHE_TAG] }
);

export async function fetchProjects(opts?: {
  allowFallback?: boolean;
}): Promise<{ data: Project[]; error: string | null }> {
  const allowFallback = opts?.allowFallback ?? true;

  const { data, errorMessage } = await fetchProjectsFromDbCached();
  if (data) {
    return { data, error: null };
  }

  if (allowFallback) {
    return { data: FALLBACK_PROJECTS, error: null };
  }

  return { data: [], error: errorMessage };
}

export async function fetchProjectSummaries(): Promise<{
  data: ProjectSummary[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return {
      data: FALLBACK_PROJECTS.map(({ id, title, domain }) => ({ id, title, domain })),
      error: null,
    };
  }

  try {
    const data = await fetchConvexQuery(api.projects.listSummaries, {});
    return { data, error: null };
  } catch (error) {
    return {
      data: FALLBACK_PROJECTS.map(({ id, title, domain }) => ({ id, title, domain })),
      error: error instanceof Error ? error.message : "Failed to fetch project summaries",
    };
  }
}

export async function fetchProjectMetrics(projectId?: number): Promise<{
  data: ProjectMetric[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: [], error: null };
  }

  try {
    const data = await fetchConvexAuthQuery(api.projectMetrics.list, {
      projectId,
    });
    return { data, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to load metrics",
    };
  }
}

export async function fetchGlobalMetrics(): Promise<{
  data: GlobalMetric[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: FALLBACK_GLOBAL_METRICS, error: null };
  }

  try {
    const data = await fetchConvexQuery(api.globalMetrics.list, {});
    return { data, error: null };
  } catch (error) {
    return {
      data: FALLBACK_GLOBAL_METRICS,
      error: error instanceof Error ? error.message : "Failed to load global metrics",
    };
  }
}

export async function fetchLatestGlobalMetric(): Promise<{
  data: GlobalMetric | null;
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: FALLBACK_GLOBAL_METRICS[0] ?? null, error: null };
  }

  try {
    const data = await fetchConvexQuery(api.globalMetrics.latest, {});
    return { data, error: null };
  } catch (error) {
    return {
      data: FALLBACK_GLOBAL_METRICS[0] ?? null,
      error: error instanceof Error ? error.message : "Failed to load latest metric",
    };
  }
}

export async function fetchAdminUsers(): Promise<{
  data: AdminUser[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: [], error: "Convex is not configured" };
  }

  try {
    const data = await fetchConvexAuthQuery(api.adminUsers.list, {});
    return { data, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to load admin users",
    };
  }
}

export async function fetchUserActivity(limit = 50): Promise<{
  data: UserActivity[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: [], error: "Convex is not configured" };
  }

  try {
    const data = await fetchConvexAuthQuery(api.adminUsers.activity, { limit });
    return { data, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to load activity",
    };
  }
}

export async function saveProject(
  project: Omit<Project, "id"> | Project
): Promise<{ data: Project | null; error: string | null }> {
  if (!hasConvexEnv()) {
    return { data: null, error: "Convex is not configured" };
  }

  try {
    const data = await fetchConvexAuthMutation(api.projects.save, {
      id: "id" in project ? project.id : undefined,
      project: {
        title: project.title,
        domain: project.domain,
        description: project.description,
        objectives: project.objectives,
        progress: project.progress,
        status: project.status,
        aiSkills: project.aiSkills,
        tools: project.tools,
        productivity: project.productivity,
        timeframe: project.timeframe,
        url: project.url ?? null,
      },
    });
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to save project",
    };
  }
}

export async function deleteProject(projectId: number): Promise<{ error: string | null }> {
  if (!hasConvexEnv()) {
    return { error: "Convex is not configured" };
  }

  try {
    await fetchConvexAuthMutation(api.projects.remove, { id: projectId });
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export async function saveProjectMetric(
  metric: Omit<ProjectMetric, "id" | "created_at">
): Promise<{ error: string | null }> {
  if (!hasConvexEnv()) {
    return { error: "Convex is not configured" };
  }

  try {
    await fetchConvexAuthMutation(api.projectMetrics.save, { metric });
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save metric",
    };
  }
}

export async function saveGlobalMetric(
  metric: Omit<GlobalMetric, "id" | "created_at">
): Promise<{ error: string | null }> {
  if (!hasConvexEnv()) {
    return { error: "Convex is not configured" };
  }

  try {
    await fetchConvexAuthMutation(api.globalMetrics.save, { metric });
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save global metric",
    };
  }
}

export async function updateAdminUser(
  userId: string,
  updates: Partial<AdminUser>
): Promise<{ error: string | null }> {
  if (!hasConvexEnv()) {
    return { error: "Convex is not configured" };
  }

  try {
    await fetchConvexAuthMutation(api.adminUsers.updateProfile, {
      userId,
      fullName: updates.full_name,
      isActive: updates.is_active ?? true,
    });
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update admin user",
    };
  }
}

export async function logActivity(
  action: string,
  resourceType?: string,
  resourceId?: number,
  details?: string
): Promise<void> {
  if (!hasConvexEnv()) {
    return;
  }

  try {
    await fetchConvexAuthMutation(api.adminUsers.logActivity, {
      action,
      resourceType,
      resourceId,
      details,
    });
  } catch (error) {
    console.warn("Failed to log activity:", error);
  }
}
