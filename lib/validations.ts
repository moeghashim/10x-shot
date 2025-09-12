import { z } from "zod"

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  progress: z.number().min(0).max(100),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  tools: z.array(z.string()).min(1, "At least one tool is required"),
  productivity: z.number().min(0),
  timeframe: z.string().min(1, "Timeframe is required"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export const metricSchema = z.object({
  id: z.string().optional(),
  month: z.string().min(1, "Month is required"),
  year: z.number().min(2020).max(2030),
  twitter_followers: z.number().min(0),
  linkedin_followers: z.number().min(0),
  newsletter_subscribers: z.number().min(0),
  total_gmv: z.number().min(0),
  productivity_gain: z.number().min(0),
  skills_gained: z.array(z.string()),
  milestones: z.array(z.string()),
})

export type Project = z.infer<typeof projectSchema>
export type Metric = z.infer<typeof metricSchema>
