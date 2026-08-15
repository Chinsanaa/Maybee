import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [{ count: orderCount }, { count: productCount }, { data: recentOrders }, { data: lowStock }, { data: revenueRows }] =
    await Promise.all([
      supabase.from("order").select("*", { count: "exact", head: true }),
      supabase.from("product").select("*", { count: "exact", head: true }),
      supabase
        .from("order")
        .select("id, order_number, customer_name, total, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("product")
        .select("id, name_mn, sku, stock_quantity, low_stock_threshold")
        .filter("stock_quantity", "lte", 5)
        .order("stock_quantity", { ascending: true })
        .limit(5),
      supabase.from("order").select("total, status").neq("status", "CANCELLED"),
    ]);

  const revenue = (revenueRows ?? []).reduce((sum, o) => sum + o.total, 0);

  return {
    orderCount: orderCount ?? 0,
    productCount: productCount ?? 0,
    revenue,
    recentOrders: recentOrders ?? [],
    lowStock: (lowStock ?? []).filter((p) => p.stock_quantity <= p.low_stock_threshold),
  };
}
