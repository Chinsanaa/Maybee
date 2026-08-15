import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCartItemCount } from "@/lib/cart";
import { getTranslations } from "next-intl/server";

export async function CartLink() {
  const [count, t] = await Promise.all([getCartItemCount(), getTranslations("nav")]);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center rounded-full p-2 text-brand-ink hover:bg-brand-gray-light/50"
      aria-label={`${t("cart")}${count > 0 ? ` (${count})` : ""}`}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
