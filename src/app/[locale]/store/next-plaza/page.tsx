import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getBusinessInfo, formatHoursSummary } from "@/lib/business-info";
import { localBusinessJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { MapPin, Phone, Clock } from "lucide-react";

const DAY_LABELS_MN: Record<string, string> = {
  mon: "Даваа", tue: "Мягмар", wed: "Лхагва", thu: "Пүрэв", fri: "Баасан", sat: "Бямба", sun: "Ням",
};
const DAY_LABELS_EN: Record<string, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
};
const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const business = await getBusinessInfo();
  return {
    title:
      locale === "en"
        ? `${business.name} — NEXT Plaza Store, Ulaanbaatar`
        : `${business.name} — NEXT Plaza дэлгүүр, Улаанбаатар`,
    description:
      locale === "en"
        ? `Visit ${business.name} at NEXT Plaza, Ard Ayush Avenue, Bayangol District, Ulaanbaatar. Opening hours, phone, and directions.`
        : `${business.name} дэлгүүр NEXT Plaza, Ард Аюуш өргөн чөлөө, Баянгол дүүрэгт байрладаг. Ажиллах цаг, утас, чиглэл.`,
    alternates: { canonical: `/${locale}/store/next-plaza` },
  };
}

export default async function StorePage() {
  const [locale, t, business] = await Promise.all([
    getLocale(),
    getTranslations("store"),
    getBusinessInfo(),
  ]);

  const dayLabels = locale === "en" ? DAY_LABELS_EN : DAY_LABELS_MN;
  const mapsDirectionsUrl = business.latitude && business.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;

  const faqs =
    locale === "en"
      ? [
          {
            q: "Where is Maybee Pop & Joy located?",
            a: `${business.address}.`,
          },
          {
            q: "What are the store's opening hours?",
            a: formatHoursSummary(business.hours, locale),
          },
          {
            q: "Can I call the store before visiting?",
            a: business.phone ? `Yes, call ${business.phone}.` : "Contact details are available on our Contact page.",
          },
        ]
      : [
          { q: "Maybee Pop & Joy хаана байрладаг вэ?", a: `${business.address}.` },
          { q: "Дэлгүүрийн ажиллах цаг хэд вэ?", a: formatHoursSummary(business.hours, locale) },
          {
            q: "Очихын өмнө утсаар холбогдож болох уу?",
            a: business.phone ? `Тийм ээ, ${business.phone} дугаараар холбогдоно уу.` : "Холбоо барих мэдээллийг Contact хуудаснаас харна уу.",
          },
        ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            localBusinessJsonLd(business),
            breadcrumbJsonLd([
              { name: locale === "en" ? "Home" : "Нүүр", url: `/${locale}` },
              { name: t("title"), url: `/${locale}/store/next-plaza` },
            ]),
          ]),
        }}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/store/next-plaza" },
        ]}
      />

      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-card border border-brand-gray-light bg-white p-6">
          <p className="flex items-start gap-3 text-brand-ink">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <span>
              <span className="block font-semibold">{t("address")}</span>
              {business.address}
            </span>
          </p>
          <p className="flex items-start gap-3 text-brand-ink">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <span className="block">
              <span className="block font-semibold">{t("hours")}</span>
              <span className="block text-sm text-brand-gray">
                {DAY_ORDER.map((d) =>
                  business.hours[d as keyof typeof business.hours] ? (
                    <span key={d} className="block">
                      {dayLabels[d]}: {business.hours[d as keyof typeof business.hours]!.open}–
                      {business.hours[d as keyof typeof business.hours]!.close}
                    </span>
                  ) : null
                )}
              </span>
            </span>
          </p>
          <p className="flex items-start gap-3 text-brand-ink">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <span>
              <span className="block font-semibold">{t("phone")}</span>
              <a href={`tel:${business.phone.replace(/\s+/g, "")}`} data-analytics-event="click_phone">
                {business.phone}
              </a>
            </span>
          </p>
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
          {business.google_maps_embed_url ? (
            <iframe
              title="Maybee Pop & Joy — Google Maps"
              src={business.google_maps_embed_url}
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
