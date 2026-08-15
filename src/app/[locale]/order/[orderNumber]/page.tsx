import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { getBusinessInfo } from "@/lib/business-info";
import { formatPrice } from "@/lib/currency";
import { CheckCircle2 } from "lucide-react";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const [locale, t, business, order] = await Promise.all([
    getLocale(),
    getTranslations("order"),
    getBusinessInfo(),
    getOrderByNumber(orderNumber),
  ]);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" aria-hidden />
      <h1 className="font-display mt-4 text-2xl font-extrabold text-brand-ink md:text-3xl">
        {t("confirmationTitle")}
      </h1>
      <p className="mt-2 text-brand-gray">
        {t("orderNumber")}: <span className="font-semibold text-brand-ink">{order.order_number}</span>
      </p>

      <div className="mt-8 rounded-card border border-brand-gray-light bg-white p-6 text-left">
        <ul className="divide-y divide-brand-gray-light">
          {order.order_item.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span>
                {(locale === "en" && item.product_name_en) || item.product_name_mn} × {item.quantity}
              </span>
              <span className="font-medium text-brand-ink">
                {formatPrice(item.line_total, business.currency_symbol, locale)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-brand-gray-light pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-gray">Subtotal</span>
            <span>{formatPrice(order.subtotal, business.currency_symbol, locale)}</span>
          </div>
          {order.delivery_fee > 0 && (
            <div className="flex justify-between">
              <span className="text-brand-gray">Delivery</span>
              <span>{formatPrice(order.delivery_fee, business.currency_symbol, locale)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-brand-ink">
            <span>Total</span>
            <span>{formatPrice(order.total, business.currency_symbol, locale)}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-brand-gray">{t("nextSteps")}</p>
      <p className="mt-1 text-sm text-brand-gray">
        {business.phone && (
          <>
            {locale === "en" ? "Questions? Call us at" : "Асуух зүйл байвал холбогдоно уу:"}{" "}
            <a href={`tel:${business.phone.replace(/\s+/g, "")}`} className="font-semibold text-brand-red">
              {business.phone}
            </a>
          </>
        )}
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
      >
        {locale === "en" ? "Continue Shopping" : "Худалдан авалт үргэлжлүүлэх"}
      </Link>
    </div>
  );
}
