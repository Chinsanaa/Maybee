import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedCategories } from "@/lib/catalog";
import { getLocale } from "next-intl/server";

function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}

export default async function NotFound() {
  const [t, locale, categories] = await Promise.all([
    getTranslations("notFound"),
    getLocale(),
    getFeaturedCategories(6),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="font-display text-6xl font-extrabold text-brand-red">404</p>
      <h1 className="font-display mt-4 text-2xl font-extrabold text-brand-ink">{t("title")}</h1>
      <p className="mt-2 text-brand-gray">{t("subtitle")}</p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
      >
        {t("cta")}
      </Link>

      {categories.length > 0 && (
        <div className="mt-10">
          <p className="text-sm font-semibold text-brand-ink">
            {locale === "en" ? "Or browse a category:" : "Эсвэл ангилалаас сонгоно уу:"}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${locale === "en" && c.slug_en ? c.slug_en : c.slug_mn}`}
                className="rounded-full border border-brand-gray-light px-4 py-2 text-sm font-medium hover:border-brand-red hover:text-brand-red"
              >
                {localized(c.name_mn, c.name_en, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
