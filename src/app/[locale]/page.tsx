import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getBusinessInfo } from "@/lib/business-info";
import {
  getFeaturedCategories,
  getBestSellers,
  getNewArrivals,
  getFeaturedProducts,
} from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { MapPin, Phone, Clock, ShieldCheck, Gift, Store } from "lucide-react";
import { formatHoursSummary } from "@/lib/business-info";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

const AGE_BANDS = [
  { labelMn: "0-2 нас", labelEn: "0-2 yrs", min: 0 },
  { labelMn: "2-3 нас", labelEn: "2-3 yrs", min: 24 },
  { labelMn: "3-5 нас", labelEn: "3-5 yrs", min: 36 },
  { labelMn: "5-7 нас", labelEn: "5-7 yrs", min: 60 },
  { labelMn: "7-10 нас", labelEn: "7-10 yrs", min: 84 },
  { labelMn: "10+ нас", labelEn: "10+ yrs", min: 120 },
];

const BUDGET_BANDS = [
  { labelMn: "20,000₮ хүртэл", labelEn: "Under 20,000₮", max: 20000 },
  { labelMn: "30,000₮ хүртэл", labelEn: "Under 30,000₮", max: 30000 },
  { labelMn: "50,000₮ хүртэл", labelEn: "Under 50,000₮", max: 50000 },
  { labelMn: "100,000₮ хүртэл", labelEn: "Under 100,000₮", max: 100000 },
];

export default async function HomePage() {
  const locale = await getLocale();
  const [t, business, categories, bestSellers, newArrivals, featured] = await Promise.all([
    getTranslations("home"),
    getBusinessInfo(),
    getFeaturedCategories(),
    getBestSellers(),
    getNewArrivals(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="bg-brand-red">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:py-24">
          <h1 className="font-display max-w-xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-lg text-base text-white/90 md:text-lg">{t("heroSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-red hover:bg-brand-cream"
            >
              {t("ctaShop")}
            </Link>
            <Link
              href="/shop?filter=featured"
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              {t("ctaGifts")}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Featured categories */}
        {categories.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-brand-ink">
              {t("featuredCategories")}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop/${locale === "en" && c.slug_en ? c.slug_en : c.slug_mn}`}
                  className="group flex flex-col items-center gap-3 rounded-card border border-brand-gray-light bg-white p-4 text-center transition-shadow hover:shadow-md"
                >
                  <span className="relative block h-20 w-20 overflow-hidden rounded-full bg-brand-cream">
                    {c.image_url ? (
                      <Image src={c.image_url} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <Gift className="absolute inset-0 m-auto h-8 w-8 text-brand-red" aria-hidden />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-brand-ink group-hover:text-brand-red">
                    {localized(c.name_mn, c.name_en, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Best sellers */}
        {bestSellers.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-brand-ink">{t("bestSellers")}</h2>
              <Link href="/shop?filter=bestseller" className="text-sm font-semibold text-brand-red">
                {t("viewAll")}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* New arrivals */}
        {newArrivals.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-brand-ink">{t("newArrivals")}</h2>
              <Link href="/shop?filter=new" className="text-sm font-semibold text-brand-red">
                {t("viewAll")}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* Shop by age */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-brand-ink">{t("shopByAge")}</h2>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {AGE_BANDS.map((band) => (
              <Link
                key={band.min}
                href={`/shop?age=${band.min}`}
                className="rounded-full border border-brand-gray-light bg-white px-3 py-2 text-center text-sm font-semibold text-brand-ink hover:border-brand-red hover:text-brand-red"
              >
                {localized(band.labelMn, band.labelEn, locale)}
              </Link>
            ))}
          </div>
        </section>

        {/* Shop by budget */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold text-brand-ink">{t("shopByBudget")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BUDGET_BANDS.map((band) => (
              <Link
                key={band.max}
                href={`/shop?maxPrice=${band.max}`}
                className="rounded-full border border-brand-gray-light bg-white px-3 py-2 text-center text-sm font-semibold text-brand-ink hover:border-brand-red hover:text-brand-red"
              >
                {localized(band.labelMn, band.labelEn, locale)}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-brand-ink">
              {t("featuredProducts")}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* Why Maybee */}
        <section className="mt-14 rounded-card bg-white p-8">
          <h2 className="font-display text-2xl font-bold text-brand-ink">{t("whyMaybeeTitle")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-start gap-2">
              <Store className="h-6 w-6 text-brand-red" aria-hidden />
              <p className="text-sm text-brand-gray">
                {locale === "en"
                  ? "A physical store in Ulaanbaatar you can visit."
                  : "Улаанбаатар хотод биечлэн зочилж болох дэлгүүртэй."}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <ShieldCheck className="h-6 w-6 text-brand-red" aria-hidden />
              <p className="text-sm text-brand-gray">
                {locale === "en"
                  ? "Carefully selected, age-appropriate products."
                  : "Нас насанд тохирсон, сайтар шалгарсан бүтээгдэхүүн."}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Gift className="h-6 w-6 text-brand-red" aria-hidden />
              <p className="text-sm text-brand-gray">
                {locale === "en"
                  ? "Easy gift shopping for every age and budget."
                  : "Нас, төсөвт тохирсон бэлгийг хялбар сонгох боломж."}
              </p>
            </div>
          </div>
        </section>

        {/* Store section */}
        <section className="mt-14 grid gap-6 rounded-card bg-brand-charcoal p-8 text-white md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("storeTitle")}</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {business.address}
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {formatHoursSummary(business.hours, locale)}
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <a href={`tel:${business.phone.replace(/\s+/g, "")}`} data-analytics-event="click_phone">
                  {business.phone}
                </a>
              </li>
            </ul>
            <Link
              href="/store/next-plaza"
              className="mt-6 inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
            >
              {locale === "en" ? "Get Directions" : "Чиглэл харах"}
            </Link>
          </div>
          {business.google_maps_embed_url && (
            <iframe
              title="Maybee Pop & Joy — Google Maps"
              src={business.google_maps_embed_url}
              className="h-64 w-full rounded-card border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </section>
      </div>
    </div>
  );
}
