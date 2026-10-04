import { NextResponse } from "next/server";
import { ConvexError } from "convex/values";

function describeRouteError(error: unknown): { status: number; error: string } {
  // Production deployments redact `message`; the text a Convex function threw survives only in `data`.
  if (error instanceof ConvexError && typeof error.data === "string") {
    if (error.data === "Unauthenticated") return { status: 401, error: "Unauthorized" };
    if (error.data === "Unauthorized") return { status: 403, error: "Forbidden" };
    return { status: error.data.endsWith("not found") ? 404 : 400, error: error.data };
  }
  if (error instanceof SyntaxError) {
    return { status: 400, error: "Request body must be valid JSON" };
  }
  if (error instanceof Error && /unauthenticated|unauthorized|authentication/i.test(error.message)) {
    return { status: 401, error: "Unauthorized" };
  }
  return { status: 500, error: "Unexpected server error" };
}

export function handleRouteError(error: unknown) {
  const { status, error: message } = describeRouteError(error);
  if (status === 500) {
    console.error("Admin route failed:", error);
  }
  return NextResponse.json({ error: message }, { status });
}
