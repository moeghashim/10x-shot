import { ConvexError } from "convex/values";

const AUTH_ERROR_CODES = new Set(["Unauthenticated", "Unauthorized"]);

export function isAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  // Production deployments redact `message`, so the code thrown by requireAdmin only survives in `data`.
  if (error instanceof ConvexError && typeof error.data === "string") {
    return AUTH_ERROR_CODES.has(error.data);
  }

  return /unauthenticated|unauthorized|authentication/i.test(error.message);
}
