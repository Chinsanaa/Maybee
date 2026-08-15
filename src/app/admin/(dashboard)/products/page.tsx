import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";
import { deleteProductAction } from "@/app/actions/admin-product-actions";

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
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white hover:bg-brand-red-dark"
        >
          + New Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card border border-brand-gray-light bg-white">
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
                  <span
                    className={
                      p.is_published
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800"
                        : "rounded-full bg-brand-gray-light px-2 py-0.5 text-xs font-semibold text-brand-gray"
                    }
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </span>
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
            {(products ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-gray">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
