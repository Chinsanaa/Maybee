"use server";

import { getProductsBySlugs } from "@/lib/catalog";

export type RecentlyViewedProduct = {
  id: string;
  slugMn: string;
  slugEn: string | null;
  nameMn: string;
  nameEn: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  imageAlt: string;
  stockStatus: string;
  ageMinMonths: number | null;
};

export async function getRecentlyViewedProductsAction(
  slugs: string[]
): Promise<RecentlyViewedProduct[]> {
  const products = await getProductsBySlugs(slugs);
  const bySlug = new Map(
    products.map((p) => [p.slug_en ?? p.slug_mn, p] as const).concat(products.map((p) => [p.slug_mn, p] as const))
  );

  // Preserve the caller's most-recent-first order.
  const ordered = slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .filter((p, index, arr) => arr.findIndex((x) => x.id === p.id) === index);

  return ordered.map((p) => {
    const primaryImage = p.product_image.find((i) => i.is_primary) ?? p.product_image[0];
    return {
      id: p.id,
      slugMn: p.slug_mn,
      slugEn: p.slug_en,
      nameMn: p.name_mn,
      nameEn: p.name_en,
      price: p.price,
      compareAtPrice: p.compare_at_price,
      imageUrl: primaryImage?.url ?? null,
      imageAlt: primaryImage?.alt_text_mn || p.name_mn,
      stockStatus: p.stock_status,
      ageMinMonths: p.age_min_months,
    };
  });
}
