import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-user";
import AdminProposalCard from "@/components/admin/AdminProposalCard";
import StatusBadge from "@/components/proposals/StatusBadge";
import { formatDateRange } from "@/lib/utils/dates";
import type { ProposalRow, ProposalStatus } from "@/lib/types/db";
import type { Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

const TAB_KEYS: Record<ProposalStatus, "tabPending" | "tabApproved" | "tabRejected"> = {
  pending: "tabPending",
  approved: "tabApproved",
  rejected: "tabRejected",
};
const TAB_ORDER: ProposalStatus[] = ["pending", "approved", "rejected"];

export default async function GestorePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const active: ProposalStatus =
    status === "approved" || status === "rejected" ? status : "pending";
  const t = await getTranslations("manage");
  const locale = (await getLocale()) as Locale;

  const supabase = await createClient();
  const { data } = await supabase
    .from("proposals")
    .select("*")
    .eq("status", active)
    .order("submitted_at", { ascending: true });

  const proposals = (data ?? []) as ProposalRow[];

  return (
    <div className="space-y-4">
      <h1 className="font-head text-4xl font-bold leading-none">
        {t("title")}
      </h1>
      <p className="font-body text-ink-soft">{t("subtitle")}</p>

      <div className="flex gap-2 border-b border-line">
        {TAB_ORDER.map((key) => (
          <Link
            key={key}
            href={`/gestore?status=${key}`}
            className={`-mb-px border-b-2 px-3 py-2 font-body ${
              active === key
                ? "border-accent-deep text-ink"
                : "border-transparent text-ink-soft"
            }`}
          >
            {t(TAB_KEYS[key])}
          </Link>
        ))}
      </div>

      {proposals.length === 0 ? (
        <p className="py-12 text-center font-body text-ink-soft">
          {t("empty")}
        </p>
      ) : active === "pending" ? (
        <ul className="space-y-3">
          {proposals.map((p) => (
            <AdminProposalCard key={p.id} proposal={p} />
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {proposals.map((p) => (
            <li key={p.id} className="card p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-head text-lg leading-tight">{p.title}</p>
                  <p className="font-body text-sm text-ink-soft">
                    {p.region} ·{" "}
                    {formatDateRange(p.start_date, p.end_date, locale)}
                  </p>
                  {p.status === "rejected" && p.rejection_reason && (
                    <p className="mt-1 font-body text-sm text-red-700">
                      {t("reason", { reason: p.rejection_reason })}
                    </p>
                  )}
                </div>
                <StatusBadge status={p.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
