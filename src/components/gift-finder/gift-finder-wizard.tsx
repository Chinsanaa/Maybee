"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AGE_BANDS, BUDGET_BANDS, INTEREST_TAGS } from "@/lib/collections";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2;

export function GiftFinderWizard() {
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [ageSlug, setAgeSlug] = useState<string | null>(null);
  const [budgetSlug, setBudgetSlug] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  function toggleInterest(value: string) {
    setInterests((cur) => (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]));
  }

  function submit() {
    const age = AGE_BANDS.find((b) => b.slug === ageSlug);
    const budget = BUDGET_BANDS.find((b) => b.slug === budgetSlug);
    const params = new URLSearchParams();
    if (age) params.set("age", String(age.minMonths));
    if (budget?.maxPrice) params.set("maxPrice", String(budget.maxPrice));
    if (interests.length > 0) params.set("interest", interests.join(","));
    router.push(`/gift-finder?${params.toString()}`);
  }

  const steps = [
    {
      title: locale === "en" ? "How old is the child?" : "Хүүхэд хэдэн настай вэ?",
      content: (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {AGE_BANDS.map((band) => (
            <button
              key={band.slug}
              type="button"
              onClick={() => setAgeSlug(band.slug)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm font-semibold",
                ageSlug === band.slug
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-brand-gray-light text-brand-ink hover:border-brand-red"
              )}
            >
              {locale === "en" ? band.labelEn : band.labelMn}
            </button>
          ))}
        </div>
      ),
      canNext: ageSlug !== null,
    },
    {
      title: locale === "en" ? "What's your budget?" : "Төсөв хэд вэ?",
      content: (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {BUDGET_BANDS.map((band) => (
            <button
              key={band.slug}
              type="button"
              onClick={() => setBudgetSlug(band.slug)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm font-semibold",
                budgetSlug === band.slug
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-brand-gray-light text-brand-ink hover:border-brand-red"
              )}
            >
              {locale === "en" ? band.labelEn : band.labelMn}
            </button>
          ))}
        </div>
      ),
      canNext: budgetSlug !== null,
    },
    {
      title: locale === "en" ? "What are they interested in?" : "Юу сонирхдог вэ?",
      subtitle: locale === "en" ? "Optional — pick any that apply" : "Заавал биш — тохирохыг сонго",
      content: (
        <div className="flex flex-wrap gap-2">
          {INTEREST_TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggleInterest(tag.value)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm font-semibold",
                interests.includes(tag.value)
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-brand-gray-light text-brand-ink hover:border-brand-red"
              )}
            >
              {locale === "en" ? tag.labelEn : tag.labelMn}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
  ];

  const current = steps[step];

  return (
    <div className="rounded-card border border-brand-gray-light bg-white p-6">
      <div className="flex items-center gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-brand-red" : "bg-brand-gray-light")}
          />
        ))}
      </div>

      <h2 className="font-display mt-4 text-xl font-bold text-brand-ink">{current.title}</h2>
      {current.subtitle && <p className="mt-1 text-sm text-brand-gray">{current.subtitle}</p>}
      <div className="mt-4">{current.content}</div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
          disabled={step === 0}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-gray disabled:opacity-0"
        >
          {locale === "en" ? "Back" : "Буцах"}
        </button>
        {step < 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s < 2 ? ((s + 1) as Step) : s))}
            disabled={!current.canNext}
            className="rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:bg-brand-gray-light disabled:text-brand-gray"
          >
            {locale === "en" ? "Next" : "Дараах"}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            data-analytics-event="complete_gift_finder"
            className="rounded-full bg-brand-red px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark"
          >
            {locale === "en" ? "Find Gifts" : "Бэлэг олох"}
          </button>
        )}
      </div>
    </div>
  );
}
