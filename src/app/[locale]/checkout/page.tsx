import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { getCart } from "@/lib/cart";
import { getBusinessInfo, getDeliverySettings } from "@/lib/business-info";
import { formatPrice } from "@/lib/currency";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  const [locale, t, business, delivery, { items }] = await Promise.all([
    getLocale(),
    getTranslations("checkout"),
    getBusinessInfo(),
    getDeliverySettings(),
    getCart(),
  ]);

  if (items.length === 0) redirect(`/${locale}/cart`);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm delivery={delivery} currencySymbol={business.currency_symbol} subtotal={subtotal} />
        </div>

        <div className="h-fit rounded-card border border-brand-gray-light bg-white p-6">
          <h2 className="font-display text-lg font-bold text-brand-ink">{t("orderSummary")}</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => {
              const name = locale === "en" && item.nameEn ? item.nameEn : item.nameMn;
              return (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={name} fill sizes="48px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 font-medium text-brand-ink">{name}</p>
                    <p className="text-brand-gray">× {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-ink">
                    {formatPrice(item.price * item.quantity, business.currency_symbol, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between border-t border-brand-gray-light pt-4 text-sm">
            <span className="text-brand-gray">Subtotal</span>
            <span className="font-semibold text-brand-ink">
              {formatPrice(subtotal, business.currency_symbol, locale)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
