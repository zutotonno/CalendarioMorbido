export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const LOCALE_COOKIE = "NEXT_LOCALE";

// Mappa la locale UI su un tag BCP47 per la formattazione di date/numeri.
export const BCP47: Record<Locale, string> = {
  it: "it-IT",
  en: "en-GB",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// Sceglie la locale supportata a partire da un header Accept-Language.
export function pickFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
