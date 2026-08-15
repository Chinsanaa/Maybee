import { Baloo_2, Inter } from "next/font/google";

/**
 * Baloo 2: bold rounded display font matching the Maybee wordmark.
 * Used ONLY for the logo/wordmark, hero display text, and badges —
 * never for body copy — to keep the site premium rather than childish.
 */
export const displayFont = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

/** Inter: clean, highly legible sans for all UI, navigation, and body text. */
export const bodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
