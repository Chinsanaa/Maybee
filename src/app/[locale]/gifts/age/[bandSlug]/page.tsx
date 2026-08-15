import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { listProducts } from "@/lib/catalog";
import { getBusinessInfo } from "@/lib/business-info";
import { AGE_BANDS, getAgeBandBySlug } from "@/lib/collections";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return AGE_BANDS.map((b) => ({ bandSlug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bandSlug: string; locale: string }>;
}): Promise<Metadata> {
  const { bandSlug, locale } = await params;
  const band = getAgeBandBySlug(bandSlug);
  if (!band) return {};
  const label = locale === "en" ? band.labelEn : band.labelMn;
  return {
    title: locale === "en" ? `Toys for ${label}` : `${label} тоглоом`,
    description: locale === "en" ? band.introEn : band.introMn,
    alternates: { canonical: `/${locale}/gifts/age/${bandSlug}` },
  };
}

export default async function AgeCollectionPage({
  params,
}: {
  params: Promise<{ bandSlug: string }>;
}) {
  const { bandSlug } = await params;
  const [locale, business] = await Promise.all([getLocale(), getBusinessInfo()]);
  const band = getAgeBandBySlug(bandSlug);
  if (!band) notFound();

  const label = locale === "en" ? band.labelEn : band.labelMn;
  const { products, total } = await listProducts({ ageMonths: band.minMonths, pageSize: 48 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: locale === "en" ? "Gifts" : "Бэлэг", href: "/gifts/age/0-2" },
          { name: label, href: `/gifts/age/${bandSlug}` },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">
        {locale === "en" ? `Toys for ${label}` : `${label} тоглоом`}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-gray">{locale === "en" ? band.introEn : band.introMn}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {AGE_BANDS.map((b) => (
          <Link
            key={b.slug}
            href={`/gifts/age/${b.slug}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              b.slug === bandSlug
                ? "border-brand-red bg-brand-red text-white"
                : "border-brand-gray-light text-brand-ink hover:border-brand-red"
            )}
          >
            {locale === "en" ? b.labelEn : b.labelMn}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-brand-gray">
        {total} {locale === "en" ? "products" : "бүтээгдэхүүн"}
      </p>

      {products.length === 0 ? (
        <p className="mt-6 text-brand-gray">
          {locale === "en" ? "No products in this age range yet." : "Энэ насны ангилалд одоогоор бүтээгдэхүүн алга."}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
