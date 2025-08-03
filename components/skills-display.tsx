import { Badge } from "@/components/ui/badge"
import { User, Bot, Wrench } from "lucide-react"

interface SkillsDisplayProps {
  mySkills: string[]
  aiSkills: string[]
  tools: string[]
}

export function SkillsDisplay({ mySkills, aiSkills, tools }: SkillsDisplayProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">My Skills</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {mySkills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs text-gray-700 border-gray-300 bg-white">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-4 w-4 text-black" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Skills</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {aiSkills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs text-black border-black bg-gray-50">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Tools Used</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {tools.map((tool, index) => (
            <Badge key={index} variant="outline" className="text-xs text-gray-500 border-gray-400 bg-gray-50">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
