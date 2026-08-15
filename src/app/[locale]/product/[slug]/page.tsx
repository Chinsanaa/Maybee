import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getBusinessInfo } from "@/lib/business-info";
import { formatPrice, discountPercent } from "@/lib/currency";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCta } from "@/components/product/product-cta";
import { ShareButtons } from "@/components/product/share-buttons";
import { ProductCard } from "@/components/product/product-card";
import { Store, ShieldCheck } from "lucide-react";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const title = product.seo_title_mn
    ? localized(product.seo_title_mn, product.seo_title_en, locale)
    : localized(product.name_mn, product.name_en, locale);
  const description = product.seo_desc_mn
    ? localized(product.seo_desc_mn, product.seo_desc_en, locale)
    : localized(product.short_desc_mn, product.short_desc_en, locale);
  const image = product.product_image.find((i) => i.is_primary)?.url ?? product.product_image[0]?.url;

  return {
    title,
    description: description || undefined,
    alternates: { canonical: `/${locale}/product/${slug}` },
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, t, business, product] = await Promise.all([
    getLocale(),
    getTranslations("product"),
    getBusinessInfo(),
    getProductBySlug(slug),
  ]);

  if (!product) notFound();

  const related = await getRelatedProducts(product.id);

  const name = localized(product.name_mn, product.name_en, locale);
  const shortDesc = localized(product.short_desc_mn, product.short_desc_en, locale);
  const description = localized(product.description_mn, product.description_en, locale);
  const features = (locale === "en" ? product.features_en : product.features_mn) as string[];
  const whatsIncluded = localized(product.whats_included_mn, product.whats_included_en, locale);
  const safetyInfo = localized(product.safety_info_mn, product.safety_info_en, locale);
  const categoryName = product.category
    ? localized(product.category.name_mn, product.category.name_en, locale)
    : null;
  const categorySlug = product.category
    ? locale === "en" && product.category.slug_en
      ? product.category.slug_en
      : product.category.slug_mn
    : null;

  const pct = discountPercent(product.price, product.compare_at_price);
  const ageLabel =
    product.age_min_months !== null
      ? `${Math.floor(product.age_min_months / 12)}${product.age_min_months % 12 ? "+" : ""}+ ${
          locale === "en" ? "yrs" : "нас"
        }`
      : null;

  const images = product.product_image
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({ url: img.url, alt: localized(img.alt_text_mn, img.alt_text_en, locale) }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productJsonLd(product, locale, business),
            breadcrumbJsonLd([
              { name: locale === "en" ? "Home" : "Нүүр", url: `/${locale}` },
              { name: locale === "en" ? "Shop" : "Дэлгүүр", url: `/${locale}/shop` },
              ...(categoryName && categorySlug
                ? [{ name: categoryName, url: `/${locale}/shop/${categorySlug}` }]
                : []),
              { name, url: `/${locale}/product/${slug}` },
            ]),
          ]),
        }}
      />

      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: locale === "en" ? "Shop" : "Дэлгүүр", href: "/shop" },
          ...(categoryName && categorySlug
            ? [{ name: categoryName, href: `/shop/${categorySlug}` }]
            : []),
          { name, href: `/product/${slug}` },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} productName={name} />

        <div>
          {product.brand && product.brand !== "[DEMO]" && (
            <p className="text-sm font-medium text-brand-gray">{product.brand}</p>
          )}
          {product.is_demo && (
            <span className="mb-2 inline-block rounded-full bg-brand-honey px-2 py-0.5 text-xs font-bold text-brand-ink">
              DEMO
            </span>
          )}
          <h1 className="font-display text-2xl font-extrabold text-brand-ink md:text-3xl">{name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand-ink">
              {formatPrice(product.price, business.currency_symbol, locale)}
            </span>
            {product.compare_at_price && (
              <>
                <span className="text-base text-brand-gray line-through">
                  {formatPrice(product.compare_at_price, business.currency_symbol, locale)}
                </span>
                {pct && (
                  <span className="rounded-full bg-brand-red px-2 py-0.5 text-xs font-bold text-white">
                    -{pct}%
                  </span>
                )}
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span
              className={
                product.stock_status === "OUT_OF_STOCK"
                  ? "font-semibold text-brand-red"
                  : product.stock_status === "LOW_STOCK"
                    ? "font-semibold text-amber-600"
                    : "font-semibold text-green-700"
              }
            >
              {product.stock_status === "OUT_OF_STOCK"
                ? t("outOfStock")
                : product.stock_status === "LOW_STOCK"
                  ? t("lowStock")
                  : t("inStock")}
            </span>
            {ageLabel && (
              <span className="text-brand-gray">
                {t("ageRecommendation")}: {ageLabel}
              </span>
            )}
            <span className="text-brand-gray">
              {t("sku")}: {product.sku}
            </span>
          </div>

          {shortDesc && <p className="mt-4 text-brand-ink">{shortDesc}</p>}

          <div className="mt-6">
            <ProductCta phone={business.phone} />
          </div>

          <div className="mt-6 space-y-2 rounded-card border border-brand-gray-light p-4 text-sm">
            {product.available_for_pickup && (
              <p className="flex items-center gap-2 text-brand-ink">
                <Store className="h-4 w-4 text-brand-red" aria-hidden />
                {locale === "en" ? "Available in store at NEXT Plaza" : "NEXT Plaza дэлгүүрт бэлэн байна"}
              </p>
            )}
            {safetyInfo && (
              <p className="flex items-start gap-2 text-brand-gray">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden />
                {safetyInfo}
              </p>
            )}
          </div>

          <div className="mt-4">
            <ShareButtons title={name} />
          </div>
        </div>
      </div>

      {(description || features?.length > 0 || whatsIncluded) && (
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {description && (
            <section>
              <h2 className="font-display text-xl font-bold text-brand-ink">{t("description")}</h2>
              <p className="mt-3 whitespace-pre-line text-sm text-brand-gray">{description}</p>
            </section>
          )}
          <div className="space-y-8">
            {features?.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold text-brand-ink">{t("features")}</h2>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-gray">
                  {features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </section>
            )}
            {whatsIncluded && (
              <section>
                <h2 className="font-display text-xl font-bold text-brand-ink">{t("whatsIncluded")}</h2>
                <p className="mt-3 text-sm text-brand-gray">{whatsIncluded}</p>
              </section>
            )}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-brand-ink">{t("relatedProducts")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} business={business} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
