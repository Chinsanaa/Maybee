import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { displayFont, bodyFont } from "@/lib/fonts";
import { getBusinessInfo } from "@/lib/business-info";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const business = await getBusinessInfo();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: `${business.name} — ${t("heroTitle")}`,
      template: `%s — ${business.name}`,
    },
    description: locale === "en" ? business.description_en : business.description_mn,
    alternates: {
      languages: { mn: "/mn", en: "/en" },
    },
    openGraph: {
      siteName: business.name,
      locale: locale === "mn" ? "mn_MN" : "en_US",
      type: "website",
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const business = await getBusinessInfo();

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationJsonLd(business),
              websiteJsonLd(business, locale),
            ]),
          }}
        />
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-red focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <SiteHeader business={business} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter business={business} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
