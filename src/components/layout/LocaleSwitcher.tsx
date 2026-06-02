"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, LOCALE_COOKIE, type Locale } from "@/i18n/config";

export default function LocaleSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const active = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(l: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          disabled={pending}
          aria-pressed={active === l}
          className={`rounded px-1.5 py-0.5 text-xs uppercase transition-colors ${
            active === l
              ? "font-bold text-ink"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
