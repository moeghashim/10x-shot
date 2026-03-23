import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthAction,
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";

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
    const data = await fetchConvexAuthQuery(api.adminUsers.list, {});
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await fetchConvexAuthAction(api.adminUsers.createAdminUser, {
      email: body.email,
      password: body.password,
      fullName: body.full_name || undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    await fetchConvexAuthMutation(api.adminUsers.updateProfile, {
      userId: body.userId,
      fullName: body.full_name || undefined,
      isActive: body.is_active ?? true,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
