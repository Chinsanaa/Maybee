import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice, discountPercent } from "@/lib/currency";
import type { ProductWithImages } from "@/lib/catalog";
import type { BusinessInfo } from "@/lib/business-info";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function ProductCard({
  product,
  business,
}: {
  product: ProductWithImages;
  business: BusinessInfo;
}) {
  const locale = await getLocale();
  const t = await getTranslations("product");
  const name = localized(product.name_mn, product.name_en, locale);
  const primaryImage =
    product.product_image.find((i) => i.is_primary) ?? product.product_image[0];
  const pct = discountPercent(product.price, product.compare_at_price);
  const slug = locale === "en" && product.slug_en ? product.slug_en : product.slug_mn;

  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-brand-gray-light bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-cream">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={localized(primaryImage.alt_text_mn, primaryImage.alt_text_en, locale) || name}
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
        {product.stock_status === "OUT_OF_STOCK" && (
          <span className="absolute inset-x-0 bottom-0 bg-brand-ink/80 py-1 text-center text-xs font-semibold text-white">
            {t("outOfStock")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.brand && <span className="text-xs text-brand-gray">{product.brand}</span>}
        <span className="line-clamp-2 text-sm font-medium text-brand-ink">{name}</span>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-brand-ink">
            {formatPrice(product.price, business.currency_symbol, locale)}
          </span>
          {product.compare_at_price && (
            <span className="text-xs text-brand-gray line-through">
              {formatPrice(product.compare_at_price, business.currency_symbol, locale)}
            </span>
          )}
        </div>
        {(product.age_min_months !== null || product.age_max_months !== null) && (
          <span className="text-xs text-brand-gray">
            {t("ageRecommendation")}:{" "}
            {product.age_min_months !== null ? Math.floor(product.age_min_months / 12) : 0}+
          </span>
        )}
      </div>
    </Link>
  );
}
