import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
import { localizeGlobalMetricContent } from "@/lib/translation";
import type { GlobalMetric } from "@/types/database";

function handleRouteError(error: unknown) {
  if (isAuthError(error)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const data = await fetchConvexAuthQuery(api.globalMetrics.list, {});
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const metric: Omit<GlobalMetric, "id" | "created_at"> = await request.json();
    const previous = await fetchConvexAuthQuery(api.globalMetrics.getAdminByMonth, {
      month: metric.month,
    });
    const { localized, hadFailures } = await localizeGlobalMetricContent(metric, previous?.localization);
    await fetchConvexAuthMutation(api.globalMetrics.save, { metric, localized });

    if (hadFailures) {
      await fetchConvexAuthMutation(api.adminUsers.logActivity, {
        action: "GLOBAL_METRIC_TRANSLATION_FAILED",
        resourceType: "global_metric",
        details: `Arabic translation fallback was used for global metric ${metric.month}`,
      });
    }

    revalidatePath("/progress");
    revalidatePath("/en/progress");
    revalidatePath("/ar/progress");
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
