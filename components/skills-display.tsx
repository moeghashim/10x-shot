import { Badge } from "@/components/ui/badge"
import { Bot, Wrench } from "lucide-react"

interface SkillsDisplayProps {
  aiSkills: string[]
  tools: string[]
  labels?: {
    aiSkills?: string
    toolsUsed?: string
  }
}

export function SkillsDisplay({
  aiSkills,
  tools,
  labels = {},
}: SkillsDisplayProps) {
  const {
    aiSkills: aiSkillsLabel = "AI Skills",
    toolsUsed: toolsUsedLabel = "Tools Used",
  } = labels
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-4 w-4 text-black" />
          <span className="text-sm font-medium text-gray-700">{aiSkillsLabel}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(aiSkills || []).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs text-black border-black bg-gray-50">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{toolsUsedLabel}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(tools || []).map((tool, index) => (
            <Badge key={index} variant="outline" className="text-xs text-gray-500 border-gray-400 bg-gray-50">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
