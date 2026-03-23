import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import betterAuthSchema from "./betterAuth/schema";
import { projectStatusValidator } from "./validators";

export default defineSchema({
  ...betterAuthSchema.tables,
  projects: defineTable({
    legacyId: v.number(),
    title: v.string(),
    domain: v.string(),
    description: v.string(),
    objectives: v.optional(v.string()),
    progress: v.number(),
    status: projectStatusValidator,
    aiSkills: v.array(v.string()),
    tools: v.array(v.string()),
    productivity: v.number(),
    timeframe: v.optional(v.string()),
    url: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_status", ["status"]),
  projectMetrics: defineTable({
    legacyId: v.optional(v.number()),
    projectLegacyId: v.number(),
    month: v.string(),
    progress: v.number(),
    productivityScore: v.number(),
    hoursWorked: v.number(),
    aiAssistanceHours: v.number(),
    manualHours: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project_month", ["projectLegacyId", "month"])
    .index("by_month", ["month"]),
  globalMetrics: defineTable({
    legacyId: v.optional(v.number()),
    month: v.string(),
    twitterFollowers: v.number(),
    youtubeSubscribers: v.number(),
    tiktokFollowers: v.number(),
    instagramFollowers: v.number(),
    newsletterSubscribers: v.number(),
    totalGmv: v.number(),
    productivityGain: v.number(),
    skillsGained: v.array(v.string()),
    milestones: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_month", ["month"]),
  adminProfiles: defineTable({
    userId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    role: v.literal("admin"),
    isActive: v.boolean(),
    lastLogin: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),
  adminActivity: defineTable({
    userId: v.optional(v.string()),
    action: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.number()),
    details: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_user_id", ["userId"]),
});
