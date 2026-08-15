"use client";

import { useTranslations } from "next-intl";
import { Share2 } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const t = useTranslations("product");

  return (
    <button
      type="button"
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title, url: window.location.href }).catch(() => {});
        } else {
          navigator.clipboard?.writeText(window.location.href);
        }
      }}
      className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-red"
    >
      <Share2 className="h-4 w-4" aria-hidden />
      {t("share")}
    </button>
  );
}
