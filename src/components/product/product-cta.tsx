import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink, buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, Store } from "lucide-react";

export async function ProductCta({ phone }: { phone: string }) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("product")]);

  return (
    <div className="flex flex-wrap gap-3">
      <ButtonLink href="/store">
        <Store className="h-4 w-4" aria-hidden />
        {locale === "en" ? "Visit Store to Buy" : "Дэлгүүрээс худалдаж авах"}
      </ButtonLink>
      <a
        href={`tel:${phone.replace(/\s+/g, "")}`}
        data-analytics-event="click_phone"
        className={cn(buttonClassName("secondary"), "flex items-center")}
      >
        <Phone className="h-4 w-4" aria-hidden />
        {t("callToInquire")}
      </a>
    </div>
  );
}
