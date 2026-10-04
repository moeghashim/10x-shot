import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  requireAdminSession,
} from "@/lib/auth-server";
import { handleRouteError } from "@/lib/route-error";
import { PROJECTS_CACHE_TAG, SITE_COPY_CACHE_TAG, STACK_CACHE_TAG } from "@/lib/cache-tags";
import { localizeGlobalMetricContent, localizeProjectContent } from "@/lib/translation";
import type { GlobalMetric, Project } from "@/types/database";

function toProjectInput(project: Project | Omit<Project, "id">) {
  return {
    title: project.title,
    description: project.description,
    objectives: project.objectives,
    progress: project.progress,
    launchDate: project.launchDate,
    status: project.status,
    stackItemIds: project.stackItemIds,
    aiSkills: project.aiSkills,
    tools: project.tools,
    timeframe: project.timeframe,
    sector: project.sector,
    commits: project.commits,
    visits: project.visits,
    growth: project.growth,
    url: project.url ?? null,
  };
}

export async function POST() {
  try {
    await requireAdminSession();
    const projects = await fetchConvexAuthQuery(api.projects.listAdmin, {});
    const metrics = await fetchConvexAuthQuery(api.globalMetrics.list, { locale: "en" });

    let projectFailures = 0;
    for (const project of projects) {
      const previous = await fetchConvexAuthQuery(api.projects.getAdminById, { id: project.id });
      const { localized, hadFailures } = await localizeProjectContent(project, previous?.localization);
      await fetchConvexAuthMutation(api.projects.save, {
        id: project.id,
        project: toProjectInput(project),
        localized,
      });
      if (hadFailures) {
        projectFailures += 1;
      }
    }

    let metricFailures = 0;
    for (const metric of metrics as GlobalMetric[]) {
      const previous = await fetchConvexAuthQuery(api.globalMetrics.getAdminByMonth, {
        month: metric.month,
      });
      const { localized, hadFailures } = await localizeGlobalMetricContent(metric, previous?.localization);
      await fetchConvexAuthMutation(api.globalMetrics.save, {
        metric,
        localized,
      });
      if (hadFailures) {
        metricFailures += 1;
      }
    }

    await fetchConvexAuthMutation(api.adminUsers.logActivity, {
      action: "BACKFILL_TRANSLATIONS",
      resourceType: "translation",
      details: `Backfilled ${projects.length} projects and ${metrics.length} global metrics`,
    });

    revalidateTag(PROJECTS_CACHE_TAG);
    revalidateTag(STACK_CACHE_TAG);
    revalidateTag(SITE_COPY_CACHE_TAG);
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/en/stack");
    revalidatePath("/ar/stack");
    revalidatePath("/en/progress");
    revalidatePath("/ar/progress");

    return NextResponse.json({
      success: true,
      data: {
        projects: projects.length,
        projectFailures,
        globalMetrics: metrics.length,
        metricFailures,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
