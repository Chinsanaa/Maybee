"use client";

import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { submitCheckoutAction, type CheckoutState } from "@/app/actions/checkout-actions";
import type { DeliverySettings } from "@/lib/business-info";
import { formatPrice } from "@/lib/currency";

type PaymentMethod = { code: string; label_mn: string; label_en: string; enabled: boolean };

export function CheckoutForm({
  delivery,
  currencySymbol,
  subtotal,
}: {
  delivery: DeliverySettings;
  currencySymbol: string;
  subtotal: number;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    submitCheckoutAction,
    undefined
  );
  const [method, setMethod] = useState<"PICKUP" | "DELIVERY">(
    delivery.pickup_enabled ? "PICKUP" : "DELIVERY"
  );
  const paymentMethods = (delivery.payment_methods as PaymentMethod[] | null)?.filter(
    (m) => m.enabled
  ) ?? [{ code: "manual", label_mn: "Бэлнээр / Шилжүүлгээр", label_en: "Cash / Bank transfer", enabled: true }];

  const deliveryFee =
    method === "DELIVERY"
      ? delivery.free_threshold && subtotal >= delivery.free_threshold
        ? 0
        : delivery.base_fee
      : 0;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold text-brand-ink">{t("contactInfo")}</legend>
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-brand-ink">
            {t("name")}
          </label>
          <input
            id="customerName"
            name="customerName"
            required
            minLength={2}
            className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-brand-ink">
              {t("phone")}
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-brand-ink">
              {t("email")}
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg font-bold text-brand-ink">{t("deliveryMethod")}</legend>
        <div className="flex gap-3">
          {delivery.pickup_enabled && (
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-brand-gray-light p-3 has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/5">
              <input
                type="radio"
                name="deliveryMethod"
                value="PICKUP"
                checked={method === "PICKUP"}
                onChange={() => setMethod("PICKUP")}
                data-analytics-event="click_store_pickup"
              />
              <span className="text-sm font-medium">{t("pickup")}</span>
            </label>
          )}
          {delivery.delivery_enabled && (
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-brand-gray-light p-3 has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/5">
              <input
                type="radio"
                name="deliveryMethod"
                value="DELIVERY"
                checked={method === "DELIVERY"}
                onChange={() => setMethod("DELIVERY")}
                data-analytics-event="click_delivery"
              />
              <span className="text-sm font-medium">{t("delivery")}</span>
            </label>
          )}
        </div>

        {method === "DELIVERY" && (
          <div className="space-y-3 rounded-lg bg-brand-cream p-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-brand-ink">
                {t("address")}
              </label>
              <input
                id="address"
                name="address"
                required={method === "DELIVERY"}
                className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-brand-ink">
                  {t("district")}
                </label>
                <input
                  id="district"
                  name="district"
                  className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="khoroo" className="block text-sm font-medium text-brand-ink">
                  {t("khoroo")}
                </label>
                <input
                  id="khoroo"
                  name="khoroo"
                  className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="addressDetails" className="block text-sm font-medium text-brand-ink">
                {t("addressDetails")}
              </label>
              <input
                id="addressDetails"
                name="addressDetails"
                className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
              />
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-brand-gray">
                {t("delivery")}: {formatPrice(deliveryFee, currencySymbol, locale)}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-lg font-bold text-brand-ink">{t("paymentMethod")}</legend>
        {paymentMethods.map((m, i) => (
          <label
            key={m.code}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-brand-gray-light p-3 has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/5"
          >
            <input type="radio" name="paymentMethod" value={m.code} defaultChecked={i === 0} required />
            <span className="text-sm font-medium">{locale === "en" ? m.label_en : m.label_mn}</span>
          </label>
        ))}
      </fieldset>

      <div>
        <label htmlFor="customerNotes" className="block text-sm font-medium text-brand-ink">
          {t("orderNotes")}
        </label>
        <textarea
          id="customerNotes"
          name="customerNotes"
          rows={3}
          className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-brand-red">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-red px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-60"
      >
        {pending ? "..." : t("placeOrder")}
      </button>
    </form>
  );
}
