import { SkillsDisplay } from "@/components/skills-display"
import { Clock, TrendingUp, Play, Pause, ExternalLink } from "lucide-react"
import type { Project } from "@/types/database"

interface VibeProjectCardProps {
  project: Project
  labels: {
    objectives: string
    progress: string
    launch: string
    launchingSoon: string
    status: Record<"active" | "planning" | "completed", string>
  }
  skillLabels: {
    aiSkills: string
    toolsUsed: string
  }
}

function isProjectLaunchingSoon(project: Project) {
  return project.status === "planning" || !project.url
}

export function VibeProjectCard({ project, labels, skillLabels }: VibeProjectCardProps) {
  const status = ["active", "planning", "completed"].includes(project.status)
    ? project.status
    : "planning"
  const launchingSoon = isProjectLaunchingSoon(project)

  const statusStyles = {
    active: {
      border: "border-emerald-600",
      text: "text-emerald-600",
      icon: "text-emerald-600",
    },
    planning: {
      border: "border-amber-500",
      text: "text-amber-600",
      icon: "text-amber-600",
    },
    completed: {
      border: "border-black",
      text: "text-black",
      icon: "text-black",
    },
  } as const

  const statusStyle = statusStyles[status as keyof typeof statusStyles]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className={`h-3 w-3 ${statusStyle.icon}`} />
      case "planning":
        return <Pause className={`h-3 w-3 ${statusStyle.icon}`} />
      case "completed":
        return <TrendingUp className={`h-3 w-3 ${statusStyle.icon}`} />
      default:
        return null
    }
  }

  return (
    <div className="vibe-font bg-white border-2 border-dashed border-gray-300 p-6 transition-all hover:border-black text-start">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{project.title}</h3>
        <div className={`flex items-center gap-1 px-2 py-1 border-2 ${statusStyle.border} text-[10px] font-black uppercase tracking-widest bg-white whitespace-nowrap ${statusStyle.text}`}>
          {getStatusIcon(status)}
          {labels.status[status]}
        </div>
      </div>

      <div className="relative">
        <div className={`space-y-6 ${launchingSoon ? "select-none blur-[3px] opacity-45" : ""}`}>
          <p className="text-sm font-medium leading-relaxed text-gray-800">{project.description}</p>

          {project.objectives && (
            <div className="p-3 border border-dashed border-gray-300 bg-gray-50/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{labels.objectives}</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">{project.objectives}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span>{labels.progress}</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-3 border border-dashed border-gray-300 bg-gray-50 p-0.5 overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {project.timeframe && (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{project.timeframe}</span>
            </div>
          )}

          <div className="pt-2 border-t border-dashed border-gray-200">
            <SkillsDisplay
              aiSkills={project.aiSkills}
              tools={project.tools}
              labels={{
                aiSkills: skillLabels.aiSkills,
                toolsUsed: skillLabels.toolsUsed,
              }}
            />
          </div>
        </div>

        {launchingSoon ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="border-2 border-black bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              {labels.launchingSoon}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {launchingSoon ? (
          <div
            aria-disabled="true"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-tighter text-gray-400 border-2 border-dashed border-gray-300 bg-gray-50"
          >
            {labels.launchingSoon}
          </div>
        ) : (
          <a
            href={project.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-tighter text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            {labels.launch}
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}
