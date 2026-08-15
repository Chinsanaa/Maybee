import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { searchProducts } from "@/lib/catalog";
import { getBusinessInfo } from "@/lib/business-info";
import { ProductCard } from "@/components/product/product-card";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `"${q}"` : "Search", robots: { index: false } };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [locale, t, business, results] = await Promise.all([
    getLocale(),
    getTranslations("search"),
    getBusinessInfo(),
    searchProducts(q),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>
      {q && (
        <p className="mt-2 text-sm text-brand-gray">
          {t("resultsFor")}: <span className="font-semibold text-brand-ink">&ldquo;{q}&rdquo;</span> ({results.length})
        </p>
      )}

      {results.length === 0 ? (
        <div className="mt-10">
          <p className="text-brand-gray">{t("noResults")}</p>
          <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-brand-red">
            {locale === "en" ? "Browse all products" : "Бүх бүтээгдэхүүнийг үзэх"}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
