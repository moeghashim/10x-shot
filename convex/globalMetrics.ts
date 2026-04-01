import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, toIsoString } from "./lib";
import {
  globalMetricInputValidator,
  globalMetricLocalizationValidator,
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
    skillsGained: doc.localizedSkillsGained ?? {
      en: doc.skillsGained,
      ar: doc.skillsGained,
      translationStatus: "pending",
    },
    milestones: doc.localizedMilestones ?? {
      en: doc.milestones,
      ar: doc.milestones,
      translationStatus: "pending",
    },
  };
}

function toMetric(doc: any, locale: "en" | "ar" = "en") {
  return {
    id: doc.legacyId,
    month: doc.month,
    twitter_followers: doc.twitterFollowers,
    youtube_subscribers: doc.youtubeSubscribers,
    tiktok_followers: doc.tiktokFollowers,
    instagram_followers: doc.instagramFollowers,
    newsletter_subscribers: doc.newsletterSubscribers,
    total_gmv: doc.totalGmv,
    skills_gained: pickLocalizedList(doc.localizedSkillsGained, locale, doc.skillsGained),
    milestones: pickLocalizedList(doc.localizedMilestones, locale, doc.milestones),
    created_at: toIsoString(doc.createdAt),
  };
}

export const list = query({
  args: {
    locale: v.optional(supportedLocaleValidator),
  },
  handler: async (ctx, args) => {
    const locale = args.locale ?? "en";
    const docs = await ctx.db.query("globalMetrics").collect();
    return docs.sort((a, b) => b.month.localeCompare(a.month)).map((doc) => toMetric(doc, locale));
  },
});

export const latest = query({
  args: {
    locale: v.optional(supportedLocaleValidator),
  },
  handler: async (ctx, args) => {
    const locale = args.locale ?? "en";
    const docs = await ctx.db.query("globalMetrics").collect();
    const latestDoc = docs.sort((a, b) => b.month.localeCompare(a.month))[0];
    return latestDoc ? toMetric(latestDoc, locale) : null;
  },
});

export const getAdminByMonth = query({
  args: {
    month: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("globalMetrics")
      .withIndex("by_month", (q) => q.eq("month", args.month))
      .first();

    if (!doc) {
      return null;
    }

    return {
      month: doc.month,
      localization: toLocalizationBundle(doc),
    };
  },
});

export const save = mutation({
  args: {
    metric: globalMetricInputValidator,
    localized: v.optional(globalMetricLocalizationValidator),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query("globalMetrics")
      .withIndex("by_month", (q) => q.eq("month", args.metric.month))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        twitterFollowers: args.metric.twitter_followers,
        youtubeSubscribers: args.metric.youtube_subscribers,
        tiktokFollowers: args.metric.tiktok_followers,
        instagramFollowers: args.metric.instagram_followers,
        newsletterSubscribers: args.metric.newsletter_subscribers,
        totalGmv: args.metric.total_gmv,
        skillsGained: args.metric.skills_gained,
        localizedSkillsGained: args.localized?.skillsGained,
        milestones: args.metric.milestones,
        localizedMilestones: args.localized?.milestones,
        updatedAt: now,
      });
    } else {
      const docs = await ctx.db.query("globalMetrics").collect();
      const nextLegacyId = docs.reduce((max, metric) => Math.max(max, metric.legacyId || 0), 0) + 1;
      await ctx.db.insert("globalMetrics", {
        legacyId: nextLegacyId,
        month: args.metric.month,
        twitterFollowers: args.metric.twitter_followers,
        youtubeSubscribers: args.metric.youtube_subscribers,
        tiktokFollowers: args.metric.tiktok_followers,
        instagramFollowers: args.metric.instagram_followers,
        newsletterSubscribers: args.metric.newsletter_subscribers,
        totalGmv: args.metric.total_gmv,
        skillsGained: args.metric.skills_gained,
        localizedSkillsGained: args.localized?.skillsGained,
        milestones: args.metric.milestones,
        localizedMilestones: args.localized?.milestones,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "SAVE_GLOBAL_METRIC",
      resourceType: "global_metric",
      details: `Saved global metric for ${args.metric.month}`,
      createdAt: now,
    });

    return { success: true };
  },
});
