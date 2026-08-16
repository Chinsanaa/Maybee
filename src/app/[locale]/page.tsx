import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getBusinessInfo, getStoreLocations, formatHoursSummary } from "@/lib/business-info";
import {
  getFeaturedCategories,
  getBestSellers,
  getNewArrivals,
  getFeaturedProducts,
} from "@/lib/catalog";
import { getActiveFaqs } from "@/lib/faq";
import { getPublishedPosts } from "@/lib/blog";
import { AGE_BANDS, BUDGET_BANDS } from "@/lib/collections";
import { ProductCard } from "@/components/product/product-card";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock, ShieldCheck, Gift, Store, Sparkles } from "lucide-react";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export default async function HomePage() {
  const locale = await getLocale();
  const [t, business, locations] = await Promise.all([
    getTranslations("home"),
    getBusinessInfo(),
    getStoreLocations(),
  ]);

  const showcase = business.showcase_enabled;

  const [categories, bestSellers, newArrivals, featured, faqs, posts] = showcase
    ? await Promise.all([
        getFeaturedCategories(),
        getBestSellers(),
        getNewArrivals(),
        getFeaturedProducts(),
        Promise.resolve([]),
        Promise.resolve([]),
      ])
    : await Promise.all([
        Promise.resolve([]),
        Promise.resolve([]),
        Promise.resolve([]),
        Promise.resolve([]),
        getActiveFaqs(),
        getPublishedPosts(),
      ]);

  const aboutStory = localized(business.about_story_mn, business.about_story_en, locale);
  const aboutExcerpt = aboutStory.split("\n\n")[0] ?? "";

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
            {showcase ? (
              <>
                <Link
                  href="/shop"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-red hover:bg-brand-cream"
                >
                  {t("ctaShop")}
                </Link>
                <Link
                  href="/gift-finder"
                  className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  {t("ctaGifts")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-red hover:bg-brand-cream"
                >
                  {t("ctaLearnMore")}
                </Link>
                <Link
                  href="/blog"
                  className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  {t("ctaReadBlog")}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {showcase ? (
          <>
            {/* Featured categories */}
            {categories.length > 0 && (
              <section className="mt-16">
                <h2 className="font-display text-2xl font-bold text-brand-ink">
                  {t("featuredCategories")}
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop/${locale === "en" && c.slug_en ? c.slug_en : c.slug_mn}`}
                      className="group flex flex-col items-center gap-3 rounded-card border border-brand-gray-light bg-white p-4 text-center shadow-card transition-shadow hover:shadow-card-hover"
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
              <section className="mt-16">
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
              <section className="mt-16 rounded-card bg-brand-cream p-8">
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

            {/* Gift Finder */}
            <section className="mt-16 rounded-card bg-brand-honey/20 p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-brand-red" aria-hidden />
              <h2 className="font-display mt-3 text-2xl font-bold text-brand-ink">{t("giftFinderTitle")}</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-brand-gray">{t("giftFinderSubtitle")}</p>
              <Link
                href="/gift-finder"
                data-analytics-event="view_gift_finder"
                className="mt-5 inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
              >
                {t("giftFinderCta")}
              </Link>
            </section>

            {/* Shop by age */}
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold text-brand-ink">{t("shopByAge")}</h2>
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {AGE_BANDS.map((band) => (
                  <Link
                    key={band.slug}
                    href={`/gifts/age/${band.slug}`}
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
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {BUDGET_BANDS.map((band) => (
                  <Link
                    key={band.slug}
                    href={`/gifts/budget/${band.slug}`}
                    className="rounded-full border border-brand-gray-light bg-white px-3 py-2 text-center text-sm font-semibold text-brand-ink hover:border-brand-red hover:text-brand-red"
                  >
                    {localized(band.labelMn, band.labelEn, locale)}
                  </Link>
                ))}
              </div>
            </section>

            {/* Featured products */}
            {featured.length > 0 && (
              <section className="mt-16">
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
            <section className="mt-16 rounded-card bg-white p-8 shadow-card">
              <h2 className="font-display text-2xl font-bold text-brand-ink">{t("whyMaybeeTitle")}</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col items-start gap-2">
                  <Store className="h-6 w-6 text-brand-red" aria-hidden />
                  <p className="text-sm text-brand-gray">
                    {locale === "en"
                      ? "Two physical stores in Ulaanbaatar you can visit."
                      : "Улаанбаатар хотод биечлэн зочилж болох 2 дэлгүүртэй."}
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
          </>
        ) : (
          <>
            {/* About excerpt */}
            {aboutExcerpt && (
              <section className="mt-16">
                <Card padding="p-6" className="sm:p-8">
                  <h2 className="font-display text-2xl font-bold text-brand-ink">
                    {t("aboutExcerptTitle")}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-brand-gray">{aboutExcerpt}</p>
                  <Link href="/about" className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline">
                    {t("aboutExcerptCta")} →
                  </Link>
                </Card>
              </section>
            )}

            {/* FAQ teaser */}
            {faqs.length > 0 && (
              <section className="mt-16 rounded-card bg-brand-cream p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-brand-ink">{t("faqTeaserTitle")}</h2>
                <ul className="mt-4 space-y-2">
                  {faqs.slice(0, 3).map((faq) => (
                    <li key={faq.id}>
                      <Link href="/faq" className="text-sm font-medium text-brand-ink hover:text-brand-red">
                        {localized(faq.question_mn, faq.question_en, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/faq" className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline">
                  {t("faqTeaserCta")} →
                </Link>
              </section>
            )}

            {/* Blog previews */}
            {posts.length > 0 && (
              <section className="mt-16">
                <h2 className="font-display text-2xl font-bold text-brand-ink">{t("blogTeaserTitle")}</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  {posts.slice(0, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card padding="p-4" className="h-full transition-shadow hover:shadow-card-hover">
                        <h3 className="font-display font-bold text-brand-ink">
                          {localized(post.title_mn, post.title_en, locale)}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm text-brand-gray">
                          {localized(post.excerpt_mn, post.excerpt_en, locale)}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
                <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-brand-red hover:underline">
                  {t("blogTeaserCta")} →
                </Link>
              </section>
            )}
          </>
        )}

        {/* Store section */}
        <section className="mt-16 rounded-card bg-brand-charcoal p-8 text-white">
          <h2 className="font-display text-2xl font-bold">{t("storeTitle")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {locations.map((location) => (
              <div key={location.id} className="rounded-card bg-white/10 p-5">
                <h3 className="font-display text-lg font-bold">
                  {localized(location.name_mn, location.name_en, locale)}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {localized(location.address_mn, location.address, locale) || location.address}
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {formatHoursSummary(location.hours, locale)}
                  </li>
                  {(location.phone || business.phone) && (
                    <li className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <a
                        href={`tel:${(location.phone || business.phone).replace(/\s+/g, "")}`}
                        data-analytics-event="click_phone"
                      >
                        {location.phone || business.phone}
                      </a>
                    </li>
                  )}
                </ul>
                <Link
                  href={`/store/${location.slug}`}
                  className="mt-4 inline-block rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark"
                >
                  {locale === "en" ? "Get Directions" : "Чиглэл харах"}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
