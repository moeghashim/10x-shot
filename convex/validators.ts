import { v } from "convex/values";

export const projectStatusValidator = v.union(
  v.literal("active"),
  v.literal("planning"),
  v.literal("completed")
);

export const projectFields = {
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
} as const;

export const projectInputValidator = v.object(projectFields);

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
  productivity_gain: v.number(),
  skills_gained: v.array(v.string()),
  milestones: v.array(v.string()),
} as const;

export const globalMetricInputValidator = v.object(globalMetricFields);
