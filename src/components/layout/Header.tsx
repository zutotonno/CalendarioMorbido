import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getUser, isAdmin } from "@/lib/auth/require-user";
import MobileNav from "@/components/layout/MobileNav";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

export default async function Header() {
  const user = await getUser();
  const admin = user ? await isAdmin() : false;
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <Link
          href="/"
          className="font-head text-xl font-bold leading-none sm:text-2xl"
        >
          CalendarioMorbido
          <span className="ml-1 align-middle text-accent-deep">🚲</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-3 font-body text-sm sm:flex">
          {user ? (
            <>
              <Link href="/calendario" className="hover:text-accent-deep">
                {t("myCalendar")}
              </Link>
              <Link href="/proponi" className="hover:text-accent-deep">
                {t("proposeShort")}
              </Link>
              {admin && (
                <Link href="/gestore" className="hover:text-accent-deep">
                  {t("manage")}
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button className="chip" type="submit">
                  {t("logout")}
                </button>
              </form>
            </>
          ) : (
            <Link href="/accedi" className="chip chip-active">
              {t("login")}
            </Link>
          )}
          <LocaleSwitcher className="border-l border-line pl-2" />
        </nav>

        {/* Mobile nav */}
        <MobileNav authed={!!user} admin={admin} />
      </div>
    </header>
  );
}
