"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().min(5),
});

export type ReviewState = { error?: string; success?: boolean } | undefined;

export async function submitReviewAction(
  _prevState: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("product_review").insert({
      product_id: parsed.data.productId,
      customer_name: parsed.data.customerName,
      rating: parsed.data.rating,
      review_text: parsed.data.reviewText,
      is_approved: false,
    });
    if (error) throw error;
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (err) {
    console.error("[reviews] submitReviewAction failed", err);
    return { error: "Could not submit your review. Please try again." };
  }
}
