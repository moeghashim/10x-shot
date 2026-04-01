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
    title: "AI E-commerce Platform",
    description: "Automated product descriptions, pricing optimization, and customer service",
    progress: 85,
    status: "active",
    aiSkills: ["Content Generation", "Price Optimization", "Customer Support"],
    tools: ["ChatGPT", "Stripe", "Vercel", "Supabase", "Midjourney"],
    timeframe: "3 months",
    url: "https://ai-ecommerce-demo.vercel.app",
  },
  {
    id: 2,
    title: "Bannaa - Arabic AI School",
    description: "AI‑focused school targeting the Arab world.",
    progress: 2,
    status: "active",
    aiSkills: ["Writing", "Video Editing", "Image Generation"],
    tools: ["ChatGPT", "Claude", "Runway ML", "N8N", "Airtable", "VEO", "Gemini", "Midjourney"],
    timeframe: "2 months",
    url: "https://bannaa.ai",
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "Automated data processing, visualization, and insight generation",
    progress: 78,
    status: "active",
    aiSkills: ["Data Processing", "Pattern Recognition", "Report Generation"],
    tools: ["ChatGPT", "Tableau", "Python", "Jupyter", "AWS", "MongoDB"],
    timeframe: "4 months",
    url: "https://analytics-ai-dashboard.vercel.app",
  },
  {
    id: 4,
    title: "Mobile Fitness App",
    description: "Personalized workout plans, nutrition tracking, and progress monitoring",
    progress: 65,
    status: "active",
    aiSkills: ["Personalization", "Computer Vision", "Nutrition Analysis"],
    tools: ["ChatGPT", "React Native", "Firebase", "TensorFlow", "Figma"],
    timeframe: "5 months",
    url: "https://fitness-ai-app.vercel.app",
  },
  {
    id: 5,
    title: "Legal Document Processor",
    description: "Contract analysis, document generation, and compliance checking",
    progress: 45,
    status: "active",
    aiSkills: ["NLP", "Document Analysis", "Legal Reasoning"],
    tools: ["ChatGPT", "Claude", "LangChain", "Pinecone", "Notion", "DocuSign"],
    timeframe: "6 months",
    url: "https://legal-ai-processor.vercel.app",
  },
  {
    id: 6,
    title: "Educational Platform",
    description: "Personalized learning paths, automated grading, and content adaptation",
    progress: 58,
    status: "active",
    aiSkills: ["Personalization", "Content Generation", "Assessment"],
    tools: ["ChatGPT", "Teachable Machine", "Moodle", "Zoom", "Loom", "Calendly"],
    timeframe: "4 months",
    url: "https://edu-ai-platform.vercel.app",
  },
  {
    id: 7,
    title: "Financial Planning Tool",
    description: "Investment recommendations, risk assessment, and portfolio optimization",
    progress: 72,
    status: "active",
    aiSkills: ["Market Analysis", "Risk Modeling", "Optimization"],
    tools: ["ChatGPT", "Alpha Vantage", "Plaid", "Chart.js", "Vercel", "PostgreSQL"],
    timeframe: "3 months",
    url: "https://fintech-ai-planner.vercel.app",
  },
  {
    id: 8,
    title: "Smart Home Automation",
    description: "Intelligent device control, energy optimization, and predictive maintenance",
    progress: 25,
    status: "planning",
    aiSkills: ["Predictive Analytics", "Optimization", "Pattern Recognition"],
    tools: ["ChatGPT", "Arduino", "Raspberry Pi", "MQTT", "InfluxDB", "Grafana"],
    timeframe: "8 months",
    url: "https://smarthome-ai-demo.vercel.app",
  },
  {
    id: 9,
    title: "Marketing Automation Suite",
    description: "Campaign optimization, lead scoring, and personalized messaging",
    progress: 15,
    status: "planning",
    aiSkills: ["Personalization", "Optimization", "Predictive Modeling"],
    tools: ["ChatGPT", "HubSpot", "Mailchimp", "Google Analytics", "Zapier", "Airtable"],
    timeframe: "6 months",
    url: "https://marketing-ai-suite.vercel.app",
  },
  {
    id: 10,
    title: "Creative Design Studio",
    description: "Automated design generation, brand consistency, and creative workflows",
    progress: 8,
    status: "planning",
    aiSkills: ["Image Generation", "Design Automation", "Style Transfer"],
    tools: ["ChatGPT", "Midjourney", "DALL-E", "Figma", "Adobe Creative Suite", "Framer"],
    timeframe: "7 months",
    url: "https://design-ai-studio.vercel.app",
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
    ai_skills: project.aiSkills,
    tools: project.tools,
    timeframe: project.timeframe,
    url: project.url,
  }
}
