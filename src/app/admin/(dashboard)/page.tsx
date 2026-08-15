import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/queries";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-brand-gray-light bg-white p-5">
          <p className="text-sm text-brand-gray">Total Products</p>
          <p className="mt-1 text-2xl font-bold text-brand-ink">{stats.productCount}</p>
        </div>
        <div className="rounded-card border border-brand-gray-light bg-white p-5">
          <p className="text-sm text-brand-gray">Published</p>
          <p className="mt-1 text-2xl font-bold text-brand-ink">{stats.publishedCount}</p>
        </div>
      </div>

      <div className="mt-8 rounded-card border border-brand-gray-light bg-white p-5">
        <h2 className="font-semibold text-brand-ink">Low Stock</h2>
        {stats.lowStock.length === 0 ? (
          <p className="mt-3 text-sm text-brand-gray">Nothing low on stock.</p>
        ) : (
          <ul className="mt-3 divide-y divide-brand-gray-light">
            {stats.lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <Link href={`/admin/products/${p.id}`} className="font-medium text-brand-red hover:underline">
                  {p.name_mn}
                </Link>
                <span className="text-brand-gray">{p.sku}</span>
                <span className="font-semibold text-brand-red">{p.stock_quantity} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
