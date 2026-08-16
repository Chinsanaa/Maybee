"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function approveReviewAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("product_review").update({ is_approved: true }).eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
}

export async function rejectReviewAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("product_review").update({ is_approved: false }).eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
}

export async function deleteReviewAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("product_review").delete().eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/", "layout");
}
