"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewedSlugs } from "@/lib/recently-viewed";
import { getRecentlyViewedProductsAction, type RecentlyViewedProduct } from "@/app/actions/catalog-actions";
import { RecentlyViewedCard } from "@/components/product/recently-viewed-card";

export function RecentlyViewedRail({
  excludeSlug,
  locale,
  currencySymbol,
  title,
  outOfStockLabel,
}: {
  excludeSlug: string;
  locale: string;
  currencySymbol: string;
  title: string;
  outOfStockLabel: string;
}) {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    const slugs = getRecentlyViewedSlugs().filter((s) => s !== excludeSlug);
    if (slugs.length === 0) return;
    getRecentlyViewedProductsAction(slugs).then(setProducts);
  }, [excludeSlug]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold text-brand-ink">{title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <RecentlyViewedCard
            key={p.id}
            product={p}
            locale={locale}
            currencySymbol={currencySymbol}
            outOfStockLabel={outOfStockLabel}
          />
        ))}
      </div>
    </section>
  );
}
