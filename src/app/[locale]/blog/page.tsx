import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublishedPosts } from "@/lib/blog";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
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

export default async function BlogIndexPage() {
  const [locale, t, posts] = await Promise.all([
    getLocale(),
    getTranslations("blog"),
    getPublishedPosts(),
  ]);

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
                  <h2 className="font-display text-lg font-bold text-brand-ink">{title}</h2>
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
