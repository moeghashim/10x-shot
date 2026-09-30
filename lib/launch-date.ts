// Preserve month-only precision; launch dates are never viewer-local timestamps.
export function isLaunchDate(value: string): boolean {
  if (!/^\d{4}-\d{2}(-\d{2})?$/.test(value) || value.startsWith("0000")) return false;
  const calendarDate = value.length === 7 ? `${value}-01` : value;
  const date = new Date(`${calendarDate}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === calendarDate;
}

export function formatLaunchDate(value?: string, locale = "en"): string {
  if (!value || !isLaunchDate(value)) return locale === "ar" ? "يُحدد لاحقاً" : "TBA";
  const monthOnly = value.length === 7;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: monthOnly ? undefined : "numeric",
    month: monthOnly ? "long" : "short",
    year: "numeric",
    calendar: "gregory",
    numberingSystem: "latn",
    timeZone: "UTC",
  }).format(new Date(`${monthOnly ? `${value}-01` : value}T00:00:00.000Z`));
}

export function sortProjectsByLaunchDate<T extends { id: number; launchDate?: string }>(
  projects: readonly T[],
  now = new Date(),
): T[] {
  const today = now.toISOString().slice(0, 10);
  return projects.map((project) => {
    const date = project.launchDate && isLaunchDate(project.launchDate) ? project.launchDate : "";
    // A month-only date retains its precision. Future launches remain below
    // launches that have already happened; missing dates come last.
    const group = !date ? 2 : date <= today.slice(0, date.length) ? 0 : 1;
    return { project, date, group };
  }).sort((a, b) => {
    if (a.group !== b.group) return a.group - b.group;
    const dateOrder = a.group === 0 ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    return dateOrder || a.project.id - b.project.id;
  }).map(({ project }) => project);
}
