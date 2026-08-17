import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCategories, getDistinctBrands } from "@/lib/catalog";
import { AGE_BANDS as AGE_BAND_DEFS, BUDGET_BANDS as BUDGET_BAND_DEFS } from "@/lib/collections";
import { mergeQuery } from "@/lib/query";
import { cn, localized } from "@/lib/utils";

const AGE_BANDS = AGE_BAND_DEFS.map((b) => ({
  labelMn: b.labelMn,
  labelEn: b.labelEn,
  value: String(b.minMonths),
}));

const PRICE_BANDS = BUDGET_BAND_DEFS.filter((b) => b.maxPrice !== null).map((b) => ({
  labelMn: b.labelMn,
  labelEn: b.labelEn,
  value: String(b.maxPrice),
}));

export async function ShopFilters({
  basePath,
  searchParams,
}: {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const [categories, brands] = await Promise.all([getAllCategories(), getDistinctBrands()]);
  const topLevel = categories.filter((c) => !c.parent_id);

  const activeAge = typeof searchParams.age === "string" ? searchParams.age : undefined;
  const activeMaxPrice = typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined;
  const activeBrand = typeof searchParams.brand === "string" ? searchParams.brand : undefined;
  const activeOnSale = searchParams.onSale === "1";

  return (
    <aside className="w-full shrink-0 space-y-8 md:w-56">
      <div>
        <h2 className="text-sm font-semibold text-brand-ink">{t("featuredCategories")}</h2>
        <ul className="mt-3 space-y-1">
          {topLevel.map((c) => (
            <li key={c.id}>
              <Link
                href={`/shop/${locale === "en" && c.slug_en ? c.slug_en : c.slug_mn}`}
                className="block rounded-lg px-2 py-1.5 text-sm text-brand-gray hover:bg-brand-cream hover:text-brand-red"
              >
                {localized(c.name_mn, c.name_en, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-brand-ink">{t("shopByAge")}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {AGE_BANDS.map((band) => (
            <li key={band.value}>
              <Link
                href={`${basePath}${mergeQuery(searchParams, { age: activeAge === band.value ? null : band.value })}`}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  activeAge === band.value
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-gray-light text-brand-ink hover:border-brand-red"
                )}
              >
                {localized(band.labelMn, band.labelEn, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-brand-ink">{t("shopByBudget")}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {PRICE_BANDS.map((band) => (
            <li key={band.value}>
              <Link
                href={`${basePath}${mergeQuery(searchParams, { maxPrice: activeMaxPrice === band.value ? null : band.value })}`}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  activeMaxPrice === band.value
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-gray-light text-brand-ink hover:border-brand-red"
                )}
              >
                {localized(band.labelMn, band.labelEn, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {brands.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-brand-ink">
            {locale === "en" ? "Brand" : "Брэнд"}
          </h2>
          <ul className="mt-3 space-y-1">
            {brands.map((brand) => (
              <li key={brand}>
                <Link
                  href={`${basePath}${mergeQuery(searchParams, { brand: activeBrand === brand ? null : brand })}`}
                  className={cn(
                    "block rounded-lg px-2 py-1.5 text-sm",
                    activeBrand === brand
                      ? "bg-brand-red/10 font-semibold text-brand-red"
                      : "text-brand-gray hover:bg-brand-cream"
                  )}
                >
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Link
          href={`${basePath}${mergeQuery(searchParams, { onSale: activeOnSale ? null : "1" })}`}
          className={cn(
            "block rounded-full border px-3 py-1.5 text-center text-xs font-semibold",
            activeOnSale
              ? "border-brand-red bg-brand-red text-white"
              : "border-brand-gray-light text-brand-ink hover:border-brand-red"
          )}
        >
          {locale === "en" ? "On Sale" : "Хямдралтай"}
        </Link>
      </div>
    </aside>
  );
}
