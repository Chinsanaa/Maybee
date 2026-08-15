"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCategoryAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const nameMn = String(formData.get("name_mn") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const parentId = String(formData.get("parent_id") ?? "") || null;
  const slug = String(formData.get("slug") ?? "").trim() || slugify(nameEn || nameMn);

  const { error } = await supabase.from("category").insert({
    name_mn: nameMn,
    name_en: nameEn,
    slug_mn: slug,
    slug_en: slug,
    parent_id: parentId,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase
    .from("category")
    .update({
      name_mn: String(formData.get("name_mn") ?? "").trim(),
      name_en: String(formData.get("name_en") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

export async function deleteCategoryAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("category").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}
