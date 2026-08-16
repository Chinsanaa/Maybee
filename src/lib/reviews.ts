import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/database.types";

export type ProductReview = Tables<"product_review">;

export const getApprovedReviews = cache(async (productId: string): Promise<ProductReview[]> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("product_review")
      .select("*")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
});

export const getReviewStats = cache(
  async (productId: string): Promise<{ count: number; average: number } | null> => {
    const reviews = await getApprovedReviews(productId);
    if (reviews.length === 0) return null;
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { count: reviews.length, average: Math.round(average * 10) / 10 };
  }
);
