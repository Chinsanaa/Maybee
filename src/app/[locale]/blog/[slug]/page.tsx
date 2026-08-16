import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { getBusinessInfo } from "@/lib/business-info";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo_title_mn
    ? localized(post.seo_title_mn, post.seo_title_en, locale)
    : localized(post.title_mn, post.title_en, locale);
  const description = post.seo_description_mn
    ? localized(post.seo_description_mn, post.seo_description_en, locale)
    : localized(post.excerpt_mn, post.excerpt_en, locale);

  return {
    title,
    description: description || undefined,
    alternates: { canonical: `/${locale}/blog/${slug}` },
    openGraph: post.cover_image_url ? { images: [{ url: post.cover_image_url }] } : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [locale, t, business, post] = await Promise.all([
    getLocale(),
    getTranslations("blog"),
    getBusinessInfo(),
    getPostBySlug(slug),
  ]);

  if (!post) notFound();

  const title = localized(post.title_mn, post.title_en, locale);
  const content = localized(post.content_mn, post.content_en, locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            blogPostingJsonLd(post, locale, business),
            breadcrumbJsonLd([
              { name: locale === "en" ? "Home" : "Нүүр", url: `/${locale}` },
              { name: t("title"), url: `/${locale}/blog` },
              { name: title, url: `/${locale}/blog/${slug}` },
            ]),
          ]),
        }}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/blog" },
          { name: title, href: `/blog/${slug}` },
        ]}
      />

      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{title}</h1>
      {post.published_at && (
        <p className="mt-2 text-sm text-brand-gray">
          {post.author_name || business.name} ·{" "}
          {new Date(post.published_at).toLocaleDateString(locale === "en" ? "en-US" : "mn-MN")}
        </p>
      )}

      {post.cover_image_url && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-card bg-brand-cream">
          <Image src={post.cover_image_url} alt={title} fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-sm mt-8 max-w-none whitespace-pre-line text-brand-ink">{content}</div>

      <div className="mt-10 border-t border-brand-gray-light pt-6">
        <Link href="/blog" className="text-sm font-semibold text-brand-red hover:underline">
          ← {t("backToBlog")}
        </Link>
      </div>
    </div>
  );
}
