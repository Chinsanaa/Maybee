import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBusinessInfo, getStoreLocations, formatHoursSummary } from "@/lib/business-info";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { MapPin, Clock } from "lucide-react";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const business = await getBusinessInfo();
  return {
    title: locale === "en" ? `${business.name} — Store Locations` : `${business.name} — Дэлгүүрийн байршил`,
    alternates: { canonical: `/${locale}/store` },
  };
}

export default async function StoreIndexPage() {
  const [locale, t, business, locations] = await Promise.all([
    getLocale(),
    getTranslations("store"),
    getBusinessInfo(),
    getStoreLocations(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/store" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">
        {locale === "en" ? `${business.name} Locations` : `${business.name} дэлгүүрүүд`}
      </h1>
      <p className="mt-2 text-sm text-brand-gray">
        {locale === "en"
          ? "Visit us at either of our Ulaanbaatar locations."
          : "Улаанбаатар хотын аль ч дэлгүүрт зочилно уу."}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {locations.map((location) => (
          <Link
            key={location.id}
            href={`/store/${location.slug}`}
            className="block rounded-card border border-brand-gray-light bg-white p-6 hover:shadow-md"
          >
            <h2 className="font-display text-xl font-bold text-brand-ink">
              {localized(location.name_mn, location.name_en, locale)}
            </h2>
            <p className="mt-3 flex items-start gap-2 text-sm text-brand-ink">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden />
              {localized(location.address_mn, location.address, locale) || location.address}
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-brand-gray">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden />
              {formatHoursSummary(location.hours, locale)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
