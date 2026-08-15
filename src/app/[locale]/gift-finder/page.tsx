import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { listProducts } from "@/lib/catalog";
import { getBusinessInfo } from "@/lib/business-info";
import { ProductCard } from "@/components/product/product-card";
import { GiftFinderWizard } from "@/components/gift-finder/gift-finder-wizard";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Gift Finder" : "Бэлэг олох",
    description:
      locale === "en"
        ? "Answer a few quick questions to find the right toy or gift for any child."
        : "Хэдхэн асуултад хариулаад хүүхдэд тохирох тоглоом, бэлгийг олоорой.",
    alternates: { canonical: `/${locale}/gift-finder` },
  };
}

export default async function GiftFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string; maxPrice?: string; interest?: string }>;
}) {
  const { age, maxPrice, interest } = await searchParams;
  const [locale, t, business] = await Promise.all([
    getLocale(),
    getTranslations("home"),
    getBusinessInfo(),
  ]);

  const hasAnswers = Boolean(age || maxPrice || interest);
  const results = hasAnswers
    ? await listProducts({
        ageMonths: age ? Number(age) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        interestTags: interest ? interest.split(",") : undefined,
        pageSize: 24,
      })
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: locale === "en" ? "Gift Finder" : "Бэлэг олох", href: "/gift-finder" },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{t("giftFinderTitle")}</h1>
      <p className="mt-2 max-w-xl text-sm text-brand-gray">{t("giftFinderSubtitle")}</p>

      <div className="mt-8">
        <GiftFinderWizard />
      </div>

      {results && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-bold text-brand-ink">
            {locale === "en" ? `${results.total} matching gifts` : `${results.total} тохирох бэлэг`}
          </h2>
          {results.products.length === 0 ? (
            <p className="mt-4 text-brand-gray">
              {locale === "en"
                ? "No products matched — try widening your budget or interests above."
                : "Тохирох бүтээгдэхүүн олдсонгүй — төсөв эсвэл сонирхолын хүрээгээ өргөтгөж үзнэ үү."}
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.products.map((p) => (
                <ProductCard key={p.id} product={p} business={business} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
