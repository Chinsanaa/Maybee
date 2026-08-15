"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { addToCartAction, buyNowAction } from "@/app/actions/cart-actions";
import { Minus, Plus } from "lucide-react";

export function AddToCartForm({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const t = useTranslations("product");
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-brand-ink">{t("quantity")}</span>
        <div className="flex items-center rounded-full border border-brand-gray-light">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:text-brand-red"
            aria-label="-"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 hover:text-brand-red"
            aria-label="+"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <form action={addToCartAction} className="flex-1">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="quantity" value={quantity} />
          <button
            type="submit"
            disabled={disabled}
            data-analytics-event="add_to_cart"
            className="w-full rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:bg-brand-gray-light disabled:text-brand-gray"
          >
            {t("addToCart")}
          </button>
        </form>
        <form action={buyNowAction} className="flex-1">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-full border-2 border-brand-ink px-6 py-3 text-sm font-bold text-brand-ink hover:bg-brand-ink hover:text-white disabled:cursor-not-allowed disabled:border-brand-gray-light disabled:text-brand-gray"
          >
            {t("buyNow")}
          </button>
        </form>
      </div>
    </div>
  );
}
