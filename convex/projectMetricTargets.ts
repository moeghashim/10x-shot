import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { assertProjectMetricTargetInput, requireAdmin, toIsoString } from "./lib";
import { projectMetricTargetInputValidator } from "./validators";

function toTarget(doc: any) {
  return {
    id: doc.legacyId,
    project_id: doc.projectLegacyId,
    month: doc.month,
    target_progress: doc.targetProgress,
    target_sales_gmv: doc.targetSalesGmv,
    target_productivity_score: doc.targetProductivityScore,
    target_hours_worked: doc.targetHoursWorked,
    target_ai_assistance_hours: doc.targetAiAssistanceHours,
    target_manual_hours: doc.targetManualHours,
    notes: doc.notes,
    created_at: toIsoString(doc.createdAt),
    updated_at: toIsoString(doc.updatedAt),
  };
}

export const list = query({
  args: {
    projectId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    let docs = await ctx.db.query("projectMetricTargets").collect();
    if (args.projectId !== undefined) {
      docs = docs.filter((doc) => doc.projectLegacyId === args.projectId);
    }

    return docs.sort((a, b) => a.month.localeCompare(b.month)).map((doc) => toTarget(doc));
  },
});

export const saveMany = mutation({
  args: {
    targets: v.array(projectMetricTargetInputValidator),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const now = Date.now();

    for (const target of args.targets) {
      assertProjectMetricTargetInput(target);

      const existing = await ctx.db
        .query("projectMetricTargets")
        .withIndex("by_project_month", (q) =>
          q.eq("projectLegacyId", target.project_id).eq("month", target.month)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          targetProgress: target.target_progress,
          targetSalesGmv: target.target_sales_gmv,
          targetProductivityScore: target.target_productivity_score,
          targetHoursWorked: target.target_hours_worked,
          targetAiAssistanceHours: target.target_ai_assistance_hours,
          targetManualHours: target.target_manual_hours,
          notes: target.notes,
          updatedAt: now,
        });
      } else {
        const currentTargets = await ctx.db.query("projectMetricTargets").collect();
        const nextLegacyId =
          currentTargets.reduce((max, metric) => Math.max(max, metric.legacyId || 0), 0) + 1;

        await ctx.db.insert("projectMetricTargets", {
          legacyId: nextLegacyId,
          projectLegacyId: target.project_id,
          month: target.month,
          targetProgress: target.target_progress,
          targetSalesGmv: target.target_sales_gmv,
          targetProductivityScore: target.target_productivity_score,
          targetHoursWorked: target.target_hours_worked,
          targetAiAssistanceHours: target.target_ai_assistance_hours,
          targetManualHours: target.target_manual_hours,
          notes: target.notes,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "SAVE_PROJECT_METRIC_TARGETS",
      resourceType: "project_metric_target",
      resourceId: args.targets[0]?.project_id,
      details: `Saved ${args.targets.length} project metric targets`,
      createdAt: now,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const doc = await ctx.db
      .query("projectMetricTargets")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    if (!doc) {
      throw new ConvexError("Project metric target not found");
    }

    await ctx.db.delete(doc._id);
    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "DELETE_PROJECT_METRIC_TARGET",
      resourceType: "project_metric_target",
      resourceId: args.id,
      details: `Deleted project metric target for ${doc.projectLegacyId} ${doc.month}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
