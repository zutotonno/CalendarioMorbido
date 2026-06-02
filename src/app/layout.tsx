import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CalendarioMorbido — Eventi cicloturistici in Italia",
  description:
    "Calendario degli eventi cicloturistici non competitivi in Italia. Scopri, salva e proponi pedalate.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-body">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ToastProvider>
            <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
              <Header />
              <main className="flex-1 px-4 pb-16 pt-4">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
