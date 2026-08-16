import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import type { BusinessInfo } from "@/lib/business-info";

export async function SiteHeader({ business }: { business: BusinessInfo }) {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray-light bg-brand-cream/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="ml-4 hidden items-center gap-6 md:flex" aria-label="Main">
          {business.showcase_enabled && (
            <>
              <Link href="/shop" className="text-sm font-medium text-brand-ink hover:text-brand-red">
                {t("shop")}
              </Link>
              <Link
                href="/shop?filter=new"
                className="text-sm font-medium text-brand-ink hover:text-brand-red"
              >
                {t("newArrivals")}
              </Link>
              <Link
                href="/shop?filter=bestseller"
                className="text-sm font-medium text-brand-ink hover:text-brand-red"
              >
                {t("bestSellers")}
              </Link>
              <Link
                href="/gift-finder"
                className="text-sm font-medium text-brand-ink hover:text-brand-red"
              >
                Gift Finder
              </Link>
            </>
          )}
          <Link href="/about" className="text-sm font-medium text-brand-ink hover:text-brand-red">
            {t("about")}
          </Link>
          <Link
            href="/store"
            className="text-sm font-medium text-brand-ink hover:text-brand-red"
          >
            {t("store")}
          </Link>
        </nav>

        {business.showcase_enabled && (
          <div className="hidden flex-1 justify-center px-4 md:flex">
            <SearchBar className="w-full max-w-md" />
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <a
            href={`tel:${business.phone.replace(/\s+/g, "")}`}
            className="hidden rounded-full px-3 py-1.5 text-sm font-semibold text-brand-red hover:bg-brand-red/10 sm:inline-block"
            data-analytics-event="click_phone"
          >
            {business.phone}
          </a>
          <LanguageSwitcher />
          <MobileMenu showcaseEnabled={business.showcase_enabled} />
        </div>
      </div>
      {business.showcase_enabled && (
        <div className="border-t border-brand-gray-light px-4 py-2 md:hidden">
          <SearchBar />
        </div>
      )}
    </header>
  );
}
