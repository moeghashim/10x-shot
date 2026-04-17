import { v } from "convex/values";

export const projectStatusValidator = v.union(
  v.literal("active"),
  v.literal("planning"),
  v.literal("completed")
);

export const stackGradeValidator = v.union(
  v.literal("A"),
  v.literal("B"),
  v.literal("C"),
  v.literal("D"),
  v.literal("E"),
  v.literal("F")
);

export const stackCategoryValidator = v.union(
  v.literal("tool"),
  v.literal("ai_skill")
);

export const supportedLocaleValidator = v.union(v.literal("en"), v.literal("ar"));

export const translationStatusValidator = v.union(
  v.literal("synced"),
  v.literal("failed"),
  v.literal("pending")
);

export const localizedTextValidator = v.object({
  en: v.string(),
  ar: v.string(),
  sourceHash: v.optional(v.string()),
  translatedAt: v.optional(v.number()),
  translationModel: v.optional(v.string()),
  translationStatus: v.optional(translationStatusValidator),
});

export const localizedStringListValidator = v.object({
  en: v.array(v.string()),
  ar: v.array(v.string()),
  sourceHash: v.optional(v.string()),
  translatedAt: v.optional(v.number()),
  translationModel: v.optional(v.string()),
  translationStatus: v.optional(translationStatusValidator),
});

export const projectFields = {
  title: v.string(),
  description: v.string(),
  objectives: v.optional(v.string()),
  progress: v.number(),
  status: projectStatusValidator,
  stackItemIds: v.array(v.number()),
  aiSkills: v.array(v.string()),
  tools: v.array(v.string()),
  timeframe: v.optional(v.string()),
  url: v.optional(v.union(v.null(), v.string())),
} as const;

export const projectInputValidator = v.object(projectFields);

export const stackItemInputValidator = v.object({
  name: v.string(),
  category: stackCategoryValidator,
  grade: stackGradeValidator,
  notes: v.optional(v.string()),
});

export const projectLocalizationValidator = v.object({
  title: localizedTextValidator,
  description: localizedTextValidator,
  objectives: v.optional(localizedTextValidator),
  timeframe: v.optional(localizedTextValidator),
  aiSkills: localizedStringListValidator,
  tools: localizedStringListValidator,
});

export const projectMetricFields = {
  project_id: v.number(),
  month: v.string(),
  progress: v.number(),
  productivity_score: v.number(),
  hours_worked: v.number(),
  ai_assistance_hours: v.number(),
  manual_hours: v.number(),
  notes: v.optional(v.string()),
} as const;

export const projectMetricInputValidator = v.object(projectMetricFields);

export const globalMetricFields = {
  month: v.string(),
  twitter_followers: v.number(),
  youtube_subscribers: v.number(),
  tiktok_followers: v.number(),
  instagram_followers: v.number(),
  newsletter_subscribers: v.number(),
  total_gmv: v.number(),
  skills_gained: v.array(v.string()),
  milestones: v.array(v.string()),
} as const;

export const globalMetricInputValidator = v.object(globalMetricFields);

export const globalMetricLocalizationValidator = v.object({
  skillsGained: localizedStringListValidator,
  milestones: localizedStringListValidator,
});

export const siteContentEntryValidator = v.object({
  key: v.string(),
  content: localizedTextValidator,
});
