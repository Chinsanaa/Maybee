"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink, Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="font-display text-6xl font-extrabold text-brand-red">!</p>
      <h1 className="font-display mt-4 text-2xl font-extrabold text-brand-ink">{t("title")}</h1>
      <p className="mt-2 text-brand-gray">{t("subtitle")}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>{t("retry")}</Button>
        <ButtonLink href="/" variant="secondary">
          {t("cta")}
        </ButtonLink>
      </div>
    </div>
  );
}
