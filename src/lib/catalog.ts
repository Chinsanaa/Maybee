import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

export type ProductWithImages = Tables<"product"> & {
  product_image: Tables<"product_image">[];
  category: Pick<Tables<"category">, "id" | "name_mn" | "name_en" | "slug_mn" | "slug_en"> | null;
};

const PRODUCT_SELECT =
  "*, product_image(*), category:category_id(id, name_mn, name_en, slug_mn, slug_en)";

export const getFeaturedCategories = cache(async (limit = 8) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("category")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
});

export const getAllCategories = cache(async () => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("category")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("category")
    .select("*")
    .or(`slug_mn.eq.${slug},slug_en.eq.${slug}`)
    .eq("is_active", true)
    .maybeSingle();
  return data;
});

export type ProductFilters = {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  ageMonths?: number;
  brand?: string;
  onSale?: boolean;
  inStockOnly?: boolean;
  filter?: "new" | "bestseller" | "featured";
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "bestselling";
  page?: number;
  pageSize?: number;
};

export async function listProducts(filters: ProductFilters = {}) {
  const supabase = createAdminClient();
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;
  let query = supabase
    .from("product")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("is_published", true);

  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.onSale) query = query.eq("is_on_sale", true);
  if (filters.inStockOnly) query = query.neq("stock_status", "OUT_OF_STOCK");
  if (filters.ageMonths !== undefined) {
    query = query
      .lte("age_min_months", filters.ageMonths)
      .or(`age_max_months.gte.${filters.ageMonths},age_max_months.is.null`);
  }
  if (filters.filter === "new") query = query.eq("is_new_arrival", true);
  if (filters.filter === "bestseller") query = query.eq("is_best_seller", true);
  if (filters.filter === "featured") query = query.eq("is_featured", true);

  switch (filters.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "bestselling":
      query = query.order("is_best_seller", { ascending: false }).order("created_at", { ascending: false });
      break;
    default:
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const { data, count } = await query.range(from, from + pageSize - 1);

  return { products: (data ?? []) as unknown as ProductWithImages[], total: count ?? 0, page, pageSize };
}

export const getBestSellers = cache(async (limit = 8) => {
  const { products } = await listProducts({ filter: "bestseller", pageSize: limit });
  return products;
});

export const getNewArrivals = cache(async (limit = 8) => {
  const { products } = await listProducts({ filter: "new", pageSize: limit, sort: "newest" });
  return products;
});

export const getFeaturedProducts = cache(async (limit = 8) => {
  const { products } = await listProducts({ filter: "featured", pageSize: limit });
  return products;
});

export const getProductBySlug = cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("product")
    .select(PRODUCT_SELECT)
    .or(`slug_mn.eq.${slug},slug_en.eq.${slug}`)
    .eq("is_published", true)
    .maybeSingle();
  return data as unknown as ProductWithImages | null;
});

export const getRelatedProducts = cache(async (productId: string, limit = 4) => {
  const supabase = createAdminClient();
  const { data: relations } = await supabase
    .from("product_relation")
    .select("to_product_id")
    .eq("from_product_id", productId)
    .limit(limit);

  const ids = (relations ?? []).map((r) => r.to_product_id);
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("product")
    .select(PRODUCT_SELECT)
    .in("id", ids)
    .eq("is_published", true);
  return (data ?? []) as unknown as ProductWithImages[];
});

export async function searchProducts(q: string, limit = 24) {
  if (!q.trim()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("product")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .or(
      `name_mn.ilike.%${q}%,name_en.ilike.%${q}%,brand.ilike.%${q}%,sku.ilike.%${q}%`
    )
    .limit(limit);
  return (data ?? []) as unknown as ProductWithImages[];
}

export const getDistinctBrands = cache(async () => {
  const supabase = createAdminClient();
  const { data } = await supabase.from("product").select("brand").eq("is_published", true);
  const brands = Array.from(new Set((data ?? []).map((p) => p.brand).filter(Boolean)));
  return brands.sort();
});
