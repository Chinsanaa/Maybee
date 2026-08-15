/** Formats an integer MNT amount (no minor units in practice) as "12,000₮". */
export function formatPrice(
  amount: number,
  currencySymbol = "₮",
  locale: string = "mn"
): string {
  const formatted = new Intl.NumberFormat(locale === "mn" ? "mn-MN" : "en-US").format(
    amount
  );
  return `${formatted}${currencySymbol}`;
}

export function discountPercent(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
