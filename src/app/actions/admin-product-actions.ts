"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/database.types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function num(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  return v === "" ? null : Number(v);
}

function buildProductPayload(formData: FormData): TablesInsert<"product"> {
  const nameMn = str(formData, "name_mn");
  const nameEn = str(formData, "name_en");
  return {
    sku: str(formData, "sku"),
    name_mn: nameMn,
    name_en: nameEn,
    slug_mn: str(formData, "slug_mn") || slugify(nameEn || nameMn),
    slug_en: str(formData, "slug_en") || (nameEn ? slugify(nameEn) : null),
    brand: str(formData, "brand"),
    category_id: str(formData, "category_id") || null,
    price: Number(str(formData, "price") || 0),
    compare_at_price: num(formData, "compare_at_price"),
    stock_quantity: Number(str(formData, "stock_quantity") || 0),
    low_stock_threshold: Number(str(formData, "low_stock_threshold") || 3),
    stock_status: (str(formData, "stock_status") || "IN_STOCK") as never,
    age_min_months: num(formData, "age_min_months"),
    age_max_months: num(formData, "age_max_months"),
    short_desc_mn: str(formData, "short_desc_mn"),
    short_desc_en: str(formData, "short_desc_en"),
    description_mn: str(formData, "description_mn"),
    description_en: str(formData, "description_en"),
    whats_included_mn: str(formData, "whats_included_mn"),
    whats_included_en: str(formData, "whats_included_en"),
    safety_info_mn: str(formData, "safety_info_mn"),
    safety_info_en: str(formData, "safety_info_en"),
    tags: str(formData, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    available_for_pickup: bool(formData, "available_for_pickup"),
    is_featured: bool(formData, "is_featured"),
    is_new_arrival: bool(formData, "is_new_arrival"),
    is_best_seller: bool(formData, "is_best_seller"),
    is_on_sale: bool(formData, "is_on_sale"),
    is_published: bool(formData, "is_published"),
    seo_title_mn: str(formData, "seo_title_mn"),
    seo_title_en: str(formData, "seo_title_en"),
    seo_desc_mn: str(formData, "seo_desc_mn"),
    seo_desc_en: str(formData, "seo_desc_en"),
  };
}

export async function createProductAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const payload = buildProductPayload(formData);
  const { data, error } = await supabase.from("product").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  const imageUrl = str(formData, "image_url");
  if (imageUrl) {
    await supabase
      .from("product_image")
      .insert({ product_id: data.id, url: imageUrl, is_primary: true, sort_order: 0 });
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect(`/admin/products/${data.id}`);
}

export async function updateProductAction(productId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const payload = buildProductPayload(formData);
  const { error } = await supabase.from("product").update(payload).eq("id", productId);
  if (error) throw new Error(error.message);

  const imageUrl = str(formData, "image_url");
  if (imageUrl) {
    const { data: existing } = await supabase
      .from("product_image")
      .select("id")
      .eq("product_id", productId)
      .eq("is_primary", true)
      .maybeSingle();
    if (existing) {
      await supabase.from("product_image").update({ url: imageUrl }).eq("id", existing.id);
    } else {
      await supabase
        .from("product_image")
        .insert({ product_id: productId, url: imageUrl, is_primary: true, sort_order: 0 });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const productId = String(formData.get("productId"));
  const supabase = await createServerSupabaseClient();
  await supabase.from("product").delete().eq("id", productId);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}

export async function uploadProductImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };

  const supabase = await createServerSupabaseClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl };
}
