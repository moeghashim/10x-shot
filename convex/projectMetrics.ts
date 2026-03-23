import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertProjectMetricInput, requireAdmin, toIsoString } from "./lib";
import { projectMetricInputValidator } from "./validators";

function toMetric(doc: any) {
  return {
    id: doc.legacyId,
    project_id: doc.projectLegacyId,
    month: doc.month,
    progress: doc.progress,
    productivity_score: doc.productivityScore,
    hours_worked: doc.hoursWorked,
    ai_assistance_hours: doc.aiAssistanceHours,
    manual_hours: doc.manualHours,
    notes: doc.notes,
    created_at: toIsoString(doc.createdAt),
  };
}

export const list = query({
  args: {
    projectId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    let docs = await ctx.db.query("projectMetrics").collect();
    if (args.projectId !== undefined) {
      docs = docs.filter((doc) => doc.projectLegacyId === args.projectId);
    }
    return docs
      .sort((a, b) => b.month.localeCompare(a.month))
      .map(toMetric);
  },
});

export const save = mutation({
  args: {
    metric: projectMetricInputValidator,
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    assertProjectMetricInput(args.metric);

    const now = Date.now();
    const existing = await ctx.db
      .query("projectMetrics")
      .withIndex("by_project_month", (q) =>
        q.eq("projectLegacyId", args.metric.project_id).eq("month", args.metric.month)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        progress: args.metric.progress,
        productivityScore: args.metric.productivity_score,
        hoursWorked: args.metric.hours_worked,
        aiAssistanceHours: args.metric.ai_assistance_hours,
        manualHours: args.metric.manual_hours,
        notes: args.metric.notes,
        updatedAt: now,
      });
    } else {
      const currentMetrics = await ctx.db.query("projectMetrics").collect();
      const nextLegacyId =
        currentMetrics.reduce((max, metric) => Math.max(max, metric.legacyId || 0), 0) + 1;

      await ctx.db.insert("projectMetrics", {
        legacyId: nextLegacyId,
        projectLegacyId: args.metric.project_id,
        month: args.metric.month,
        progress: args.metric.progress,
        productivityScore: args.metric.productivity_score,
        hoursWorked: args.metric.hours_worked,
        aiAssistanceHours: args.metric.ai_assistance_hours,
        manualHours: args.metric.manual_hours,
        notes: args.metric.notes,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "SAVE_PROJECT_METRIC",
      resourceType: "project_metric",
      resourceId: args.metric.project_id,
      details: `Saved project metric for ${args.metric.month}`,
      createdAt: now,
    });

    return { success: true };
  },
});
