"use client";

import dynamic from "next/dynamic";
import type { Landmark } from "@/lib/business-info";

const StoreMap = dynamic(() => import("@/components/store/store-map").then((m) => m.StoreMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-64 items-center justify-center bg-brand-cream text-sm text-brand-gray">
      …
    </div>
  ),
});

export function StoreMapLoader(props: {
  storeLat: number;
  storeLng: number;
  storeName: string;
  landmarks: Landmark[];
  locale: string;
}) {
  return <StoreMap {...props} />;
}
