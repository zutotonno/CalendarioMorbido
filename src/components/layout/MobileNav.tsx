"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

export default function MobileNav({
  authed,
  admin,
}: {
  authed: boolean;
  admin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <div className="relative sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("menu")}
        aria-expanded={open}
        className="chip text-lg leading-none"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <>
          {/* backdrop per chiudere al tap fuori */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <nav className="absolute right-0 z-20 mt-2 flex w-52 flex-col gap-1 rounded-card border border-line bg-paper p-2 font-body text-sm shadow-md">
            <div onClick={() => setOpen(false)} className="flex flex-col gap-1">
              {authed ? (
                <>
                  <Link href="/calendario" className="rounded-lg px-3 py-2 hover:bg-paper-soft">
                    {t("myCalendar")}
                  </Link>
                  <Link href="/proponi" className="rounded-lg px-3 py-2 hover:bg-paper-soft">
                    {t("propose")}
                  </Link>
                  {admin && (
                    <Link href="/gestore" className="rounded-lg px-3 py-2 hover:bg-paper-soft">
                      {t("manageArea")}
                    </Link>
                  )}
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full rounded-lg px-3 py-2 text-left hover:bg-paper-soft"
                    >
                      {t("logout")}
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/accedi" className="rounded-lg px-3 py-2 hover:bg-paper-soft">
                  {t("login")}
                </Link>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-line px-3 pt-2 text-ink-soft">
              <span>{t("language")}</span>
              <LocaleSwitcher />
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
