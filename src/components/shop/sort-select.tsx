"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

const OPTIONS: { value: string; labelMn: string; labelEn: string }[] = [
  { value: "relevance", labelMn: "Тохирол", labelEn: "Relevance" },
  { value: "newest", labelMn: "Шинэ эхэндээ", labelEn: "Newest" },
  { value: "price_asc", labelMn: "Үнэ: багаас их", labelEn: "Price: Low to High" },
  { value: "price_desc", labelMn: "Үнэ: ихээс бага", labelEn: "Price: High to Low" },
  { value: "bestselling", labelMn: "Эрэлттэй", labelEn: "Best Selling" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const current = searchParams.get("sort") ?? "relevance";

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === "relevance") params.delete("sort");
        else params.set("sort", e.target.value);
        router.push(`${pathname}?${params.toString()}`);
      }}
      className="rounded-full border border-brand-gray-light bg-white px-3 py-2 text-sm"
      aria-label={locale === "en" ? "Sort by" : "Эрэмбэлэх"}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {locale === "en" ? o.labelEn : o.labelMn}
        </option>
      ))}
    </select>
  );
}
