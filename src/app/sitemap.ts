import type { MetadataRoute } from "next";
import { getAllCategories, listProducts } from "@/lib/catalog";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PATHS = [
  "",
  "/shop",
  "/store/next-plaza",
  "/contact",
  "/policies/returns",
  "/policies/privacy",
  "/policies/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, { products }] = await Promise.all([
    getAllCategories(),
    listProducts({ pageSize: 1000 }),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.6,
      });
    }
    for (const category of categories) {
      const slug = locale === "en" && category.slug_en ? category.slug_en : category.slug_mn;
      entries.push({
        url: `${siteUrl}/${locale}/shop/${slug}`,
        lastModified: category.updated_at,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const product of products) {
      const slug = locale === "en" && product.slug_en ? product.slug_en : product.slug_mn;
      entries.push({
        url: `${siteUrl}/${locale}/product/${slug}`,
        lastModified: product.updated_at,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
