import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { listProducts, getCategoryBySlug, type ProductFilters } from "@/lib/catalog";
import { getBusinessInfo } from "@/lib/business-info";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

function parseFilters(sp: Record<string, string | string[] | undefined>): Omit<ProductFilters, "categoryId"> {
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  return {
    maxPrice: str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined,
    ageMonths: str(sp.age) ? Number(str(sp.age)) : undefined,
    brand: str(sp.brand),
    onSale: sp.onSale === "1",
    sort: (str(sp.sort) as ProductFilters["sort"]) ?? "relevance",
    page: str(sp.page) ? Number(str(sp.page)) : 1,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; locale: string }>;
}): Promise<Metadata> {
  const { categorySlug, locale } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  const title = category.seo_title_mn
    ? localized(category.seo_title_mn, category.seo_title_en, locale)
    : localized(category.name_mn, category.name_en, locale);
  const description = category.seo_desc_mn
    ? localized(category.seo_desc_mn, category.seo_desc_en, locale)
    : localized(category.description_mn, category.description_en, locale);

  return {
    title,
    description: description || undefined,
    alternates: { canonical: `/${locale}/shop/${categorySlug}` },
  };
}

export default async function CategoryShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const [locale, business, category] = await Promise.all([
    getLocale(),
    getBusinessInfo(),
    getCategoryBySlug(categorySlug),
  ]);

  if (!category) notFound();

  const filters = { ...parseFilters(sp), categoryId: category.id };
  const { products, total, page, pageSize } = await listProducts(filters);
  const basePath = `/shop/${categorySlug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: locale === "en" ? "Shop" : "Дэлгүүр", href: "/shop" },
          { name: localized(category.name_mn, category.name_en, locale), href: basePath },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">
        {localized(category.name_mn, category.name_en, locale)}
      </h1>
      {(category.description_mn || category.description_en) && (
        <p className="mt-2 max-w-2xl text-sm text-brand-gray">
          {localized(category.description_mn, category.description_en, locale)}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <ShopFilters basePath={basePath} searchParams={sp} />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-gray">
              {total} {locale === "en" ? "products" : "бүтээгдэхүүн"}
            </span>
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <p className="mt-10 text-brand-gray">
              {locale === "en"
                ? "No products in this category yet."
                : "Энэ ангилалд одоогоор бүтээгдэхүүн алга."}
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} business={business} />
              ))}
            </div>
          )}

          <Pagination basePath={basePath} searchParams={sp} page={page} pageSize={pageSize} total={total} />
        </div>
      </div>
    </div>
  );
}
