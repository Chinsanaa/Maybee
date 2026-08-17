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

function postFromForm(formData: FormData) {
  const titleMn = String(formData.get("title_mn") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  return {
    title_mn: titleMn,
    title_en: titleEn,
    excerpt_mn: String(formData.get("excerpt_mn") ?? ""),
    excerpt_en: String(formData.get("excerpt_en") ?? ""),
    content_mn: String(formData.get("content_mn") ?? ""),
    content_en: String(formData.get("content_en") ?? ""),
    cover_image_url: String(formData.get("cover_image_url") ?? "") || null,
    author_name: String(formData.get("author_name") ?? "") || null,
    post_type: formData.get("post_type") === "news" ? "news" : "guide",
    seo_title_mn: String(formData.get("seo_title_mn") ?? ""),
    seo_title_en: String(formData.get("seo_title_en") ?? ""),
    seo_description_mn: String(formData.get("seo_description_mn") ?? ""),
    seo_description_en: String(formData.get("seo_description_en") ?? ""),
  };
}

export async function createBlogPostAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const titleMn = String(formData.get("title_mn") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(titleEn || titleMn);

  const { error } = await supabase.from("blog_post").insert({ slug, ...postFromForm(formData) });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/", "layout");
}

export async function updateBlogPostAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const isPublished = formData.get("is_published") === "on";

  const { data: existing } = await supabase
    .from("blog_post")
    .select("is_published, published_at")
    .eq("id", id)
    .maybeSingle();

  await supabase
    .from("blog_post")
    .update({
      ...postFromForm(formData),
      is_published: isPublished,
      published_at: isPublished
        ? (existing?.published_at ?? (existing?.is_published ? null : new Date().toISOString()))
        : existing?.published_at ?? null,
    })
    .eq("id", id);

  revalidatePath("/admin/blog");
  revalidatePath("/", "layout");
}

export async function deleteBlogPostAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("blog_post").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/", "layout");
}
