import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getActiveFaqs, groupFaqsByCategory } from "@/lib/faq";
import { faqJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

const CATEGORY_LABELS: Record<string, { mn: string; en: string }> = {
  general: { mn: "Ерөнхий", en: "General" },
  ordering: { mn: "Худалдан авалт", en: "Ordering" },
  products: { mn: "Бүтээгдэхүүн", en: "Products" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Frequently Asked Questions" : "Түгээмэл асуултууд",
    alternates: { canonical: `/${locale}/faq` },
  };
}

export default async function FaqPage() {
  const [locale, t, faqs] = await Promise.all([getLocale(), getTranslations("faq"), getActiveFaqs()]);
  const grouped = groupFaqsByCategory(faqs);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs, locale)) }}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: t("title"), href: "/faq" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("title")}</h1>

      {faqs.length === 0 ? (
        <p className="mt-6 text-brand-gray">{t("noResults")}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {Array.from(grouped.entries()).map(([category, items]) => {
            const label = CATEGORY_LABELS[category];
            return (
              <section key={category}>
                <h2 className="font-display text-lg font-bold text-brand-ink">
                  {label ? (locale === "en" ? label.en : label.mn) : category}
                </h2>
                <dl className="mt-4 space-y-5">
                  {items.map((faq) => (
                    <div key={faq.id} className="rounded-card border border-brand-gray-light bg-white p-4">
                      <dt className="font-semibold text-brand-ink">
                        {localized(faq.question_mn, faq.question_en, locale)}
                      </dt>
                      <dd className="mt-2 text-sm text-brand-gray">
                        {localized(faq.answer_mn, faq.answer_en, locale)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
