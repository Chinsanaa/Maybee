import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

export type BusinessHours = Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  { open: string; close: string } | null
>;

export type BusinessInfo = Tables<"business_info"> & { hours: BusinessHours };

const FALLBACK: BusinessInfo = {
  id: 1,
  name: "Maybee Pop & Joy",
  description_mn: "",
  description_en: "",
  phone: "",
  address: "",
  address_mn: "",
  district: "",
  city: "Улаанбаатар",
  latitude: null,
  longitude: null,
  hours: {
    mon: { open: "11:00", close: "21:00" },
    tue: { open: "11:00", close: "21:00" },
    wed: { open: "11:00", close: "21:00" },
    thu: { open: "11:00", close: "21:00" },
    fri: { open: "11:00", close: "21:00" },
    sat: { open: "11:00", close: "21:00" },
    sun: { open: "11:00", close: "21:00" },
  },
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  logo_url: "",
  currency_code: "MNT",
  currency_symbol: "₮",
  google_review_url: "",
  google_maps_embed_url: "",
  updated_at: new Date().toISOString(),
};

/**
 * Single source of truth for business info (address, hours, phone, socials).
 * Every page that needs this data (header, footer, store page, JSON-LD,
 * contact page) reads from here — never hardcode these values elsewhere.
 * Cached per-request via React `cache` since it's read many times per render.
 */
export const getBusinessInfo = cache(async (): Promise<BusinessInfo> => {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("business_info")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!data) return FALLBACK;
    return { ...FALLBACK, ...data, hours: (data.hours as BusinessHours) ?? FALLBACK.hours };
  } catch {
    return FALLBACK;
  }
});

export type DeliverySettings = Tables<"delivery_settings">;

const DELIVERY_FALLBACK: DeliverySettings = {
  id: 1,
  zones: [],
  base_fee: 0,
  free_threshold: null,
  estimated_time_mn: "",
  estimated_time_en: "",
  same_day_enabled: false,
  pickup_enabled: true,
  delivery_enabled: false,
  payment_methods: [],
  updated_at: new Date().toISOString(),
};

export const getDeliverySettings = cache(async (): Promise<DeliverySettings> => {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("delivery_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return data ? { ...DELIVERY_FALLBACK, ...data } : DELIVERY_FALLBACK;
  } catch {
    return DELIVERY_FALLBACK;
  }
});

const DAY_ORDER: (keyof BusinessHours)[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function formatHoursSummary(hours: BusinessHours, locale: string): string {
  const allSame = DAY_ORDER.every((d) => {
    const a = hours[d];
    const b = hours.mon;
    return a?.open === b?.open && a?.close === b?.close;
  });
  if (allSame && hours.mon) {
    return locale === "en"
      ? `Daily ${hours.mon.open}–${hours.mon.close}`
      : `Өдөр бүр ${hours.mon.open}-${hours.mon.close}`;
  }
  return DAY_ORDER.map((d) => (hours[d] ? `${d}: ${hours[d]!.open}-${hours[d]!.close}` : `${d}: closed`)).join(", ");
}
