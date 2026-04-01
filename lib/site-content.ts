import "server-only"

import { unstable_cache } from "next/cache"
import enMessages from "@/messages/en.json"
import arMessages from "@/messages/ar.json"
import { api } from "@/convex/_generated/api"
import { SITE_COPY_CACHE_TAG } from "@/lib/cache-tags"
import { fetchConvexAuthQuery, fetchConvexQuery, hasConvexEnv } from "@/lib/auth-server"
import type { SiteContentEntry, SupportedLocale } from "@/types/database"

export type SiteCopyMap = Record<string, SiteContentEntry>

function flattenMessages(input: unknown, prefix = ""): Record<string, string> {
  if (typeof input === "string") {
    return prefix ? { [prefix]: input } : {}
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {}
  }

  return Object.entries(input).reduce<Record<string, string>>((acc, [key, value]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    Object.assign(acc, flattenMessages(value, nextPrefix))
    return acc
  }, {})
}

const DEFAULT_EN_STRINGS = flattenMessages(enMessages)
const DEFAULT_AR_STRINGS = flattenMessages(arMessages)

export const DEFAULT_SITE_COPY: SiteCopyMap = Object.keys(DEFAULT_EN_STRINGS)
  .sort((a, b) => a.localeCompare(b))
  .reduce<SiteCopyMap>((acc, key) => {
    acc[key] = {
      key,
      en: DEFAULT_EN_STRINGS[key] ?? "",
      ar: DEFAULT_AR_STRINGS[key] ?? DEFAULT_EN_STRINGS[key] ?? "",
      translation_status: "synced",
      translation_model: "manual-default",
    }
    return acc
  }, {})

const fetchSiteContentCached = unstable_cache(
  async () => {
    if (!hasConvexEnv()) {
      return {
        data: null,
        errorMessage: null,
      }
    }

    try {
      const data = await fetchConvexQuery(api.siteContent.listPublic, {})
      return {
        data,
        errorMessage: null,
      }
    } catch (error) {
      return {
        data: null,
        errorMessage: error instanceof Error ? error.message : "Failed to fetch site content",
      }
    }
  },
  ["site-content:v1"],
  { revalidate: 60, tags: [SITE_COPY_CACHE_TAG] }
)

export function mergeSiteCopyEntries(entries: SiteContentEntry[] = []) {
  const merged: SiteCopyMap = { ...DEFAULT_SITE_COPY }

  for (const entry of entries) {
    merged[entry.key] = {
      ...(merged[entry.key] ?? {
        key: entry.key,
        en: entry.en,
        ar: entry.ar,
      }),
      ...entry,
    }
  }

  return merged
}

export function getSiteCopyText(copy: SiteCopyMap, locale: SupportedLocale, key: string) {
  const entry = copy[key]
  if (!entry) {
    return key
  }

  return locale === "ar" ? entry.ar || entry.en : entry.en
}

export async function fetchPublicSiteCopy(): Promise<{ data: SiteCopyMap; error: string | null }> {
  const { data, errorMessage } = await fetchSiteContentCached()

  if (!data) {
    return {
      data: { ...DEFAULT_SITE_COPY },
      error: errorMessage,
    }
  }

  return {
    data: mergeSiteCopyEntries(data),
    error: null,
  }
}

export async function fetchAdminSiteCopyEntries(): Promise<{
  data: SiteContentEntry[]
  error: string | null
}> {
  if (!hasConvexEnv()) {
    return {
      data: Object.values(DEFAULT_SITE_COPY),
      error: "Convex is not configured",
    }
  }

  try {
    const data = await fetchConvexAuthQuery(api.siteContent.listAdmin, {})
    const merged = mergeSiteCopyEntries(data)
    return {
      data: Object.values(merged).sort((a, b) => a.key.localeCompare(b.key)),
      error: null,
    }
  } catch (error) {
    return {
      data: Object.values(DEFAULT_SITE_COPY),
      error: error instanceof Error ? error.message : "Failed to fetch site content",
    }
  }
}
