import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchConvexAuthQuery, isAuthError } from "@/lib/auth-server";

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
    const limit = Number(request.nextUrl.searchParams.get("limit") || "50");
    const data = await fetchConvexAuthQuery(api.adminUsers.activity, { limit });
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}
