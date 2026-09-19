import type { Project, StackGrade, StackItem } from "@/types/database";

export type ProjectTool = { name: string; grade?: StackGrade };
export type SpotlightProject = Project & {
  sector: string;
  commits: number;
  visits: number;
  growth: number;
};

export function buildCode(id: number) {
  return `BUILD_${String(id).padStart(2, "0")}`;
}

export function hasSpotlightData(project: Project): project is SpotlightProject {
  return Boolean(project.sector?.trim()) &&
    typeof project.commits === "number" && Number.isFinite(project.commits) && project.commits >= 0 &&
    typeof project.visits === "number" && Number.isFinite(project.visits) && project.visits >= 0 &&
    typeof project.growth === "number" && Number.isFinite(project.growth);
}

export function gradeSegments(grade?: StackGrade) {
  return ({ A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 } as const)[grade as StackGrade] ?? 0;
}

export function formatVisits(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(value);
}

// Catalog IDs are authoritative, including when project text is translated.
// Legacy projects without catalog links are matched by name, never given a default grade.
export function projectTools(project: Project, catalog: StackItem[]): ProjectTool[] {
  const linked = (project.stackItemIds ?? []).flatMap((id) => {
    const item = catalog.find((entry) => entry.id === id);
    return item ? [{ name: item.name, grade: item.grade }] : [];
  });
  if (linked.length) return linked;
  const names = [...new Set([...project.aiSkills, ...project.tools])];
  return names.map((name) => ({
    name,
    grade: catalog.find((item) => item.name.toLowerCase() === name.toLowerCase())?.grade,
  }));
}

export function projectLaunchUrl(project: Project) {
  if (project.status === "planning" || !project.url?.trim()) return null;
  const input = project.url.trim();
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
