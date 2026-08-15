import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Phone, Store } from "lucide-react";

export async function ProductCta({ phone }: { phone: string }) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("product")]);

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`tel:${phone.replace(/\s+/g, "")}`}
        data-analytics-event="click_phone"
        className="flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
      >
        <Phone className="h-4 w-4" aria-hidden />
        {t("callToOrder")}
      </a>
      <Link
        href="/store/next-plaza"
        className="flex items-center gap-2 rounded-full border-2 border-brand-ink px-6 py-3 text-sm font-bold text-brand-ink hover:bg-brand-ink hover:text-white"
      >
        <Store className="h-4 w-4" aria-hidden />
        {locale === "en" ? "Visit Store" : "Дэлгүүрт зочлох"}
      </Link>
    </div>
  );
}
