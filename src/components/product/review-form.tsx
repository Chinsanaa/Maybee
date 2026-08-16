"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitReviewAction, type ReviewState } from "@/app/actions/review-actions";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextField, TextAreaField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export function ReviewForm({ productId }: { productId: string }) {
  const t = useTranslations("product");
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(submitReviewAction, undefined);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  if (state?.success) {
    return (
      <p className="rounded-card bg-brand-success-bg p-4 text-sm font-medium text-brand-success">
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

      <TextField
        id="customerName"
        name="customerName"
        label={t("yourName")}
        required
        minLength={2}
      />

      <TextAreaField
        id="reviewText"
        name="reviewText"
        label={t("yourReview")}
        required
        minLength={5}
        rows={3}
      />

      {state?.error && <p className="text-sm font-medium text-brand-red">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "..." : t("submitReview")}
      </Button>
    </form>
  );
}
