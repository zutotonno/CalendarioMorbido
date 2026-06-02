import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth/require-user";
import ProposalForm from "@/components/proposals/ProposalForm";

export default async function ProponiPage() {
  const user = await requireUser();
  const t = await getTranslations("propose");

  return (
    <div className="mx-auto max-w-xl py-4">
      <h1 className="mb-1 font-head text-4xl font-bold leading-none">
        {t("title")}
      </h1>
      <p className="mb-4 font-body text-ink-soft">{t("subtitle")}</p>
      <ProposalForm userId={user.id} />
    </div>
  );
}
