import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-line px-4 py-6 text-center font-body text-sm text-ink-soft">
      {t("tagline")}
    </footer>
  );
}
