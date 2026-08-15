import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";

const STATUSES = [
  "PENDING_PAYMENT", "CONFIRMED", "PROCESSING", "READY_FOR_PICKUP",
  "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("order")
    .select("id, order_number, customer_name, customer_phone, total, status, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status as never);
  if (q) query = query.or(`customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%,order_number.ilike.%${q}%`);

  const { data: orders } = await query;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Orders</h1>

      <form className="mt-4 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, phone, order #"
          className="rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
        <select name="status" defaultValue={status ?? ""} className="rounded-lg border border-brand-gray-light px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-brand-ink px-4 py-2 text-sm font-medium text-white">
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card border border-brand-gray-light bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-gray-light bg-brand-cream text-xs uppercase text-brand-gray">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-light">
            {(orders ?? []).map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-red hover:underline">
                    {o.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3 text-brand-gray">{o.customer_phone}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total, "₮")}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-medium">{o.status}</span>
                </td>
                <td className="px-4 py-3 text-brand-gray">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-gray">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
