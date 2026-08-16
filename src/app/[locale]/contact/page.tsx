import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBusinessInfo, getStoreLocations, formatHoursSummary } from "@/lib/business-info";
import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { InstagramIcon, FacebookIcon } from "@/components/icons/social-icons";
import { Phone, MapPin, Clock } from "lucide-react";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Contact Us" : "Холбоо барих",
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage() {
  const [locale, t, business, locations] = await Promise.all([
    getLocale(),
    getTranslations("contact"),
    getBusinessInfo(),
    getStoreLocations(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/contact" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-5">
          <p className="flex items-center gap-3 text-brand-ink">
            <Phone className="h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <a href={`tel:${business.phone.replace(/\s+/g, "")}`} data-analytics-event="click_phone">
              {business.phone}
            </a>
          </p>

          {locations.map((location) => (
            <div key={location.id} className="rounded-card border border-brand-gray-light p-4">
              <p className="font-semibold text-brand-ink">
                {localized(location.name_mn, location.name_en, locale)}
              </p>
              <p className="mt-2 flex items-start gap-3 text-sm text-brand-ink">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden />
                <Link href={`/store/${location.slug}`} className="hover:text-brand-red">
                  {localized(location.address_mn, location.address, locale) || location.address}
                </Link>
              </p>
              <p className="mt-1 flex items-start gap-3 text-sm text-brand-ink">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden />
                {formatHoursSummary(location.hours, locale)}
              </p>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            {business.instagram_url && (
              <a
                href={business.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="click_instagram"
                className="rounded-full border border-brand-gray-light p-2 hover:border-brand-red hover:text-brand-red"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {business.facebook_url && (
              <a
                href={business.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-event="click_facebook"
                className="rounded-full border border-brand-gray-light p-2 hover:border-brand-red hover:text-brand-red"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
