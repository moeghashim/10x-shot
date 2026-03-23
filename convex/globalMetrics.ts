import { mutation, query } from "./_generated/server";
import { requireAdmin, toIsoString } from "./lib";
import { globalMetricInputValidator } from "./validators";

function toMetric(doc: any) {
  return {
    id: doc.legacyId,
    month: doc.month,
    twitter_followers: doc.twitterFollowers,
    youtube_subscribers: doc.youtubeSubscribers,
    tiktok_followers: doc.tiktokFollowers,
    instagram_followers: doc.instagramFollowers,
    newsletter_subscribers: doc.newsletterSubscribers,
    total_gmv: doc.totalGmv,
    productivity_gain: doc.productivityGain,
    skills_gained: doc.skillsGained,
    milestones: doc.milestones,
    created_at: toIsoString(doc.createdAt),
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("globalMetrics").collect();
    return docs.sort((a, b) => b.month.localeCompare(a.month)).map(toMetric);
  },
});

export const latest = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("globalMetrics").collect();
    const latestDoc = docs.sort((a, b) => b.month.localeCompare(a.month))[0];
    return latestDoc ? toMetric(latestDoc) : null;
  },
});

export const save = mutation({
  args: {
    metric: globalMetricInputValidator,
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
        productivityGain: args.metric.productivity_gain,
        skillsGained: args.metric.skills_gained,
        milestones: args.metric.milestones,
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
        productivityGain: args.metric.productivity_gain,
        skillsGained: args.metric.skills_gained,
        milestones: args.metric.milestones,
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
