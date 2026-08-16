"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function faqFromForm(formData: FormData) {
  return {
    question_mn: String(formData.get("question_mn") ?? "").trim(),
    question_en: String(formData.get("question_en") ?? ""),
    answer_mn: String(formData.get("answer_mn") ?? ""),
    answer_en: String(formData.get("answer_en") ?? ""),
    category: String(formData.get("category") ?? "general").trim() || "general",
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createFaqAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("faq").insert(faqFromForm(formData));
  if (error) throw new Error(error.message);

  revalidatePath("/admin/faq");
  revalidatePath("/", "layout");
}

export async function updateFaqAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));

  await supabase
    .from("faq")
    .update({ ...faqFromForm(formData), is_active: formData.get("is_active") === "on" })
    .eq("id", id);

  revalidatePath("/admin/faq");
  revalidatePath("/", "layout");
}

export async function deleteFaqAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("faq").delete().eq("id", id);
  revalidatePath("/admin/faq");
  revalidatePath("/", "layout");
}
