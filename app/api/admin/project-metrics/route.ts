import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
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
    await fetchConvexAuthMutation(api.projectMetrics.save, { metric });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
