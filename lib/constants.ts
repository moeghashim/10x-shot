/**
 * Shared constants and fallback data for the application
 * This file serves as the single source of truth for default/fallback data
 */

import type { Project, GlobalMetric } from "@/types/database"

/**
 * Fallback project data used when database is unavailable
 * Complete 10x experiment portfolio
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI E-commerce Platform",
    domain: "E-commerce",
    description: "Automated product descriptions, pricing optimization, and customer service",
    progress: 85,
    status: "active",
    mySkills: ["React", "Node.js", "Database Design"],
    aiSkills: ["Content Generation", "Price Optimization", "Customer Support"],
    tools: ["ChatGPT", "Stripe", "Vercel", "Supabase", "Midjourney"],
    productivity: 8.2,
    timeframe: "3 months",
    url: "https://ai-ecommerce-demo.vercel.app",
  },
  {
    id: 2,
    title: "Bannaa - Arabic AI School",
    domain: "Media & Content",
    description: "AI‑focused school targeting the Arab world.",
    progress: 2,
    status: "active",
    mySkills: ["Content Strategy", "Management"],
    aiSkills: ["Writing", "Video Editing", "Image Generation"],
    tools: ["ChatGPT", "Claude", "Runway ML", "N8N", "Airtable", "VEO", "Gemini", "Midjourney"],
    productivity: 0.1,
    timeframe: "2 months",
    url: "https://bannaa.ai",
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    domain: "Analytics",
    description: "Automated data processing, visualization, and insight generation",
    progress: 78,
    status: "active",
    mySkills: ["Data Analysis", "Visualization", "Statistics"],
    aiSkills: ["Data Processing", "Pattern Recognition", "Report Generation"],
    tools: ["ChatGPT", "Tableau", "Python", "Jupyter", "AWS", "MongoDB"],
    productivity: 6.8,
    timeframe: "4 months",
    url: "https://analytics-ai-dashboard.vercel.app",
  },
  {
    id: 4,
    title: "Mobile Fitness App",
    domain: "Health & Fitness",
    description: "Personalized workout plans, nutrition tracking, and progress monitoring",
    progress: 65,
    status: "active",
    mySkills: ["Mobile Development", "UI/UX", "Health Domain"],
    aiSkills: ["Personalization", "Computer Vision", "Nutrition Analysis"],
    tools: ["ChatGPT", "React Native", "Firebase", "TensorFlow", "Figma"],
    productivity: 5.2,
    timeframe: "5 months",
    url: "https://fitness-ai-app.vercel.app",
  },
  {
    id: 5,
    title: "Legal Document Processor",
    domain: "Legal Tech",
    description: "Contract analysis, document generation, and compliance checking",
    progress: 45,
    status: "active",
    mySkills: ["Legal Research", "Document Processing", "Compliance"],
    aiSkills: ["NLP", "Document Analysis", "Legal Reasoning"],
    tools: ["ChatGPT", "Claude", "LangChain", "Pinecone", "Notion", "DocuSign"],
    productivity: 4.1,
    timeframe: "6 months",
    url: "https://legal-ai-processor.vercel.app",
  },
  {
    id: 6,
    title: "Educational Platform",
    domain: "EdTech",
    description: "Personalized learning paths, automated grading, and content adaptation",
    progress: 58,
    status: "active",
    mySkills: ["Education", "Curriculum Design", "Learning Theory"],
    aiSkills: ["Personalization", "Content Generation", "Assessment"],
    tools: ["ChatGPT", "Teachable Machine", "Moodle", "Zoom", "Loom", "Calendly"],
    productivity: 7.3,
    timeframe: "4 months",
    url: "https://edu-ai-platform.vercel.app",
  },
  {
    id: 7,
    title: "Financial Planning Tool",
    domain: "FinTech",
    description: "Investment recommendations, risk assessment, and portfolio optimization",
    progress: 72,
    status: "active",
    mySkills: ["Finance", "Investment Strategy", "Risk Management"],
    aiSkills: ["Market Analysis", "Risk Modeling", "Optimization"],
    tools: ["ChatGPT", "Alpha Vantage", "Plaid", "Chart.js", "Vercel", "PostgreSQL"],
    productivity: 9.1,
    timeframe: "3 months",
    url: "https://fintech-ai-planner.vercel.app",
  },
  {
    id: 8,
    title: "Smart Home Automation",
    domain: "IoT",
    description: "Intelligent device control, energy optimization, and predictive maintenance",
    progress: 25,
    status: "planning",
    mySkills: ["IoT", "Hardware Integration", "System Architecture"],
    aiSkills: ["Predictive Analytics", "Optimization", "Pattern Recognition"],
    tools: ["ChatGPT", "Arduino", "Raspberry Pi", "MQTT", "InfluxDB", "Grafana"],
    productivity: 3.2,
    timeframe: "8 months",
    url: "https://smarthome-ai-demo.vercel.app",
  },
  {
    id: 9,
    title: "Marketing Automation Suite",
    domain: "Marketing",
    description: "Campaign optimization, lead scoring, and personalized messaging",
    progress: 15,
    status: "planning",
    mySkills: ["Marketing Strategy", "Campaign Management", "Analytics"],
    aiSkills: ["Personalization", "Optimization", "Predictive Modeling"],
    tools: ["ChatGPT", "HubSpot", "Mailchimp", "Google Analytics", "Zapier", "Airtable"],
    productivity: 2.8,
    timeframe: "6 months",
    url: "https://marketing-ai-suite.vercel.app",
  },
  {
    id: 10,
    title: "Creative Design Studio",
    domain: "Design",
    description: "Automated design generation, brand consistency, and creative workflows",
    progress: 8,
    status: "planning",
    mySkills: ["Design Principles", "Brand Strategy", "Creative Direction"],
    aiSkills: ["Image Generation", "Design Automation", "Style Transfer"],
    tools: ["ChatGPT", "Midjourney", "DALL-E", "Figma", "Adobe Creative Suite", "Framer"],
    productivity: 1.9,
    timeframe: "7 months",
    url: "https://design-ai-studio.vercel.app",
  },
]

/**
 * Fallback global metrics data used when database is unavailable
 */
export const FALLBACK_GLOBAL_METRICS: GlobalMetric[] = [
  {
    id: 6,
    month: "2024-06-01",
    twitter_followers: 4200,
    youtube_subscribers: 1850,
    tiktok_followers: 4100,
    instagram_followers: 6800,
    newsletter_subscribers: 2100,
    total_gmv: 51500,
    productivity_gain: 9.1,
    skills_gained: ["Advanced Management", "Full-Stack Vibe Coding"],
    milestones: ["4k Twitter followers", "2k Newsletter subscribers"]
  },
  {
    id: 5,
    month: "2024-05-01",
    twitter_followers: 3600,
    youtube_subscribers: 1450,
    tiktok_followers: 3200,
    instagram_followers: 5300,
    newsletter_subscribers: 1680,
    total_gmv: 42800,
    productivity_gain: 7.9,
    skills_gained: ["UI/UX Design", "Team Leadership"],
    milestones: ["5k Instagram followers", "$40k month"]
  },
  {
    id: 4,
    month: "2024-04-01",
    twitter_followers: 2850,
    youtube_subscribers: 1100,
    tiktok_followers: 2450,
    instagram_followers: 4100,
    newsletter_subscribers: 1250,
    total_gmv: 34200,
    productivity_gain: 6.2,
    skills_gained: ["Project Management", "Advanced Vibe Coding"],
    milestones: ["1k YouTube subscribers", "First viral TikTok"]
  },
  {
    id: 3,
    month: "2024-03-01",
    twitter_followers: 2100,
    youtube_subscribers: 780,
    tiktok_followers: 1890,
    instagram_followers: 3200,
    newsletter_subscribers: 920,
    total_gmv: 25600,
    productivity_gain: 4.8,
    skills_gained: ["Advanced Design Systems", "Vibe Coding Fundamentals"],
    milestones: ["2k Twitter followers", "Launched Bannaa.ai"]
  },
  {
    id: 2,
    month: "2024-02-01",
    twitter_followers: 1580,
    youtube_subscribers: 520,
    tiktok_followers: 1340,
    instagram_followers: 2650,
    newsletter_subscribers: 680,
    total_gmv: 18900,
    productivity_gain: 3.4,
    skills_gained: ["Figma Basics", "Team Management"],
    milestones: ["Reached 500 YouTube subscribers", "First $15k month"]
  },
  {
    id: 1,
    month: "2024-01-01",
    twitter_followers: 1250,
    youtube_subscribers: 340,
    tiktok_followers: 890,
    instagram_followers: 2100,
    newsletter_subscribers: 450,
    total_gmv: 12500,
    productivity_gain: 2.1,
    skills_gained: ["Basic Design Principles"],
    milestones: ["Started 10x experiment", "Launched first project"]
  },
]

/**
 * Database field mapping utilities
 * Converts between database snake_case and app camelCase
 */
export const DB_FIELD_MAPPING = {
  // Project fields
  my_skills: 'mySkills',
  ai_skills: 'aiSkills',
  // Add more mappings as needed
} as const

/**
 * Transform database project to app project format
 */
export function mapDbProjectToApp(dbProject: any): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    domain: dbProject.domain,
    description: dbProject.description,
    objectives: dbProject.objectives,
    progress: dbProject.progress,
    status: dbProject.status as "active" | "planning" | "completed",
    mySkills: dbProject.my_skills || [],
    aiSkills: dbProject.ai_skills || [],
    tools: dbProject.tools || [],
    productivity: dbProject.productivity,
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
    domain: project.domain,
    description: project.description,
    objectives: project.objectives,
    progress: project.progress,
    status: project.status,
    my_skills: project.mySkills,
    ai_skills: project.aiSkills,
    tools: project.tools,
    productivity: project.productivity,
    timeframe: project.timeframe,
    url: project.url,
  }
}

