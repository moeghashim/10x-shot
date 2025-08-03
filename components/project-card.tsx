import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SkillsDisplay } from "@/components/skills-display"
import { Clock, TrendingUp, Play, Pause, ExternalLink } from "lucide-react"

interface Project {
  id: number
  title: string
  domain: string
  description: string
  progress: number
  status: "active" | "planning" | "completed"
  mySkills: string[]
  aiSkills: string[]
  productivity: number
  timeframe: string
  url: string | null
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
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
    <Card className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-black mb-2">{project.title}</CardTitle>
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              {project.domain}
            </Badge>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-gray-600 border border-gray-300">
            {getStatusIcon(project.status)}
            {project.status}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{project.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="text-black font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {project.productivity > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Productivity Gain</span>
            </div>
            <span className="font-bold text-black">{project.productivity}x</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{project.timeframe}</span>
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-black border border-black rounded hover:bg-black hover:text-white transition-colors"
          >
            View Project
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <SkillsDisplay mySkills={project.mySkills} aiSkills={project.aiSkills} />
      </CardContent>
    </Card>
  )
}
