"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "@/components/project-card"
import { supabase } from "@/lib/supabase"

interface Project {
  id: number
  title: string
  domain: string
  description: string
  progress: number
  status: "active" | "planning" | "completed"
  mySkills: string[]
  aiSkills: string[]
  tools: string[]
  productivity: number
  timeframe: string
  url: string
}

// Fallback data for when database isn't ready - Complete 10x experiment portfolio
const fallbackProjects: Project[] = [
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

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.warn('Database not ready, using fallback data:', error)
        // Fallback to hardcoded data if database isn't set up yet
        setProjects(fallbackProjects)
        setLoading(false)
        return
      }

      // Map database fields to expected interface
      const mappedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        title: project.title,
        domain: project.domain,
        description: project.description,
        progress: project.progress,
        status: project.status as "active" | "planning" | "completed",
        mySkills: project.my_skills || [],
        aiSkills: project.ai_skills || [],
        tools: project.tools || [],
        productivity: project.productivity,
        timeframe: project.timeframe,
        url: project.url
      }))

      setProjects(mappedProjects)
    } catch (error) {
      console.warn('Database connection failed, using fallback data:', error)
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="projects" className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">Loading projects...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black">The 10x Experiment Projects</h2>
          <p className="text-lg text-gray-600">
            Each project tests AI's ability to amplify human capabilities across different domains
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(projects || []).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
