import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Phone, MapPin, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/social-icons";
import type { BusinessInfo } from "@/lib/business-info";
import { getStoreLocations, formatHoursSummary } from "@/lib/business-info";
import { getLocale } from "next-intl/server";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function SiteFooter({ business }: { business: BusinessInfo }) {
  const [t, locale, locations] = await Promise.all([
    getTranslations("footer"),
    getLocale(),
    getStoreLocations(),
  ]);

  return (
    <footer className="mt-16 border-t border-brand-gray-light bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg font-extrabold text-brand-ink">{t("aboutTitle")}</p>
          <p className="mt-2 text-sm text-brand-gray">
            {locale === "en" ? business.description_en || t("aboutText") : business.description_mn || t("aboutText")}
          </p>
          <div className="mt-4 flex gap-3">
            {business.instagram_url && (
              <a
                href={business.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-analytics-event="click_instagram"
                className="rounded-full border border-brand-gray-light p-2 hover:border-brand-red hover:text-brand-red"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {business.facebook_url && (
              <a
                href={business.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-analytics-event="click_facebook"
                className="rounded-full border border-brand-gray-light p-2 hover:border-brand-red hover:text-brand-red"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-ink">
            {business.showcase_enabled ? t("shop") : t("explore")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-brand-gray">
            {business.showcase_enabled ? (
              <>
                <li><Link href="/shop" className="hover:text-brand-red">{t("shop")}</Link></li>
                <li><Link href="/shop?filter=new" className="hover:text-brand-red">New</Link></li>
                <li><Link href="/shop?filter=bestseller" className="hover:text-brand-red">Best Sellers</Link></li>
                <li><Link href="/gift-finder" className="hover:text-brand-red">Gift Finder</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/about" className="hover:text-brand-red">{t("about")}</Link></li>
                <li><Link href="/faq" className="hover:text-brand-red">{t("faq")}</Link></li>
                <li><Link href="/store" className="hover:text-brand-red">{t("storeLocation")}</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-ink">{t("help")}</p>
          <ul className="mt-3 space-y-2 text-sm text-brand-gray">
            <li><Link href="/blog" className="hover:text-brand-red">{t("blog")}</Link></li>
            <li><Link href="/faq" className="hover:text-brand-red">{t("faq")}</Link></li>
            <li><Link href="/policies/returns" className="hover:text-brand-red">{t("returns")}</Link></li>
            <li><Link href="/contact" className="hover:text-brand-red">{t("contact")}</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-brand-red">{t("privacy")}</Link></li>
            <li><Link href="/policies/terms" className="hover:text-brand-red">{t("terms")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-ink">{t("storeLocation")}</p>
          <ul className="mt-3 space-y-3 text-sm text-brand-gray">
            {locations.map((location) => (
              <li key={location.id}>
                <Link href={`/store/${location.slug}`} className="flex items-start gap-2 hover:text-brand-red">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    <span className="block font-medium text-brand-ink">
                      {localized(location.name_mn, location.name_en, locale)}
                    </span>
                    {localized(location.address_mn, location.address, locale) || location.address}
                  </span>
                </Link>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <a
                href={`tel:${business.phone.replace(/\s+/g, "")}`}
                className="hover:text-brand-red"
                data-analytics-event="click_phone"
              >
                {business.phone}
              </a>
            </li>
            {locations[0] && (
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{formatHoursSummary(locations[0].hours, locale)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-gray-light px-4 py-4 text-center text-xs text-brand-gray">
        © {new Date().getFullYear()} {business.name}. {t("copyright")}
      </div>
    </footer>
  );
}
