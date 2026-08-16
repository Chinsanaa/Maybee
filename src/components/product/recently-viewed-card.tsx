"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatPrice, discountPercent } from "@/lib/currency";
import type { RecentlyViewedProduct } from "@/app/actions/catalog-actions";

export function RecentlyViewedCard({
  product,
  locale,
  currencySymbol,
  outOfStockLabel,
}: {
  product: RecentlyViewedProduct;
  locale: string;
  currencySymbol: string;
  outOfStockLabel: string;
}) {
  const name = locale === "en" && product.nameEn ? product.nameEn : product.nameMn;
  const slug = locale === "en" && product.slugEn ? product.slugEn : product.slugMn;
  const pct = discountPercent(product.price, product.compareAtPrice);

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-brand-gray-light bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-cream">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.imageAlt || name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-gray">No image</div>
        )}
        {pct && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-red px-2 py-1 text-xs font-bold text-white">
            -{pct}%
          </span>
        )}
        {product.stockStatus === "OUT_OF_STOCK" && (
          <span className="absolute inset-x-0 bottom-0 bg-brand-ink/80 py-1 text-center text-xs font-semibold text-white">
            {outOfStockLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="line-clamp-2 text-sm font-medium text-brand-ink">{name}</span>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-brand-ink">
            {formatPrice(product.price, currencySymbol, locale)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-brand-gray line-through">
              {formatPrice(product.compareAtPrice, currencySymbol, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
