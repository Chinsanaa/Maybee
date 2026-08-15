import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getCart } from "@/lib/cart";
import { getBusinessInfo, getDeliverySettings } from "@/lib/business-info";
import { formatPrice } from "@/lib/currency";
import { updateCartItemAction, removeCartItemAction } from "@/app/actions/cart-actions";
import { Minus, Plus, X } from "lucide-react";

export default async function CartPage() {
  const [locale, t, ct, business, delivery, { items }] = await Promise.all([
    getLocale(),
    getTranslations("cart"),
    getTranslations("product"),
    getBusinessInfo(),
    getDeliverySettings(),
    getCart(),
  ]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 0; // resolved at checkout once delivery method is chosen
  const total = subtotal + deliveryFee;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-brand-gray">{t("empty")}</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <ul className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const name = locale === "en" && item.nameEn ? item.nameEn : item.nameMn;
              return (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-card border border-brand-gray-light bg-white p-4"
                >
                  <Link href={`/product/${item.slugMn}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={name} fill sizes="80px" className="object-cover" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/product/${item.slugMn}`} className="text-sm font-semibold text-brand-ink hover:text-brand-red">
                      {name}
                    </Link>
                    {item.stockStatus === "OUT_OF_STOCK" && (
                      <span className="mt-1 text-xs font-semibold text-brand-red">{ct("outOfStock")}</span>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <form action={updateCartItemAction} className="flex items-center rounded-full border border-brand-gray-light">
                        <input type="hidden" name="itemId" value={item.id} />
                        <button
                          formAction={async (fd) => {
                            "use server";
                            fd.set("quantity", String(Math.max(0, item.quantity - 1)));
                            await updateCartItemAction(fd);
                          }}
                          className="p-1.5"
                          aria-label="-"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          formAction={async (fd) => {
                            "use server";
                            fd.set("quantity", String(item.quantity + 1));
                            await updateCartItemAction(fd);
                          }}
                          className="p-1.5"
                          aria-label="+"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </form>
                      <span className="text-sm font-bold text-brand-ink">
                        {formatPrice(item.price * item.quantity, business.currency_symbol, locale)}
                      </span>
                    </div>
                  </div>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button
                      type="submit"
                      aria-label={t("remove")}
                      className="rounded-full p-1.5 text-brand-gray hover:bg-brand-cream hover:text-brand-red"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>

          <div className="h-fit rounded-card border border-brand-gray-light bg-white p-6">
            <h2 className="font-display text-lg font-bold text-brand-ink">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-gray">{t("subtotal")}</dt>
                <dd className="font-medium text-brand-ink">
                  {formatPrice(subtotal, business.currency_symbol, locale)}
                </dd>
              </div>
              {delivery.free_threshold && subtotal < delivery.free_threshold && (
                <p className="text-xs text-brand-gray">
                  {locale === "en"
                    ? `Add ${formatPrice(delivery.free_threshold - subtotal, business.currency_symbol, locale)} more for free delivery.`
                    : `Үнэгүй хүргэлт хийхэд ${formatPrice(delivery.free_threshold - subtotal, business.currency_symbol, locale)} дутуу байна.`}
                </p>
              )}
            </dl>
            <div className="mt-4 flex justify-between border-t border-brand-gray-light pt-4">
              <span className="font-semibold text-brand-ink">{t("total")}</span>
              <span className="font-bold text-brand-ink">
                {formatPrice(total, business.currency_symbol, locale)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-brand-red px-6 py-3 text-center text-sm font-bold text-white hover:bg-brand-red-dark"
              data-analytics-event="begin_checkout"
            >
              {t("checkout")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
