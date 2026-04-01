import "server-only"

import { createHash } from "node:crypto"
import type {
  GlobalMetric,
  GlobalMetricLocalizationBundle,
  LocalizedStringListValue,
  LocalizedTextValue,
  Project,
  ProjectLocalizationBundle,
  SiteContentEntry,
  TranslationStatus,
} from "@/types/database"

const TRANSLATION_MODEL = process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.4-nano"
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"

type StoredLocalizedText = {
  en: string
  ar: string
  sourceHash?: string
  translatedAt?: number
  translationModel?: string
  translationStatus?: TranslationStatus
}

type StoredLocalizedStringList = {
  en: string[]
  ar: string[]
  sourceHash?: string
  translatedAt?: number
  translationModel?: string
  translationStatus?: TranslationStatus
}

type ProjectStoredLocalization = {
  title: StoredLocalizedText
  description: StoredLocalizedText
  objectives?: StoredLocalizedText
  timeframe?: StoredLocalizedText
  aiSkills: StoredLocalizedStringList
  tools: StoredLocalizedStringList
}

type GlobalMetricStoredLocalization = {
  skillsGained: StoredLocalizedStringList
  milestones: StoredLocalizedStringList
}

function hashValue(value: string | string[]) {
  return createHash("sha256").update(Array.isArray(value) ? JSON.stringify(value) : value).digest("hex")
}

function normalizeOptionalText(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function toStoredLocalizedText(value?: LocalizedTextValue | null): StoredLocalizedText | undefined {
  if (!value) {
    return undefined
  }

  return {
    en: value.en,
    ar: value.ar,
    sourceHash: value.source_hash,
    translatedAt: value.translated_at ? new Date(value.translated_at).getTime() : undefined,
    translationModel: value.translation_model,
    translationStatus: value.translation_status,
  }
}

function toStoredLocalizedList(value?: LocalizedStringListValue | null): StoredLocalizedStringList | undefined {
  if (!value) {
    return undefined
  }

  return {
    en: value.en,
    ar: value.ar,
    sourceHash: value.source_hash,
    translatedAt: value.translated_at ? new Date(value.translated_at).getTime() : undefined,
    translationModel: value.translation_model,
    translationStatus: value.translation_status,
  }
}

function buildTextResult(
  english: string,
  arabic: string,
  status: TranslationStatus,
  translatedAt?: number
): StoredLocalizedText {
  return {
    en: english,
    ar: arabic,
    sourceHash: hashValue(english),
    translatedAt,
    translationModel: TRANSLATION_MODEL,
    translationStatus: status,
  }
}

function buildListResult(
  english: string[],
  arabic: string[],
  status: TranslationStatus,
  translatedAt?: number
): StoredLocalizedStringList {
  return {
    en: english,
    ar: arabic,
    sourceHash: hashValue(english),
    translatedAt,
    translationModel: TRANSLATION_MODEL,
    translationStatus: status,
  }
}

function buildProjectTitleResult(english: string, previous?: StoredLocalizedText): StoredLocalizedText {
  return {
    en: english,
    ar: english,
    sourceHash: hashValue(english),
    translatedAt: previous?.translatedAt ?? Date.now(),
    translationModel: previous?.translationModel ?? TRANSLATION_MODEL,
    translationStatus: "synced",
  }
}

function fallbackText(english: string, previous?: StoredLocalizedText): StoredLocalizedText {
  return buildTextResult(english, previous?.ar || english, "failed")
}

function fallbackList(english: string[], previous?: StoredLocalizedStringList): StoredLocalizedStringList {
  return buildListResult(english, previous?.ar || english, "failed")
}

function isTextUnchanged(english: string, previous?: StoredLocalizedText) {
  return Boolean(previous?.sourceHash && previous.sourceHash === hashValue(english) && previous.ar)
}

function isListUnchanged(english: string[], previous?: StoredLocalizedStringList) {
  return Boolean(previous?.sourceHash && previous.sourceHash === hashValue(english) && previous.ar)
}

function extractOutputText(data: any) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text
  }

  const parts: string[] = []
  const output = Array.isArray(data?.output) ? data.output : []
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : []
    for (const block of content) {
      if (typeof block?.text === "string" && block.text.trim()) {
        parts.push(block.text)
      }
    }
  }

  return parts.join("\n").trim()
}

async function translateStructured<T>({
  key,
  context,
  payload,
  schema,
}: {
  key: string
  context: string
  payload: Record<string, unknown>
  schema: Record<string, unknown>
}): Promise<T> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: TRANSLATION_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Translate public website content from English to Modern Standard Arabic. Preserve brand names, URLs, file paths, product names, and formatting. Keep line breaks. Return only valid JSON matching the schema.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                key,
                context,
                tone: "Modern Standard Arabic",
                payload,
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "translation_result",
          schema,
          strict: true,
        },
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI translation failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const outputText = extractOutputText(data)
  if (!outputText) {
    throw new Error("OpenAI translation returned no output")
  }

  return JSON.parse(outputText) as T
}

export async function localizeProjectContent(
  project: Omit<Project, "id"> | Project,
  previous?: ProjectLocalizationBundle | null
): Promise<{ localized: ProjectStoredLocalization; hadFailures: boolean }> {
  const english = {
    title: project.title,
    description: project.description,
    objectives: normalizeOptionalText(project.objectives),
    timeframe: normalizeOptionalText(project.timeframe),
    aiSkills: project.aiSkills,
    tools: project.tools,
  }

  const previousStored = previous
    ? {
        title: toStoredLocalizedText(previous.title)!,
        description: toStoredLocalizedText(previous.description)!,
        objectives: toStoredLocalizedText(previous.objectives),
        timeframe: toStoredLocalizedText(previous.timeframe),
        aiSkills: toStoredLocalizedList(previous.aiSkills)!,
        tools: toStoredLocalizedList(previous.tools)!,
      }
    : undefined

  const unchanged =
    isTextUnchanged(english.title, previousStored?.title) &&
    isTextUnchanged(english.description, previousStored?.description) &&
    (english.objectives ? isTextUnchanged(english.objectives, previousStored?.objectives) : !previousStored?.objectives) &&
    (english.timeframe ? isTextUnchanged(english.timeframe, previousStored?.timeframe) : !previousStored?.timeframe) &&
    isListUnchanged(english.aiSkills, previousStored?.aiSkills) &&
    isListUnchanged(english.tools, previousStored?.tools)

  if (unchanged && previousStored) {
    return {
      localized: {
        ...previousStored,
        title: buildProjectTitleResult(english.title, previousStored.title),
      },
      hadFailures: false,
    }
  }

  try {
    const translated = await translateStructured<{
      description: string
      objectives: string | null
      timeframe: string | null
      aiSkills: string[]
      tools: string[]
    }>({
      key: `project:${"id" in project ? project.id : "new"}`,
      context: "Public project content",
      payload: english,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          description: { type: "string" },
          objectives: { type: ["string", "null"] },
          timeframe: { type: ["string", "null"] },
          aiSkills: {
            type: "array",
            items: { type: "string" },
          },
          tools: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["description", "objectives", "timeframe", "aiSkills", "tools"],
      },
    })

    const translatedAt = Date.now()
    return {
      hadFailures: false,
      localized: {
        title: buildProjectTitleResult(english.title, previousStored?.title),
        description: buildTextResult(english.description, translated.description, "synced", translatedAt),
        objectives: english.objectives
          ? buildTextResult(english.objectives, translated.objectives || english.objectives, "synced", translatedAt)
          : undefined,
        timeframe: english.timeframe
          ? buildTextResult(english.timeframe, translated.timeframe || english.timeframe, "synced", translatedAt)
          : undefined,
        aiSkills: buildListResult(english.aiSkills, translated.aiSkills, "synced", translatedAt),
        tools: buildListResult(english.tools, translated.tools, "synced", translatedAt),
      },
    }
  } catch (_error) {
    return {
      hadFailures: true,
      localized: {
        title: buildProjectTitleResult(english.title, previousStored?.title),
        description: fallbackText(english.description, previousStored?.description),
        objectives: english.objectives ? fallbackText(english.objectives, previousStored?.objectives) : undefined,
        timeframe: english.timeframe ? fallbackText(english.timeframe, previousStored?.timeframe) : undefined,
        aiSkills: fallbackList(english.aiSkills, previousStored?.aiSkills),
        tools: fallbackList(english.tools, previousStored?.tools),
      },
    }
  }
}

export async function localizeGlobalMetricContent(
  metric: Omit<GlobalMetric, "id" | "created_at">,
  previous?: GlobalMetricLocalizationBundle | null
): Promise<{ localized: GlobalMetricStoredLocalization; hadFailures: boolean }> {
  const english = {
    skillsGained: metric.skills_gained,
    milestones: metric.milestones,
  }

  const previousStored = previous
    ? {
        skillsGained: toStoredLocalizedList(previous.skillsGained)!,
        milestones: toStoredLocalizedList(previous.milestones)!,
      }
    : undefined

  const unchanged =
    isListUnchanged(english.skillsGained, previousStored?.skillsGained) &&
    isListUnchanged(english.milestones, previousStored?.milestones)

  if (unchanged && previousStored) {
    return { localized: previousStored, hadFailures: false }
  }

  try {
    const translated = await translateStructured<{
      skillsGained: string[]
      milestones: string[]
    }>({
      key: `global-metric:${metric.month}`,
      context: "Public monthly metrics labels and milestones",
      payload: english,
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          skillsGained: {
            type: "array",
            items: { type: "string" },
          },
          milestones: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["skillsGained", "milestones"],
      },
    })

    const translatedAt = Date.now()
    return {
      hadFailures: false,
      localized: {
        skillsGained: buildListResult(english.skillsGained, translated.skillsGained, "synced", translatedAt),
        milestones: buildListResult(english.milestones, translated.milestones, "synced", translatedAt),
      },
    }
  } catch (_error) {
    return {
      hadFailures: true,
      localized: {
        skillsGained: fallbackList(english.skillsGained, previousStored?.skillsGained),
        milestones: fallbackList(english.milestones, previousStored?.milestones),
      },
    }
  }
}

export async function localizeSiteCopyEntry(
  key: string,
  english: string,
  previous?: SiteContentEntry | null
): Promise<{ localized: StoredLocalizedText; hadFailures: boolean }> {
  const previousStored = previous ? toStoredLocalizedText({
    en: previous.en,
    ar: previous.ar,
    source_hash: previous.source_hash,
    translated_at: previous.translated_at,
    translation_model: previous.translation_model,
    translation_status: previous.translation_status,
  }) : undefined

  if (previousStored && isTextUnchanged(english, previousStored)) {
    return { localized: previousStored, hadFailures: false }
  }

  try {
    const translated = await translateStructured<{ value: string }>({
      key,
      context: "Public website copy",
      payload: { value: english },
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "string" },
        },
        required: ["value"],
      },
    })

    return {
      hadFailures: false,
      localized: buildTextResult(english, translated.value, "synced", Date.now()),
    }
  } catch (_error) {
    return {
      hadFailures: true,
      localized: fallbackText(english, previousStored),
    }
  }
}
