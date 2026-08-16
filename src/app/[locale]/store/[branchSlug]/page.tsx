import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getBusinessInfo, getStoreLocationBySlug, getStoreLocations, formatHoursSummary } from "@/lib/business-info";
import { localBusinessJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { MapPin, Phone, Clock } from "lucide-react";

const DAY_LABELS_MN: Record<string, string> = {
  mon: "Даваа", tue: "Мягмар", wed: "Лхагва", thu: "Пүрэв", fri: "Баасан", sat: "Бямба", sun: "Ням",
};
const DAY_LABELS_EN: Record<string, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
};
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateStaticParams() {
  const locations = await getStoreLocations();
  return locations.map((l) => ({ branchSlug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branchSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { branchSlug, locale } = await params;
  const [business, location] = await Promise.all([
    getBusinessInfo(),
    getStoreLocationBySlug(branchSlug),
  ]);
  if (!location) return {};

  const name = localized(location.name_mn, location.name_en, locale);
  return {
    title: `${business.name} — ${name}`,
    description:
      locale === "en"
        ? `Visit ${business.name} at ${location.address}. Opening hours, phone, and directions.`
        : `${business.name} дэлгүүр ${location.address_mn || location.address}-т байрладаг. Ажиллах цаг, утас, чиглэл.`,
    alternates: { canonical: `/${locale}/store/${branchSlug}` },
  };
}

export default async function StoreBranchPage({
  params,
}: {
  params: Promise<{ branchSlug: string }>;
}) {
  const { branchSlug } = await params;
  const [locale, t, business, location] = await Promise.all([
    getLocale(),
    getTranslations("store"),
    getBusinessInfo(),
    getStoreLocationBySlug(branchSlug),
  ]);

  if (!location) notFound();

  const name = localized(location.name_mn, location.name_en, locale);
  const address = localized(location.address_mn, location.address, locale) || location.address;
  const dayLabels = locale === "en" ? DAY_LABELS_EN : DAY_LABELS_MN;
  const mapsDirectionsUrl = location.latitude && location.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const phone = location.phone || business.phone;

  const faqs =
    locale === "en"
      ? [
          { q: `Where is ${name} located?`, a: `${address}.` },
          { q: "What are the store's opening hours?", a: formatHoursSummary(location.hours, locale) },
          {
            q: "Can I call the store before visiting?",
            a: phone ? `Yes, call ${phone}.` : "Contact details are available on our Contact page.",
          },
        ]
      : [
          { q: `${name} хаана байрладаг вэ?`, a: `${address}.` },
          { q: "Дэлгүүрийн ажиллах цаг хэд вэ?", a: formatHoursSummary(location.hours, locale) },
          {
            q: "Очихын өмнө утсаар холбогдож болох уу?",
            a: phone ? `Тийм ээ, ${phone} дугаараар холбогдоно уу.` : "Холбоо барих мэдээллийг Contact хуудаснаас харна уу.",
          },
        ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            localBusinessJsonLd(location, business, locale),
            breadcrumbJsonLd([
              { name: locale === "en" ? "Home" : "Нүүр", url: `/${locale}` },
              { name: t("title"), url: `/${locale}/store` },
              { name, url: `/${locale}/store/${branchSlug}` },
            ]),
          ]),
        }}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/store" },
          { name, href: `/store/${branchSlug}` },
        ]}
      />

      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{name}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-card border border-brand-gray-light bg-white p-6">
          <p className="flex items-start gap-3 text-brand-ink">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <span>
              <span className="block font-semibold">{t("address")}</span>
              {address}
            </span>
          </p>
          <p className="flex items-start gap-3 text-brand-ink">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <span className="block">
              <span className="block font-semibold">{t("hours")}</span>
              <span className="block text-sm text-brand-gray">
                {DAY_ORDER.map((d) =>
                  location.hours[d] ? (
                    <span key={d} className="block">
                      {dayLabels[d]}: {location.hours[d]!.open}–{location.hours[d]!.close}
                    </span>
                  ) : null
                )}
              </span>
            </span>
          </p>
          {phone && (
            <p className="flex items-start gap-3 text-brand-ink">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden />
              <span>
                <span className="block font-semibold">{t("phone")}</span>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} data-analytics-event="click_phone">
                  {phone}
                </a>
              </span>
            </p>
          )}
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="click_directions"
            className="mt-2 inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
          >
            {t("directions")}
          </a>
        </div>

        <div className="overflow-hidden rounded-card border border-brand-gray-light">
          {location.google_maps_embed_url ? (
            <iframe
              title={`${name} — Google Maps`}
              src={location.google_maps_embed_url}
              className="h-full min-h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center bg-brand-cream p-6 text-center text-sm text-brand-gray">
              {locale === "en"
                ? "Map embed not configured yet — add a Google Maps embed URL in Site Settings."
                : "Газрын зураг тохируулагдаагүй байна — админ тохиргооноос Google Maps линк нэмнэ үү."}
            </div>
          )}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-brand-ink">{t("faqTitle")}</h2>
        <dl className="mt-4 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-semibold text-brand-ink">{faq.q}</dt>
              <dd className="mt-1 text-sm text-brand-gray">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
