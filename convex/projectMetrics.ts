import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { assertProjectMetricInput, requireAdmin, toIsoString } from "./lib";
import {
  projectMetricInputValidator,
  projectMetricLocalizationValidator,
  supportedLocaleValidator,
} from "./validators";

function pickLocalizedList(value: any, locale: "en" | "ar", fallback?: string[]) {
  if (!value) {
    return fallback ?? [];
  }

  const localized = locale === "ar" ? value.ar : value.en;
  if (Array.isArray(localized) && localized.length > 0) {
    return localized;
  }

  if (Array.isArray(value.en) && value.en.length > 0) {
    return value.en;
  }

  return fallback ?? [];
}

function toLocalizationBundle(doc: any) {
  return {
    achievements: doc.localizedAchievements ?? {
      en: doc.achievements ?? [],
      ar: doc.achievements ?? [],
      translationStatus: "pending",
    },
  };
}

function toMetric(doc: any, locale: "en" | "ar" = "en") {
  return {
    id: doc.legacyId,
    project_id: doc.projectLegacyId,
    month: doc.month,
    progress: doc.progress,
    sales_gmv: doc.salesGmv ?? 0,
    productivity_score: doc.productivityScore,
    hours_worked: doc.hoursWorked,
    ai_assistance_hours: doc.aiAssistanceHours,
    manual_hours: doc.manualHours,
    achievements: pickLocalizedList(doc.localizedAchievements, locale, doc.achievements ?? []),
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
      .map((doc) => toMetric(doc));
  },
});

export const listPublic = query({
  args: {
    locale: v.optional(supportedLocaleValidator),
    projectId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const locale = args.locale ?? "en";
    let docs = await ctx.db.query("projectMetrics").collect();
    if (args.projectId !== undefined) {
      docs = docs.filter((doc) => doc.projectLegacyId === args.projectId);
    }
    return docs
      .sort((a, b) => b.month.localeCompare(a.month))
      .map((doc) => toMetric(doc, locale));
  },
});

export const getAdminByProjectMonth = query({
  args: {
    projectId: v.number(),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("projectMetrics")
      .withIndex("by_project_month", (q) =>
        q.eq("projectLegacyId", args.projectId).eq("month", args.month)
      )
      .first();

    if (!doc) {
      return null;
    }

    return {
      project_id: doc.projectLegacyId,
      month: doc.month,
      localization: toLocalizationBundle(doc),
    };
  },
});

export const save = mutation({
  args: {
    metric: projectMetricInputValidator,
    localized: v.optional(projectMetricLocalizationValidator),
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
        salesGmv: args.metric.sales_gmv,
        productivityScore: args.metric.productivity_score,
        hoursWorked: args.metric.hours_worked,
        aiAssistanceHours: args.metric.ai_assistance_hours,
        manualHours: args.metric.manual_hours,
        achievements: args.metric.achievements,
        localizedAchievements: args.localized?.achievements,
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
        salesGmv: args.metric.sales_gmv,
        productivityScore: args.metric.productivity_score,
        hoursWorked: args.metric.hours_worked,
        aiAssistanceHours: args.metric.ai_assistance_hours,
        manualHours: args.metric.manual_hours,
        achievements: args.metric.achievements,
        localizedAchievements: args.localized?.achievements,
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

export const remove = mutation({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const doc = await ctx.db
      .query("projectMetrics")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    if (!doc) {
      throw new ConvexError("Project metric not found");
    }

    await ctx.db.delete(doc._id);
    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "DELETE_PROJECT_METRIC",
      resourceType: "project_metric",
      resourceId: args.id,
      details: `Deleted project metric for ${doc.projectLegacyId} ${doc.month}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
