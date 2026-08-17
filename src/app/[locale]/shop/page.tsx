import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { listProducts, parseShopSearchParams } from "@/lib/catalog";
import { getBusinessInfo } from "@/lib/business-info";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Shop All Toys & Gifts" : "Дэлгүүр — Бүх тоглоом, бэлэг",
    description:
      locale === "en"
        ? "Browse toys and gifts for children at Maybee Pop & Joy in Ulaanbaatar."
        : "Улаанбаатар хотын Maybee Pop & Joy дэлгүүрийн хүүхдийн тоглоом, бэлгийн бүтэн жагсаалт.",
    alternates: { canonical: `/${locale}/shop` },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const [locale, business] = await Promise.all([getLocale(), getBusinessInfo()]);
  const filters = parseShopSearchParams(sp);
  const { products, total, page, pageSize } = await listProducts(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">
        {locale === "en" ? "Shop" : "Дэлгүүр"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-gray">
        {locale === "en"
          ? "Toys and gifts for children, browsable by category, age, and budget."
          : "Хүүхдийн тоглоом, бэлгийг ангилал, нас, төсвөөр хайж үзээрэй."}
      </p>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <ShopFilters basePath="/shop" searchParams={sp} />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-gray">
              {total} {locale === "en" ? "products" : "бүтээгдэхүүн"}
            </span>
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <p className="mt-10 text-brand-gray">
              {locale === "en" ? "No products match these filters yet." : "Энэ шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй."}
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} business={business} />
              ))}
            </div>
          )}

          <Pagination basePath="/shop" searchParams={sp} page={page} pageSize={pageSize} total={total} />
        </div>
      </div>
    </div>
  );
}
