import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchConvexAuthQuery } from "@/lib/auth-server";
import { handleRouteError } from "@/lib/route-error";

export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get("limit") || "50");
    const data = await fetchConvexAuthQuery(api.adminUsers.activity, { limit });
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}
