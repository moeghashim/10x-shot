import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
import { PROGRESS_CACHE_TAG } from "@/lib/cache-tags";
import { localizeProjectMetricContent } from "@/lib/translation";
import type { ProjectMetric } from "@/types/database";

function handleRouteError(error: unknown) {
  if (isAuthError(error)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unexpected server error" },
    { status: 500 }
  );
}

function revalidateProgressViews() {
  revalidateTag(PROGRESS_CACHE_TAG);
  revalidatePath("/progress");
  revalidatePath("/en/progress");
  revalidatePath("/ar/progress");
}

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");
    const data = await fetchConvexAuthQuery(api.projectMetrics.list, {
      projectId: projectId ? Number(projectId) : undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const metric: Omit<ProjectMetric, "id" | "created_at"> = await request.json();
    const previous = await fetchConvexAuthQuery(api.projectMetrics.getAdminByProjectMonth, {
      projectId: metric.project_id,
      month: metric.month,
    });
    const { localized, hadFailures } = await localizeProjectMetricContent(metric, previous?.localization);
    await fetchConvexAuthMutation(api.projectMetrics.save, { metric, localized });

    if (hadFailures) {
      await fetchConvexAuthMutation(api.adminUsers.logActivity, {
        action: "PROJECT_METRIC_TRANSLATION_FAILED",
        resourceType: "project_metric",
        resourceId: metric.project_id,
        details: `Arabic translation fallback was used for project metric ${metric.project_id} ${metric.month}`,
      });
    }

    revalidateProgressViews();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Project metric id is required" }, { status: 400 });
    }

    await fetchConvexAuthMutation(api.projectMetrics.remove, { id });
    revalidateProgressViews();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
