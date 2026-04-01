"use client"

import { useMemo, useState } from "react"
import { Save, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSiteCopy } from "@/hooks/use-site-copy"

function getStatusLabel(status?: string) {
  switch (status) {
    case "synced":
      return "Synced"
    case "failed":
      return "Fallback Used"
    case "pending":
      return "Pending"
    default:
      return "Default"
  }
}

export function SiteCopyManager() {
  const { entries, loading, saveEntry } = useSiteCopy()
  const [search, setSearch] = useState("")
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [isBackfilling, setIsBackfilling] = useState(false)

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return entries
    }

    return entries.filter((entry) => entry.key.toLowerCase().includes(query) || entry.en.toLowerCase().includes(query))
  }, [entries, search])

  if (loading) {
    return <div className="py-8 text-center text-gray-600">Loading site copy...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Copy</h2>
          <p className="text-gray-600">Edit English source copy. Arabic is generated automatically on save.</p>
        </div>
        <div className="flex w-full flex-col gap-3 md:max-w-xl md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Search by key or English copy"
            />
          </div>
          <Button
            variant="outline"
            disabled={isBackfilling}
            onClick={async () => {
              setIsBackfilling(true)
              try {
                const response = await fetch("/api/admin/translations/backfill", {
                  method: "POST",
                })
                const result = await response.json()

                if (!response.ok) {
                  throw new Error(result.error || "Failed to backfill translations")
                }

                window.alert(
                  `Backfill complete. Projects: ${result.data.projects}, Global metrics: ${result.data.globalMetrics}, Failures: ${result.data.projectFailures + result.data.metricFailures}`
                )
              } catch (error) {
                window.alert(error instanceof Error ? error.message : "Failed to backfill translations")
              } finally {
                setIsBackfilling(false)
              }
            }}
          >
            {isBackfilling ? "Backfilling..." : "Backfill Existing Content"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const draft = drafts[entry.key] ?? entry.en
          const changed = draft !== entry.en

          return (
            <Card key={entry.key}>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="break-all text-base text-gray-900">{entry.key}</CardTitle>
                    <CardDescription className="mt-2">
                      Arabic preview updates automatically after the English source is saved.
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{getStatusLabel(entry.translation_status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">English source</label>
                    <Textarea
                      value={draft}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [entry.key]: event.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Arabic preview</label>
                    <Textarea value={entry.ar} rows={4} readOnly className="bg-gray-50" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-gray-500">
                    {entry.translation_model ? `Model: ${entry.translation_model}` : "Using default seeded translation"}
                  </p>
                  <Button
                    onClick={async () => {
                      const result = await saveEntry({ key: entry.key, en: draft })
                      if (result.success) {
                        setDrafts((current) => {
                          const next = { ...current }
                          delete next[entry.key]
                          return next
                        })
                      } else if (result.error) {
                        window.alert(result.error)
                      }
                    }}
                    disabled={!changed}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save and Translate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
