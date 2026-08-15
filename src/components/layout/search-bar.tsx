"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
    >
      <div className="flex items-center gap-2 rounded-full border border-brand-gray-light bg-white px-4 py-2">
        <Search className="h-4 w-4 shrink-0 text-brand-gray" aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-brand-gray"
        />
      </div>
    </form>
  );
}
