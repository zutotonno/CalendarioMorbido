import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AuthForm from "@/components/auth/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { getUser } from "@/lib/auth/require-user";

export default async function RegistratiPage() {
  if (await getUser()) redirect("/calendario");
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="mb-1 font-head text-4xl font-bold">{t("registerTitle")}</h1>
      <p className="mb-6 font-body text-ink-soft">{t("registerSubtitle")}</p>
      <AuthForm action={signUp} submitLabel={t("createAccount")} />
      <p className="mt-4 font-body text-sm text-ink-soft">
        {t("haveAccount")}{" "}
        <Link href="/accedi" className="text-accent-deep underline">
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
