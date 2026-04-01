import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchConvexQuery, hasConvexEnv } from "@/lib/auth-server";

function getFallbackStats() {
  return {
    projectsLaunched: 0,
    totalProjects: 0,
    aiToolsIntegrated: 0,
  };
}

export async function GET() {
  try {
    if (!hasConvexEnv()) {
      return NextResponse.json({ data: getFallbackStats() });
    }

    const data = await fetchConvexQuery(api.stats.getPublicStats, {});
    return NextResponse.json({
      data: {
        projectsLaunched: data.projectsLaunched,
        totalProjects: data.totalProjects,
        aiToolsIntegrated: data.aiToolsIntegrated,
      },
    });
  } catch (error) {
    console.error("Unexpected error computing stats:", error);
    return NextResponse.json({ data: getFallbackStats() });
  }
}
