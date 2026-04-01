import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
import { PROJECTS_CACHE_TAG } from "@/lib/cache-tags";
import type { Project } from "@/types/database";

function revalidateProjectViews() {
  revalidateTag(PROJECTS_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/ar");
}

function toProjectInput(project: Omit<Project, "id"> | Project) {
  return {
    title: project.title,
    description: project.description,
    objectives: project.objectives,
    progress: project.progress,
    status: project.status,
    aiSkills: project.aiSkills,
    tools: project.tools,
    timeframe: project.timeframe,
    url: project.url ?? null,
  };
}

function handleRouteError(error: unknown) {
  if (isAuthError(error)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unexpected server error",
    },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const data = await fetchConvexAuthQuery(api.projects.listAdmin, {});
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const project: Omit<Project, "id"> | Project = await request.json();
    const data = await fetchConvexAuthMutation(api.projects.save, {
      id: "id" in project ? project.id : undefined,
      project: toProjectInput(project),
    });

    revalidateProjectViews();
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Project id is required" }, { status: 400 });
    }

    await fetchConvexAuthMutation(api.projects.remove, { id });
    revalidateProjectViews();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
