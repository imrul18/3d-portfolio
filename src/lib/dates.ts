const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Formats `YYYY` or `YYYY-MM` without relying on the runtime locale, so
 * server and client output always match.
 */
export function formatYearMonth(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const [year, month] = value.split("-");
  const monthIndex = month ? Number(month) - 1 : -1;
  return MONTHS[monthIndex] ? `${MONTHS[monthIndex]} ${year}` : year;
}

export function formatRange(start: string | undefined, end: string | undefined, presentLabel: string) {
  const from = formatYearMonth(start);
  const to = end ? formatYearMonth(end) : presentLabel;
  if (!from) return to;
  return `${from} – ${to}`;
}

/**
 * Length of a span in years and months, counting both the start and end
 * months, e.g. "3 yrs 1 mo". `end` defaults to `now` for current roles.
 */
export function formatDuration(start: string, end: string | undefined, now: Date): string {
  const [sy, sm = "1"] = start.split("-");
  const [ey, em] = end ? end.split("-") : [String(now.getFullYear()), String(now.getMonth() + 1)];
  const months = (Number(ey) - Number(sy)) * 12 + (Number(em ?? 12) - Number(sm)) + 1;
  if (months <= 0) return "";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo${rest > 1 ? "s" : ""}`].filter(Boolean);
  return parts.join(" ");
}
