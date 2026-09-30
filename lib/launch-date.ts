// Launch dates are calendar dates, never timestamps in the viewer's timezone.
export function isLaunchDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function formatLaunchDate(value?: string, locale = "en"): string {
  if (!value || !isLaunchDate(value)) return locale === "ar" ? "يُحدد لاحقاً" : "TBA";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    calendar: "gregory",
    numberingSystem: "latn",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
