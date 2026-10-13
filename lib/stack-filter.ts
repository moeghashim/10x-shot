import type { PublicStackItem } from "./home/project-presentation"

export function stackProjectOptions(items: PublicStackItem[]) {
  const projects = new Map(items.flatMap((item) => item.projects.map((project) => [project.id, project] as const)))
  return [...projects.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export function filterStackByProject(items: PublicStackItem[], projectId: string) {
  return projectId ? items.filter((item) => item.projects.some((project) => String(project.id) === projectId)) : items
}
