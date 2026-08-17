import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Picks the localized string for the current locale, falling back to
 * Mongolian when the English value is unset. */
export function localized(mn: string, en: string, locale: string) {
  return locale === "en" && en ? en : mn;
}
