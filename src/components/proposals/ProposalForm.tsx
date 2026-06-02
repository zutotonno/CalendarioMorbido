"use client";

import { useTranslations } from "next-intl";
import EventForm from "@/components/events/EventForm";
import { submitProposal } from "@/lib/actions/proposals";

export default function ProposalForm({ userId }: { userId: string }) {
  const t = useTranslations("propose");
  return (
    <EventForm
      userId={userId}
      action={submitProposal}
      submitLabel={t("submit")}
    />
  );
}
