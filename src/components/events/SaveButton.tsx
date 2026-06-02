"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { saveEvent, unsaveEvent } from "@/lib/actions/saved-events";
import { useToast } from "@/components/ui/Toast";

export default function SaveButton({
  eventId,
  initialSaved,
}: {
  eventId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();
  const t = useTranslations("save");

  function toggle() {
    startTransition(async () => {
      const res = saved ? await unsaveEvent(eventId) : await saveEvent(eventId);
      if (res.error) {
        showToast(res.error, "error");
        return;
      }
      setSaved(!saved);
      showToast(saved ? t("toastRemoved") : t("toastSaved"), "success");
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`btn w-full ${saved ? "btn-ghost" : "btn-primary"} disabled:opacity-60`}
    >
      {pending ? t("loading") : saved ? t("saved") : t("add")}
    </button>
  );
}
