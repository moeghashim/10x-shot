import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import type { FunctionReference } from "convex/server";
import { fetchAction, fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { isAuthError } from "./auth-error";

export function hasConvexEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL &&
      (process.env.CONVEX_SITE_URL || process.env.NEXT_PUBLIC_CONVEX_SITE_URL)
  );
}

export { isAuthError };

export const convexAuthNextJs = hasConvexEnv()
  ? convexBetterAuthNextJs({
      convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
      convexSiteUrl: process.env.CONVEX_SITE_URL || process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
      jwtCache: {
        enabled: true,
        isAuthError,
      },
    })
  : null;

export async function fetchConvexQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args?: Query["_args"]
) {
  if (!hasConvexEnv()) {
    throw new Error("Convex is not configured");
  }

  return fetchQuery(query, args as Query["_args"]);
}

export async function fetchConvexMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  args?: Mutation["_args"]
) {
  if (!hasConvexEnv()) {
    throw new Error("Convex is not configured");
  }

  return fetchMutation(mutation, args as Mutation["_args"]);
}

export async function fetchConvexAction<Action extends FunctionReference<"action">>(
  action: Action,
  args?: Action["_args"]
) {
  if (!hasConvexEnv()) {
    throw new Error("Convex is not configured");
  }

  return fetchAction(action, args as Action["_args"]);
}

export async function fetchConvexAuthQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args?: Query["_args"]
) {
  if (!convexAuthNextJs) {
    throw new Error("Convex auth is not configured");
  }

  return convexAuthNextJs.fetchAuthQuery(query, args as Query["_args"]);
}

export async function fetchConvexAuthMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  args?: Mutation["_args"]
) {
  if (!convexAuthNextJs) {
    throw new Error("Convex auth is not configured");
  }

  return convexAuthNextJs.fetchAuthMutation(mutation, args as Mutation["_args"]);
}

export async function fetchConvexAuthAction<Action extends FunctionReference<"action">>(
  action: Action,
  args?: Action["_args"]
) {
  if (!convexAuthNextJs) {
    throw new Error("Convex auth is not configured");
  }

  return convexAuthNextJs.fetchAuthAction(action, args as Action["_args"]);
}

// Rejects a caller without an active admin session. Call it before any work
// that costs money or has side effects outside Convex, such as translation.
export async function requireAdminSession() {
  return fetchConvexAuthQuery(api.adminUsers.current, {});
}
