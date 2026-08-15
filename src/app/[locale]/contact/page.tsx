import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getBusinessInfo, formatHoursSummary } from "@/lib/business-info";
import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { InstagramIcon, FacebookIcon } from "@/components/icons/social-icons";
import { Phone, MapPin, Clock } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Contact Us" : "Холбоо барих",
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage() {
  const [locale, t, business] = await Promise.all([
    getLocale(),
    getTranslations("contact"),
    getBusinessInfo(),
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
        <div className="space-y-4">
          <p className="flex items-center gap-3 text-brand-ink">
            <Phone className="h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            <a href={`tel:${business.phone.replace(/\s+/g, "")}`} data-analytics-event="click_phone">
              {business.phone}
            </a>
          </p>
          <p className="flex items-center gap-3 text-brand-ink">
            <MapPin className="h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            {business.address}
          </p>
          <p className="flex items-center gap-3 text-brand-ink">
            <Clock className="h-5 w-5 shrink-0 text-brand-red" aria-hidden />
            {formatHoursSummary(business.hours, locale)}
          </p>
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
