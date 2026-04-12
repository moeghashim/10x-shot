/**
 * Shared constants and fallback data for the application
 * This file serves as the single source of truth for default/fallback data
 */

import type { Project, GlobalMetric } from "@/types/database"

type ProjectStatus = Project["status"]
const VALID_PROJECT_STATUSES: ProjectStatus[] = ["active", "planning", "completed"]

function normalizeProjectStatus(status: unknown): ProjectStatus {
  if (typeof status === "string" && VALID_PROJECT_STATUSES.includes(status as ProjectStatus)) {
    return status as ProjectStatus
  }

  return "planning"
}

/**
 * Fallback project data used when database is unavailable
 * Complete 10x experiment portfolio
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Blyzr",
    description: "Food shopping for Millenials and GenZ running by multiagents.",
    progress: 10,
    status: "planning",
    stackItemIds: [],
    aiSkills: ["Page generator", "Recipe generator", "Marketing"],
    tools: ["Claude", "ChatGPT", "Shopify", "Vercel", "Supabase", "Cursor"],
    timeframe: "3 months",
    url: "https://www.blyzr.com/",
  },
  {
    id: 2,
    title: "Bannaa",
    description: "AI‑focused school targeting the Arab world.",
    progress: 1,
    status: "planning",
    stackItemIds: [],
    aiSkills: ["Writing", "Video Editing", "Image Generation"],
    tools: ["ChatGPT", "Claude", "Runway ML", "N8N", "Airtable", "VEO", "Gemini", "Midjourney"],
    timeframe: "2 months",
    url: "https://bannaa.ai",
  },
  {
    id: 3,
    title: "Shirt @",
    description: "Arabic Calligraphy Tshirts",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: [],
    tools: [],
    timeframe: "4 months",
    url: "shirtat.co",
  },
  {
    id: 4,
    title: "Terms Trust",
    description: "Personalized workout plans, nutrition tracking, and progress monitoring",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: [],
    tools: [],
    timeframe: "5 months",
    url: "termstrust.com",
  },
  {
    id: 5,
    title: "Deep Res",
    description: "Contract analysis, document generation, and compliance checking",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: [],
    tools: [],
    timeframe: "6 months",
    url: "deepres.io",
  },
  {
    id: 6,
    title: "Tentacles",
    description: "Personalized learning paths, automated grading, and content adaptation",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: ["Autonomy", "automation"],
    tools: ["PI", "ChatGPT"],
    timeframe: "4 months",
    url: "shopcrew.ai",
  },
  {
    id: 7,
    title: "X-RAY",
    description: "Learning skills on the go.",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: [],
    tools: [],
    timeframe: "3 months",
    url: null,
  },
  {
    id: 8,
    title: "Faceless Youtube Channel",
    description: "Arabic and Islamic history channel.",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: [],
    tools: [],
    timeframe: "8 months",
    url: null,
  },
  {
    id: 11,
    title: "Halal Pick",
    description: "Everything around Halal: food, activities, places of interest and more.",
    progress: 0,
    status: "planning",
    stackItemIds: [],
    aiSkills: [],
    tools: [],
    url: "https://halalpick.net",
  },
  {
    id: 12,
    title: "Rabbit Brain",
    description:
      "Open source web and CLI tool to learn from X.\nRabbit Brain analyzes tweets, saves bookmarks, tracks creators, and builds daily account takeaways so useful ideas are easier to revisit than the timeline they came from.",
    progress: 80,
    status: "active",
    stackItemIds: [],
    aiSkills: ["Content generation"],
    tools: ["OpenClaw"],
    url: "https://www.rabbitbrain.app/",
  },
]

/**
 * Fallback global metrics data used when database is unavailable
 */
export const FALLBACK_GLOBAL_METRICS: GlobalMetric[] = []

/**
 * Database field mapping utilities
 * Converts between database snake_case and app camelCase
 */
export const DB_FIELD_MAPPING = {
  // Project fields
  ai_skills: 'aiSkills',
  // Add more mappings as needed
} as const

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) {
      return []
    }

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        }
      } catch (_error) {
        // Fall back to comma-split parsing below
      }
    }

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return []
}

/**
 * Transform database project to app project format
 */
export function mapDbProjectToApp(dbProject: any): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    objectives: dbProject.objectives,
    progress: dbProject.progress,
    status: normalizeProjectStatus(dbProject.status),
    stackItemIds: Array.isArray(dbProject.stack_item_ids) ? dbProject.stack_item_ids : [],
    aiSkills: normalizeStringList(dbProject.ai_skills),
    tools: normalizeStringList(dbProject.tools),
    timeframe: dbProject.timeframe,
    url: dbProject.url
  }
}

/**
 * Transform app project to database project format
 */
export function mapAppProjectToDb(project: Omit<Project, 'id'> | Project) {
  return {
    title: project.title,
    description: project.description,
    objectives: project.objectives,
    progress: project.progress,
    status: project.status,
    stack_item_ids: project.stackItemIds,
    ai_skills: project.aiSkills,
    tools: project.tools,
    timeframe: project.timeframe,
    url: project.url,
  }
}
