import type { Project, StackGrade, StackItem, StackProjectReference } from "@/types/database";

export type PublicStackItem = Omit<StackItem, "id" | "grade"> & {
  id: string;
  grade?: StackGrade;
  projects: StackProjectReference[];
  usageCount: number;
};

// Build the public inventory from actual project assignments. Catalog records
// enrich ratings and notes; unused records remain available in the admin catalog.
export function buildPublicStack(projects: Project[], catalog: StackItem[]): PublicStackItem[] {
  const items = new Map<string, PublicStackItem>();
  const keyFor = (item: Pick<StackItem, "name" | "category">) => `${item.category}:${item.name.trim().toLowerCase()}`;
  const byId = new Map(catalog.map(item => [item.id, item]));
  const byName = new Map(catalog.map(item => [keyFor(item), item]));

  for (const project of projects) {
    const linked = (project.stackItemIds ?? []).flatMap(id => byId.has(id) ? [byId.get(id)!] : []);
    const assignments = linked.length ? linked : [
      ...project.tools.map(name => ({ name, category: "tool" as const })),
      ...project.aiSkills.map(name => ({ name, category: "ai_skill" as const })),
    ];
    for (const assignment of assignments) {
      const name = assignment.name.trim();
      if (!name) continue;
      const key = keyFor(assignment);
      const record = byName.get(key);
      let item = items.get(key);
      if (!item) {
        item = { ...record, id: key, name: record?.name ?? name, category: record?.category ?? assignment.category, projects: [], usageCount: 0 };
        items.set(key, item);
      }
      if (!item.projects.some(entry => entry.id === project.id)) {
        item.projects.push({ id: project.id, title: project.title, status: project.status, url: projectLaunchUrl(project) });
        item.usageCount = item.projects.length;
      }
    }
  }
  return [...items.values()].sort((a, b) => b.usageCount - a.usageCount || a.name.localeCompare(b.name));
}

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
