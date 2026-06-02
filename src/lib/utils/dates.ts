import { BCP47, type Locale } from "@/i18n/config";

// Le date arrivano come "YYYY-MM-DD"; le interpretiamo come date locali (no UTC shift).
function parse(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function isSingleDay(start: string, end: string): boolean {
  return start === end;
}

export function formatLongDate(dateStr: string, locale: Locale = "it"): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parse(dateStr));
}

// Es. "12 settembre 2026" oppure "12 – 14 settembre 2026" / "12 set – 3 ott 2026"
export function formatDateRange(
  start: string,
  end: string,
  locale: Locale = "it",
): string {
  if (isSingleDay(start, end)) return formatLongDate(start, locale);
  const s = parse(start);
  const e = parse(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} – ${formatLongDate(end, locale)}`;
  }
  const shortFmt = new Intl.DateTimeFormat(BCP47[locale], {
    day: "numeric",
    month: "short",
  });
  return `${shortFmt.format(s)} – ${formatLongDate(end, locale)}`;
}
