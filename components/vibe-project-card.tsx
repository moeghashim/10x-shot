import { SkillsDisplay } from "@/components/skills-display"
import { Clock, TrendingUp, Play, Pause, ExternalLink } from "lucide-react"
import type { Project } from "@/types/database"
import { getTranslations } from "next-intl/server"

interface VibeProjectCardProps {
  project: Project
}

export async function VibeProjectCard({ project }: VibeProjectCardProps) {
  const t = await getTranslations("HomePage.projects")
  const tSkills = await getTranslations("HomePage.skills")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-3 w-3" />
      case "planning":
        return <Pause className="h-3 w-3" />
      case "completed":
        return <TrendingUp className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="vibe-font bg-white border-2 border-dashed border-gray-300 p-6 transition-all hover:border-black text-start">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{project.title}</h3>
          <span className="inline-block px-2 py-0.5 border border-dashed border-gray-300 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {project.domain}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 border-2 border-black text-[10px] font-black uppercase tracking-widest bg-white whitespace-nowrap">
          {getStatusIcon(project.status)}
          {t(`status.${project.status}`)}
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-sm font-medium leading-relaxed text-gray-800">{project.description}</p>
        
        {project.objectives && (
          <div className="p-3 border border-dashed border-gray-300 bg-gray-50/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t("objectives")}</p>
            <p className="text-sm font-bold text-gray-900 leading-tight">{project.objectives}</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span>{t("progress")}</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-3 border border-dashed border-gray-300 bg-gray-50 p-0.5 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500" 
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-2 border-dashed border-gray-300 bg-white group hover:border-black transition-colors">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">{t("productivityGain")}</span>
          </div>
          <span className="text-xl font-black">{project.productivity}x</span>
        </div>

        {project.timeframe && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{project.timeframe}</span>
          </div>
        )}

        <div className="pt-2 border-t border-dashed border-gray-200">
          <SkillsDisplay
            mySkills={project.mySkills}
            aiSkills={project.aiSkills}
            tools={project.tools}
            labels={{
              mySkills: tSkills("mySkills"),
              aiSkills: tSkills("aiSkills"),
              toolsUsed: tSkills("toolsUsed"),
            }}
          />
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-tighter text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            {t("launch")}
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}
