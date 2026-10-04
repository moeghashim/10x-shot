import { formatLaunchDate, isLaunchDate } from "@/lib/launch-date";

export function LaunchDate({ value, locale = "en" }: { value?: string; locale?: string }) {
  const label = formatLaunchDate(value, locale);
  return value && isLaunchDate(value)
    ? <time dateTime={value}>{label}</time>
    : <span>{label}</span>;
}
