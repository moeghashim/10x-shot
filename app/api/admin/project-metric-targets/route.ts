import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
import type { ProjectMetricTarget } from "@/types/database";

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
    const data = await fetchConvexAuthQuery(api.projectMetricTargets.list, {
      projectId: projectId ? Number(projectId) : undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const targets: Omit<ProjectMetricTarget, "id" | "created_at" | "updated_at">[] =
      await request.json();

    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json({ error: "At least one target is required" }, { status: 400 });
    }

    await fetchConvexAuthMutation(api.projectMetricTargets.saveMany, { targets });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Project metric target id is required" }, { status: 400 });
    }

    await fetchConvexAuthMutation(api.projectMetricTargets.remove, { id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
