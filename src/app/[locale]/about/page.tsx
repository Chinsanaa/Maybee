import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getBusinessInfo } from "@/lib/business-info";
import { aboutPageJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { Card } from "@/components/ui/card";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const business = await getBusinessInfo();
  const story = localized(business.about_story_mn, business.about_story_en, locale);
  const description = (story || localized(business.description_mn, business.description_en, locale)).slice(0, 160);
  return {
    title: locale === "en" ? "About Us" : "Бидний тухай",
    description: description || undefined,
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage() {
  const [locale, t, business] = await Promise.all([
    getLocale(),
    getTranslations("about"),
    getBusinessInfo(),
  ]);

  const story = localized(business.about_story_mn, business.about_story_en, locale);
  const paragraphs = story
    ? story.split("\n\n").filter(Boolean)
    : [localized(business.description_mn, business.description_en, locale)].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            aboutPageJsonLd(business, locale),
            breadcrumbJsonLd([
              { name: locale === "en" ? "Home" : "Нүүр", url: `/${locale}` },
              { name: t("breadcrumb"), url: `/${locale}/about` },
            ]),
          ]),
        }}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("breadcrumb"), href: "/about" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      <Card padding="p-6" className="mt-8 sm:p-8">
        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p key={i} className="mt-4 text-brand-gray first:mt-0">
              {para}
            </p>
          ))
        ) : (
          <p className="text-brand-gray">{business.name}</p>
        )}
      </Card>
    </div>
  );
}
