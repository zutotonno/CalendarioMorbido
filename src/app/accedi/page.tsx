import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AuthForm from "@/components/auth/AuthForm";
import { signIn } from "@/lib/actions/auth";
import { getUser } from "@/lib/auth/require-user";

export default async function AccediPage() {
  if (await getUser()) redirect("/calendario");
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="mb-1 font-head text-4xl font-bold">{t("loginTitle")}</h1>
      <p className="mb-6 font-body text-ink-soft">{t("loginSubtitle")}</p>
      <AuthForm action={signIn} submitLabel={t("login")} />
      <p className="mt-4 font-body text-sm text-ink-soft">
        {t("noAccount")}{" "}
        <Link href="/registrati" className="text-accent-deep underline">
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
