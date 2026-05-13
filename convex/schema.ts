import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import betterAuthSchema from "./betterAuth/schema";
import {
  localizedStringListValidator,
  localizedTextValidator,
  projectStatusValidator,
  stackCategoryValidator,
  stackFamiliarityValidator,
  stackGradeValidator,
  translationStatusValidator,
} from "./validators";

export default defineSchema({
  ...betterAuthSchema.tables,
  projects: defineTable({
    legacyId: v.number(),
    title: v.string(),
    description: v.string(),
    objectives: v.optional(v.string()),
    localizedTitle: v.optional(localizedTextValidator),
    localizedDescription: v.optional(localizedTextValidator),
    localizedObjectives: v.optional(localizedTextValidator),
    progress: v.number(),
    status: projectStatusValidator,
    stackItemIds: v.optional(v.array(v.number())),
    aiSkills: v.array(v.string()),
    localizedAiSkills: v.optional(localizedStringListValidator),
    tools: v.array(v.string()),
    localizedTools: v.optional(localizedStringListValidator),
    timeframe: v.optional(v.string()),
    localizedTimeframe: v.optional(localizedTextValidator),
    url: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_status", ["status"]),
  stackItems: defineTable({
    legacyId: v.number(),
    name: v.string(),
    category: stackCategoryValidator,
    grade: stackGradeValidator,
    familiarity: v.optional(stackFamiliarityValidator),
    reason: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_name", ["name"])
    .index("by_category", ["category"]),
  projectMetrics: defineTable({
    legacyId: v.optional(v.number()),
    projectLegacyId: v.number(),
    month: v.string(),
    progress: v.number(),
    salesGmv: v.optional(v.number()),
    productivityScore: v.number(),
    hoursWorked: v.number(),
    aiAssistanceHours: v.number(),
    manualHours: v.number(),
    achievements: v.optional(v.array(v.string())),
    localizedAchievements: v.optional(localizedStringListValidator),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project_month", ["projectLegacyId", "month"])
    .index("by_month", ["month"]),
  planningCards: defineTable({
    legacyId: v.optional(v.number()),
    projectLegacyId: v.number(),
    column: v.union(
      v.literal("todo"),
      v.literal("doing"),
      v.literal("done"),
      v.literal("now"),
      v.literal("next"),
      v.literal("later")
    ),
    title: v.string(),
    description: v.string(),
    localizedTitle: v.optional(localizedTextValidator),
    localizedDescription: v.optional(localizedTextValidator),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_legacy_id", ["legacyId"])
    .index("by_project", ["projectLegacyId"])
    .index("by_column", ["column"]),
  globalMetrics: defineTable({
    legacyId: v.optional(v.number()),
    month: v.string(),
    twitterFollowers: v.number(),
    youtubeSubscribers: v.number(),
    tiktokFollowers: v.number(),
    instagramFollowers: v.number(),
    newsletterSubscribers: v.number(),
    totalGmv: v.number(),
    skillsGained: v.array(v.string()),
    localizedSkillsGained: v.optional(localizedStringListValidator),
    milestones: v.array(v.string()),
    localizedMilestones: v.optional(localizedStringListValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_month", ["month"]),
  siteContent: defineTable({
    key: v.string(),
    en: v.string(),
    ar: v.string(),
    sourceHash: v.optional(v.string()),
    translatedAt: v.optional(v.number()),
    translationModel: v.optional(v.string()),
    translationStatus: v.optional(translationStatusValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
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
