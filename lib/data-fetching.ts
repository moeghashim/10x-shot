import "server-only";

import { unstable_cache } from "next/cache";
import { api } from "@/convex/_generated/api";
import { PROGRESS_CACHE_TAG, PROJECTS_CACHE_TAG, STACK_CACHE_TAG } from "@/lib/cache-tags";
import { FALLBACK_PROJECTS } from "@/lib/constants";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  fetchConvexQuery,
  hasConvexEnv,
} from "@/lib/auth-server";
import {
  localizeGlobalMetricContent,
  localizeProjectContent,
  localizeProjectMetricContent,
} from "@/lib/translation";
import type {
  AdminUser,
  GlobalMetric,
  PlanningCard,
  Project,
  ProjectMetric,
  ProjectSummary,
  StackItem,
  StackItemWithProjects,
  SupportedLocale,
  UserActivity,
} from "@/types/database";

const fetchProjectsFromDbCached = unstable_cache(
  async (locale: SupportedLocale) => {
    if (!hasConvexEnv()) {
      return {
        data: null,
        errorMessage: "Convex is not configured",
      };
    }

    try {
      const data = await fetchConvexQuery(api.projects.listPublic, { locale });
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
  ["projects:v4"],
  { revalidate: 60, tags: [PROJECTS_CACHE_TAG] }
);

const fetchStackFromDbCached = unstable_cache(
  async () => {
    if (!hasConvexEnv()) {
      return {
        data: null,
        errorMessage: "Convex is not configured",
      };
    }

    try {
      const data = await fetchConvexQuery(api.stack.listPublic, {});
      return {
        data,
        errorMessage: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: error instanceof Error ? error.message : "Failed to fetch stack",
      };
    }
  },
  ["stack:v1"],
  { revalidate: 60, tags: [STACK_CACHE_TAG] }
);

const fetchPublicProjectMetricsCached = unstable_cache(
  async (locale: SupportedLocale) => {
    if (!hasConvexEnv()) {
      return {
        data: null,
        errorMessage: "Convex is not configured",
      };
    }

    try {
      const data = await fetchConvexQuery(api.projectMetrics.listPublic, { locale });
      return {
        data,
        errorMessage: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: error instanceof Error ? error.message : "Failed to fetch project metrics",
      };
    }
  },
  ["project-metrics-public:v1"],
  { revalidate: 60, tags: [PROGRESS_CACHE_TAG] }
);

const fetchPlanningCardsCached = unstable_cache(
  async (locale: SupportedLocale) => {
    if (!hasConvexEnv()) {
      return {
        data: null,
        errorMessage: "Convex is not configured",
      };
    }

    try {
      const data = await fetchConvexQuery(api.planningCards.listPublic, { locale });
      return {
        data,
        errorMessage: null,
      };
    } catch (error) {
      return {
        data: null,
        errorMessage: error instanceof Error ? error.message : "Failed to fetch planning cards",
      };
    }
  },
  ["planning-cards-public:v1"],
  { revalidate: 60, tags: [PROGRESS_CACHE_TAG] }
);

function deriveProjectStack(project: Omit<Project, "id"> | Project, stackItems: StackItem[]) {
  const selectedIds = project.stackItemIds ?? []
  const selectedItems = stackItems.filter((item) => selectedIds.includes(item.id));

  return {
    aiSkills: selectedItems.filter((item) => item.category === "ai_skill").map((item) => item.name),
    tools: selectedItems.filter((item) => item.category === "tool").map((item) => item.name),
  };
}

export async function fetchProjects(opts?: {
  allowFallback?: boolean;
  locale?: SupportedLocale;
}): Promise<{ data: Project[]; error: string | null }> {
  const allowFallback = opts?.allowFallback ?? true;
  const locale = opts?.locale ?? "en";

  const { data, errorMessage } = await fetchProjectsFromDbCached(locale);
  if (data) {
    return { data, error: null };
  }

  if (allowFallback) {
    console.warn("Falling back to local project data:", errorMessage ?? "Unknown project fetch failure");
    return { data: FALLBACK_PROJECTS, error: errorMessage };
  }

  return { data: [], error: errorMessage };
}

export async function fetchStack(): Promise<{
  data: StackItemWithProjects[];
  error: string | null;
}> {
  const { data, errorMessage } = await fetchStackFromDbCached();

  if (data) {
    return { data, error: null };
  }

  return { data: [], error: errorMessage };
}

export async function fetchAdminStack(): Promise<{
  data: StackItem[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: [], error: "Convex is not configured" };
  }

  try {
    const data = await fetchConvexAuthQuery(api.stack.listAdmin, {});
    return { data, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to load stack",
    };
  }
}

export async function fetchProjectSummaries(): Promise<{
  data: ProjectSummary[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return {
      data: FALLBACK_PROJECTS.map(({ id, title }) => ({ id, title })),
      error: null,
    };
  }

  try {
    const data = await fetchConvexQuery(api.projects.listSummaries, {});
    return { data, error: null };
  } catch (error) {
    return {
      data: FALLBACK_PROJECTS.map(({ id, title }) => ({ id, title })),
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

export async function fetchPublicProjectMetrics(locale: SupportedLocale = "en"): Promise<{
  data: ProjectMetric[];
  error: string | null;
}> {
  const { data, errorMessage } = await fetchPublicProjectMetricsCached(locale);

  if (data) {
    return { data, error: null };
  }

  return { data: [], error: errorMessage };
}

export async function fetchPlanningCards(locale: SupportedLocale = "en"): Promise<{
  data: PlanningCard[];
  error: string | null;
}> {
  const { data, errorMessage } = await fetchPlanningCardsCached(locale);

  if (data) {
    return { data, error: null };
  }

  return { data: [], error: errorMessage };
}

export async function fetchGlobalMetrics(locale: SupportedLocale = "en"): Promise<{
  data: GlobalMetric[];
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: [], error: null };
  }

  try {
    const data = await fetchConvexQuery(api.globalMetrics.list, { locale });
    return { data, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Failed to load global metrics",
    };
  }
}

export async function fetchLatestGlobalMetric(locale: SupportedLocale = "en"): Promise<{
  data: GlobalMetric | null;
  error: string | null;
}> {
  if (!hasConvexEnv()) {
    return { data: null, error: null };
  }

  try {
    const data = await fetchConvexQuery(api.globalMetrics.latest, { locale });
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
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
    const stackItems = await fetchConvexAuthQuery(api.stack.listAdmin, {});
    const derivedStack = deriveProjectStack(project, stackItems);
    const previous =
      "id" in project && project.id
        ? await fetchConvexAuthQuery(api.projects.getAdminById, {
            id: project.id,
          })
        : null;
    const projectWithDerivedStack = {
      ...project,
      aiSkills: derivedStack.aiSkills,
      tools: derivedStack.tools,
    };
    const { localized } = await localizeProjectContent(projectWithDerivedStack, previous?.localization);
    const data = await fetchConvexAuthMutation(api.projects.save, {
      id: "id" in project ? project.id : undefined,
      project: {
        title: project.title,
        description: project.description,
        objectives: project.objectives,
        progress: project.progress,
        status: project.status,
        stackItemIds: project.stackItemIds,
        aiSkills: derivedStack.aiSkills,
        tools: derivedStack.tools,
        timeframe: project.timeframe,
        url: project.url ?? null,
      },
      localized,
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

export async function saveStackItem(
  stack: Omit<StackItem, "id"> | StackItem
): Promise<{ data: StackItem | null; error: string | null }> {
  if (!hasConvexEnv()) {
    return { data: null, error: "Convex is not configured" };
  }

  try {
    const data = await fetchConvexAuthMutation(api.stack.save, {
      id: "id" in stack ? stack.id : undefined,
      stack: {
        name: stack.name,
        category: stack.category,
        grade: stack.grade,
        familiarity: stack.familiarity,
        reason: stack.reason,
        notes: stack.notes,
      },
    });
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to save stack item",
    };
  }
}

export async function deleteStackItem(stackId: number): Promise<{ error: string | null }> {
  if (!hasConvexEnv()) {
    return { error: "Convex is not configured" };
  }

  try {
    await fetchConvexAuthMutation(api.stack.remove, { id: stackId });
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete stack item",
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
    const previous = await fetchConvexAuthQuery(api.projectMetrics.getAdminByProjectMonth, {
      projectId: metric.project_id,
      month: metric.month,
    });
    const { localized } = await localizeProjectMetricContent(metric, previous?.localization);
    await fetchConvexAuthMutation(api.projectMetrics.save, { metric, localized });
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
    const previous = await fetchConvexAuthQuery(api.globalMetrics.getAdminByMonth, {
      month: metric.month,
    });
    const { localized } = await localizeGlobalMetricContent(metric, previous?.localization);
    await fetchConvexAuthMutation(api.globalMetrics.save, { metric, localized });
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
