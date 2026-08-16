import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";
import { deleteProductAction } from "@/app/actions/admin-product-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase
    .from("product")
    .select("id, sku, name_mn, price, stock_quantity, stock_status, is_published")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-brand-ink">Products</h1>
        <ButtonLink href="/admin/products/new" size="sm">
          + New Product
        </ButtonLink>
      </div>

      {(products ?? []).length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Products you create will appear here."
          />
        </Card>
      ) : (
        <Card padding="p-4" className="mt-6 overflow-x-auto !p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-gray-light bg-brand-cream text-xs uppercase text-brand-gray">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-light">
              {(products ?? []).map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-brand-red hover:underline">
                      {p.name_mn}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-gray">{p.sku}</td>
                  <td className="px-4 py-3">{formatPrice(p.price, "₮")}</td>
                  <td className="px-4 py-3">{p.stock_quantity}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.is_published ? "success" : "neutral"}>
                      {p.is_published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={p.id} />
                      <button type="submit" className="text-xs font-medium text-brand-red hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
