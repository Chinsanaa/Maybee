import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
} from "@/app/actions/admin-blog-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Newspaper } from "lucide-react";

const inputCls = "mt-1 w-full rounded-card border border-brand-gray-light px-3 py-2 text-sm";
const textareaCls = `${inputCls} min-h-24`;

export default async function AdminBlogPage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("blog_post")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Blog</h1>
      <p className="mt-1 text-sm text-brand-gray">Write guides and gift ideas. Posts are hidden from the storefront until published.</p>

      <Card className="mt-6">
        <h2 className="font-semibold text-brand-ink">New post</h2>
        <form action={createBlogPostAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="title_mn" placeholder="Title (MN)" required className={inputCls} />
          <input name="title_en" placeholder="Title (EN)" className={inputCls} />
          <input name="slug" placeholder="Slug (auto from title if blank)" className={`sm:col-span-2 ${inputCls}`} />
          <textarea name="excerpt_mn" placeholder="Excerpt (MN)" className={`sm:col-span-2 ${inputCls}`} />
          <textarea name="excerpt_en" placeholder="Excerpt (EN)" className={`sm:col-span-2 ${inputCls}`} />
          <textarea name="content_mn" placeholder="Content (MN)" className={`sm:col-span-2 ${textareaCls}`} />
          <textarea name="content_en" placeholder="Content (EN)" className={`sm:col-span-2 ${textareaCls}`} />
          <input name="cover_image_url" placeholder="Cover image URL (optional)" className={`sm:col-span-2 ${inputCls}`} />
          <input name="author_name" placeholder="Author name (optional)" className={inputCls} />
          <Button type="submit" size="sm" className="w-fit sm:col-span-2">
            Create post
          </Button>
        </form>
      </Card>

      <div className="mt-6 space-y-6">
        {(posts ?? []).map((post) => (
          <Card key={post.id}>
            <div className="mb-3 flex items-center justify-between">
              <Badge variant={post.is_published ? "success" : "neutral"}>
                {post.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <form action={updateBlogPostAction} className="space-y-4">
              <input type="hidden" name="id" value={post.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  Title (MN)
                  <input name="title_mn" defaultValue={post.title_mn} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Title (EN)
                  <input name="title_en" defaultValue={post.title_en} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Excerpt (MN)
                  <textarea name="excerpt_mn" defaultValue={post.excerpt_mn} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Excerpt (EN)
                  <textarea name="excerpt_en" defaultValue={post.excerpt_en} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Content (MN)
                  <textarea name="content_mn" defaultValue={post.content_mn} className={textareaCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Content (EN)
                  <textarea name="content_en" defaultValue={post.content_en} className={textareaCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Cover image URL
                  <input name="cover_image_url" defaultValue={post.cover_image_url ?? ""} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Author name
                  <input name="author_name" defaultValue={post.author_name ?? ""} className={inputCls} />
                </label>
                <label className="block text-sm">
                  SEO title (MN)
                  <input name="seo_title_mn" defaultValue={post.seo_title_mn} className={inputCls} />
                </label>
                <label className="block text-sm">
                  SEO title (EN)
                  <input name="seo_title_en" defaultValue={post.seo_title_en} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  SEO description (MN)
                  <textarea name="seo_description_mn" defaultValue={post.seo_description_mn} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  SEO description (EN)
                  <textarea name="seo_description_en" defaultValue={post.seo_description_en} className={inputCls} />
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_published" defaultChecked={post.is_published} />
                  Published
                </label>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </div>
            </form>
            <form action={deleteBlogPostAction} className="mt-3 border-t border-brand-gray-light pt-3">
              <input type="hidden" name="id" value={post.id} />
              <Button type="submit" variant="danger" size="sm">
                Delete post
              </Button>
            </form>
          </Card>
        ))}
        {(posts ?? []).length === 0 && (
          <Card>
            <EmptyState icon={Newspaper} title="No posts yet" description="Posts you create will appear here." />
          </Card>
        )}
      </div>
    </div>
  );
}
