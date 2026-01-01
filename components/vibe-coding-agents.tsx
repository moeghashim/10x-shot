"use client"

import { GeistMono } from "geist/font/mono"
import { Sparkles, Zap, Shield, Cpu, Terminal, Code2, Globe, Box, Workflow } from "lucide-react"

const agents = [
  { name: "Claude Code", icon: <Sparkles className="h-5 w-5 text-orange-500" />, active: false },
  { name: "OpenAI Codex", icon: <Zap className="h-5 w-5 text-green-600" />, active: false },
  { name: "GitHub Copilot", icon: <Shield className="h-5 w-5 text-gray-700" />, active: false },
  { name: "Amp", icon: <Cpu className="h-5 w-5 text-red-500" />, active: false },
  { name: "Gemini CLI", icon: <Globe className="h-5 w-5 text-blue-500" />, active: false },
  { name: "Cursor CLI", icon: <Terminal className="h-5 w-5 text-black" />, active: true },
  { name: "Opencode", icon: <Code2 className="h-5 w-5 text-black" />, active: false },
  { name: "Qwen Code", icon: <Workflow className="h-5 w-5 text-purple-600" />, active: false },
  { name: "Factory Droid", icon: <Box className="h-5 w-5 text-black" />, active: false },
]

export function VibeCodingAgents() {
  return (
    <section className={`${GeistMono.className} px-6 py-24 bg-white`}>
      <div className="mx-auto max-w-7xl border-2 border-dashed border-gray-300 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/3">
          <h2 className="text-4xl font-black tracking-tight mb-6 leading-tight">
            Choose Your Coding Agent
          </h2>
          <p className="text-xl font-medium text-gray-600">
            Works seamlessly with all your favorite AI coding agents.
          </p>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={`flex items-center gap-3 px-4 py-4 transition-all ${
                agent.active
                  ? "border-2 border-black bg-white"
                  : "border-2 border-dashed border-gray-300 bg-transparent opacity-80"
              }`}
            >
              <div className="shrink-0">{agent.icon}</div>
              <span className="font-bold text-sm tracking-tight">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

