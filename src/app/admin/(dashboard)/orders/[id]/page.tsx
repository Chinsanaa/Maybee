import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";
import { updateOrderStatusAction, updateOrderNotesAction } from "@/app/actions/admin-order-actions";

const STATUSES = [
  "PENDING_PAYMENT", "CONFIRMED", "PROCESSING", "READY_FOR_PICKUP",
  "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const [{ data: order }, { data: history }] = await Promise.all([
    supabase.from("order").select("*, order_item(*)").eq("id", id).maybeSingle(),
    supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!order) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Order {order.order_number}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-card border border-brand-gray-light bg-white p-6">
            <h2 className="font-semibold text-brand-ink">Items</h2>
            <ul className="mt-3 divide-y divide-brand-gray-light">
              {order.order_item.map((item) => (
                <li key={item.id} className="flex justify-between py-2 text-sm">
                  <span>
                    {item.product_name_mn} × {item.quantity} ({item.sku})
                  </span>
                  <span className="font-medium">{formatPrice(item.line_total, "₮")}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-brand-gray-light pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-gray">Subtotal</span>
                <span>{formatPrice(order.subtotal, "₮")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Delivery</span>
                <span>{formatPrice(order.delivery_fee, "₮")}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total, "₮")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-brand-gray-light bg-white p-6">
            <h2 className="font-semibold text-brand-ink">Customer</h2>
            <dl className="mt-3 space-y-1 text-sm">
              <div><dt className="inline text-brand-gray">Name: </dt><dd className="inline">{order.customer_name}</dd></div>
              <div><dt className="inline text-brand-gray">Phone: </dt><dd className="inline">{order.customer_phone}</dd></div>
              {order.customer_email && (
                <div><dt className="inline text-brand-gray">Email: </dt><dd className="inline">{order.customer_email}</dd></div>
              )}
              <div><dt className="inline text-brand-gray">Delivery method: </dt><dd className="inline">{order.delivery_method}</dd></div>
              {order.address && (
                <div><dt className="inline text-brand-gray">Address: </dt><dd className="inline">{order.address}, {order.district} {order.khoroo}</dd></div>
              )}
              {order.customer_notes && (
                <div><dt className="inline text-brand-gray">Notes: </dt><dd className="inline">{order.customer_notes}</dd></div>
              )}
            </dl>
          </div>

          <div className="rounded-card border border-brand-gray-light bg-white p-6">
            <h2 className="font-semibold text-brand-ink">Internal notes</h2>
            <form action={updateOrderNotesAction} className="mt-3 space-y-3">
              <input type="hidden" name="orderId" value={order.id} />
              <textarea
                name="internal_notes"
                defaultValue={order.internal_notes ?? ""}
                rows={3}
                className="w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
              />
              <button type="submit" className="rounded-full bg-brand-ink px-4 py-2 text-xs font-semibold text-white">
                Save notes
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-brand-gray-light bg-white p-6">
            <h2 className="font-semibold text-brand-ink">Status</h2>
            <p className="mt-1 text-sm text-brand-gray">Current: <span className="font-semibold text-brand-ink">{order.status}</span></p>
            <form action={updateOrderStatusAction} className="mt-3 space-y-3">
              <input type="hidden" name="orderId" value={order.id} />
              <select name="status" defaultValue={order.status} className="w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                name="note"
                placeholder="Optional note"
                className="w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
              />
              <button type="submit" className="w-full rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white hover:bg-brand-red-dark">
                Update status
              </button>
            </form>
          </div>

          <div className="rounded-card border border-brand-gray-light bg-white p-6">
            <h2 className="font-semibold text-brand-ink">History</h2>
            <ul className="mt-3 space-y-2 text-xs text-brand-gray">
              {(history ?? []).map((h) => (
                <li key={h.id}>
                  <span className="font-medium text-brand-ink">{h.status}</span> —{" "}
                  {new Date(h.created_at).toLocaleString()}
                  {h.note && <div>{h.note}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
