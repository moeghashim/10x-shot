import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { authComponent } from "./auth";

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const authUser = await authComponent.safeGetAuthUser(ctx);
  if (!authUser) {
    throw new ConvexError("Unauthenticated");
  }

  const profile = await ctx.db
    .query("adminProfiles")
    .withIndex("by_user_id", (q) => q.eq("userId", authUser._id))
    .first();

  if (!profile?.isActive) {
    throw new ConvexError("Unauthorized");
  }

  return { authUser, profile };
}

export function assertProjectInput(input: {
  progress: number;
}) {
  if (input.progress < 0 || input.progress > 100) {
    throw new ConvexError("Project progress must be between 0 and 100");
  }
}

export function assertProjectMetricInput(input: {
  progress: number;
  sales_gmv: number;
  productivity_score: number;
  hours_worked: number;
  ai_assistance_hours: number;
  manual_hours: number;
}) {
  if (input.progress < 0 || input.progress > 100) {
    throw new ConvexError("Metric progress must be between 0 and 100");
  }
  if (input.productivity_score < 0 || input.productivity_score > 10) {
    throw new ConvexError("Metric productivity must be between 0 and 10");
  }
  if (input.sales_gmv < 0) {
    throw new ConvexError("Metric sales GMV cannot be negative");
  }
  if (input.hours_worked < 0 || input.ai_assistance_hours < 0 || input.manual_hours < 0) {
    throw new ConvexError("Metric hours cannot be negative");
  }
}

export function toIsoString(timestamp?: number | null) {
  if (!timestamp) {
    return undefined;
  }
  return new Date(timestamp).toISOString();
}
