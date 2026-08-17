import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublishedPosts, type BlogPostType } from "@/lib/blog";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Blog" : "Блог",
    description:
      locale === "en"
        ? "Toy-shopping guides and gift ideas from Maybee Pop & Joy."
        : "Maybee Pop & Joy-ноос тоглоом сонголт, бэлгийн санаанууд.",
    alternates: { canonical: `/${locale}/blog` },
  };
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const postType: BlogPostType | undefined = type === "guide" || type === "news" ? type : undefined;

  const [locale, t, posts] = await Promise.all([
    getLocale(),
    getTranslations("blog"),
    getPublishedPosts(postType),
  ]);

  const tabs: { href: string; label: string; active: boolean }[] = [
    { href: "/blog", label: t("filterAll"), active: !postType },
    { href: "/blog?type=guide", label: t("filterGuides"), active: postType === "guide" },
    { href: "/blog?type=news", label: t("filterNews"), active: postType === "news" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/blog" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      <div className="mt-6 flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              tab.active
                ? "border-brand-red bg-brand-red text-white"
                : "border-brand-gray-light text-brand-ink hover:border-brand-red"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 text-brand-gray">{t("noPosts")}</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {posts.map((post) => {
            const title = localized(post.title_mn, post.title_en, locale);
            const excerpt = localized(post.excerpt_mn, post.excerpt_en, locale);
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block overflow-hidden rounded-card border border-brand-gray-light bg-white hover:border-brand-red"
              >
                {post.cover_image_url && (
                  <div className="relative aspect-[16/9] w-full bg-brand-cream">
                    <Image src={post.cover_image_url} alt={title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <Badge variant={post.post_type === "news" ? "warning" : "neutral"}>
                    {post.post_type === "news" ? t("typeNews") : t("typeGuide")}
                  </Badge>
                  <h2 className="mt-2 font-display text-lg font-bold text-brand-ink">{title}</h2>
                  {excerpt && <p className="mt-2 text-sm text-brand-gray">{excerpt}</p>}
                  {post.published_at && (
                    <p className="mt-3 text-xs text-brand-gray">
                      {new Date(post.published_at).toLocaleDateString(locale === "en" ? "en-US" : "mn-MN")}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
