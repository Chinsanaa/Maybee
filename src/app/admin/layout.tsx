import type { ReactNode } from "react";
import type { Metadata } from "next";
import { bodyFont } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Maybee Pop & Joy", template: "%s — Maybee Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bodyFont.variable}>
      <body className="min-h-screen bg-brand-cream text-brand-ink antialiased">{children}</body>
    </html>
  );
}
