"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitReviewAction, type ReviewState } from "@/app/actions/review-actions";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const t = useTranslations("product");
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(submitReviewAction, undefined);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (state?.success) {
    return (
      <p className="rounded-card bg-green-50 p-4 text-sm font-medium text-green-800">
        {t("reviewSubmitted")}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />

      <div>
        <span className="block text-sm font-medium text-brand-ink">{t("yourRating")}</span>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${i} star`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  i <= (hoverRating || rating) ? "fill-brand-honey text-brand-honey" : "text-brand-gray-light"
                )}
              />
            </button>
          ))}
          <input type="hidden" name="rating" value={rating} />
        </div>
      </div>

      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-brand-ink">
          {t("yourName")}
        </label>
        <input
          id="customerName"
          name="customerName"
          required
          minLength={2}
          className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-brand-ink">
          {t("yourReview")}
        </label>
        <textarea
          id="reviewText"
          name="reviewText"
          required
          minLength={5}
          rows={3}
          className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
      </div>

      {state?.error && <p className="text-sm font-medium text-brand-red">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-60"
      >
        {pending ? "..." : t("submitReview")}
      </button>
    </form>
  );
}
