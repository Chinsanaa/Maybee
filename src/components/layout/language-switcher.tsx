"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="cursor-pointer rounded-full border border-brand-gray-light bg-transparent px-3 py-1.5 text-sm font-medium text-brand-ink"
        aria-label={t("language")}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {l === "mn" ? "MN" : "EN"}
          </option>
        ))}
      </select>
    </label>
  );
}
