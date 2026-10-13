type StackLogo = { file: string; domain?: string; custom?: boolean }

const logos: Record<string, StackLogo> = {
  openclaw: { file: "openclaw-color", domain: "openclaw.ai" },
  muse: { file: "meta-color", domain: "ai.meta.com" },
  "grok bot": { file: "grok", domain: "x.ai" },
  dots: { file: "openai", domain: "openai.com" },
  mausbot: { file: "mausbot", domain: "mausbot.com" },
  hermes: { file: "hermesagent", domain: "hermes-agent.nousresearch.com" },
  codex: { file: "codex-color", domain: "openai.com" },
  chatgpt: { file: "openai", domain: "chatgpt.com" },
  "stripe projects": { file: "stripe", domain: "stripe.com" },
  paperclip: { file: "paperclip", domain: "paperclip.ing" },
  pi: { file: "pi", domain: "pi.dev", custom: true },
  grok: { file: "grok", domain: "grok.com" },
  firecrawl: { file: "firecrawl-color", domain: "firecrawl.dev" },
  vercel: { file: "vercel", domain: "vercel.com" },
  convex: { file: "convex", domain: "convex.dev" },
  "kling 2": { file: "kling-color", domain: "klingai.com" },
  "nano banana": { file: "nanobanana-color", domain: "gemini.google" },
  "seedance 2.0": { file: "bytedance-color", domain: "seed.bytedance.com" },
  "trigger.dev": { file: "trigger", domain: "trigger.dev", custom: true },
  x: { file: "x", domain: "x.com" },
  langchain: { file: "langchain-color", domain: "langchain.com" },
  droid: { file: "droid", domain: "factory.ai" },
  gemini: { file: "gemini-color", domain: "gemini.google" },
  "page generator": { file: "page-generator", custom: true },
  "recipe generator": { file: "recipe-generator", custom: true },
  marketing: { file: "marketing", custom: true },
  autonomy: { file: "autonomy", custom: true },
  automation: { file: "automation", custom: true },
}

export function getStackLogo(name: string) {
  const logo = logos[name.trim().toLowerCase()] ?? { file: "skill", custom: true }
  return { ...logo, src: `/stack-logos/${logo.file}.svg` }
}
