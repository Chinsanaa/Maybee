import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/database.types";

export type BlogPost = Tables<"blog_post">;
export type BlogPostType = "guide" | "news";

/** Published posts, optionally filtered by post_type ("guide" = evergreen
 * gift/toy content, "news" = short store updates/promos). Omit to get all. */
export const getPublishedPosts = cache(async (postType?: BlogPostType): Promise<BlogPost[]> => {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("blog_post")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (postType) query = query.eq("post_type", postType);
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_post")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
});
