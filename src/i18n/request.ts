import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  isLocale,
  pickFromAcceptLanguage,
  type Locale,
} from "./config";

export default getRequestConfig(async () => {
  // Priorità: cookie scelto dall'utente → lingua di sistema (Accept-Language) → 'it'.
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  let locale: Locale;
  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const h = await headers();
    locale = pickFromAcceptLanguage(h.get("accept-language"));
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
