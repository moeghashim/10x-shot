import type { Project } from "@/types/database"

export type ProjectStatus = Project["status"]

const VALID_PROJECT_STATUSES: ProjectStatus[] = ["active", "planning", "completed"]

export function normalizeProjectStatus(status: unknown): ProjectStatus {
  if (typeof status === "string" && VALID_PROJECT_STATUSES.includes(status as ProjectStatus)) {
    return status as ProjectStatus
  }

  return "planning"
}

const PROJECT_STATUS_STYLES: Record<
  ProjectStatus,
  {
    badge: string
    icon: string
  }
> = {
  active: {
    badge: "border-[var(--status-active-border)] bg-[var(--status-active-bg)] text-[var(--status-active-text)]",
    icon: "text-[var(--status-active-text)]",
  },
  planning: {
    badge: "border-[var(--status-planning-border)] bg-[var(--status-planning-bg)] text-[var(--status-planning-text)]",
    icon: "text-[var(--status-planning-text)]",
  },
  completed: {
    badge: "border-[var(--status-completed-border)] bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]",
    icon: "text-[var(--status-completed-text)]",
  },
}

export function getProjectStatusStyles(status: unknown) {
  const normalizedStatus = normalizeProjectStatus(status)

  return {
    status: normalizedStatus,
    ...PROJECT_STATUS_STYLES[normalizedStatus],
  }
}
