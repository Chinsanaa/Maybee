import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [{ count: productCount }, { count: publishedCount }, { data: lowStock }] = await Promise.all([
    supabase.from("product").select("*", { count: "exact", head: true }),
    supabase.from("product").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase
      .from("product")
      .select("id, name_mn, sku, stock_quantity, low_stock_threshold")
      .filter("stock_quantity", "lte", 5)
      .order("stock_quantity", { ascending: true })
      .limit(5),
  ]);

  return {
    productCount: productCount ?? 0,
    publishedCount: publishedCount ?? 0,
    lowStock: (lowStock ?? []).filter((p) => p.stock_quantity <= p.low_stock_threshold),
  };
}
