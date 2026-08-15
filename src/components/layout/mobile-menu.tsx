"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("menu")}
        className="rounded-full p-2 text-brand-ink hover:bg-brand-gray-light/50"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>
      {open && (
        <nav
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-t border-brand-gray-light bg-white p-4 shadow-lg"
        >
          <Link href="/shop" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-brand-cream">
            {t("shop")}
          </Link>
          <Link href="/shop?filter=new" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-brand-cream">
            {t("newArrivals")}
          </Link>
          <Link href="/shop?filter=bestseller" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-brand-cream">
            {t("bestSellers")}
          </Link>
          <Link href="/store/next-plaza" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-brand-cream">
            {t("store")}
          </Link>
        </nav>
      )}
    </div>
  );
}
