import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/database.types";

export type BusinessInfo = Tables<"business_info">;

const FALLBACK: BusinessInfo = {
  id: 1,
  name: "Maybee Pop & Joy",
  description_mn: "",
  description_en: "",
  phone: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  logo_url: "",
  currency_code: "MNT",
  currency_symbol: "₮",
  google_review_url: "",
  showcase_enabled: false,
  about_story_mn: "",
  about_story_en: "",
  updated_at: new Date().toISOString(),
};

/**
 * Single source of truth for brand-level business info (name, phone,
 * description, socials). Location-specific data (address, hours,
 * coordinates, map) lives in `store_location` — see `getStoreLocations()`
 * below, since Maybee has multiple physical branches.
 * Cached per-request via React `cache` since it's read many times per render.
 */
export const getBusinessInfo = cache(async (): Promise<BusinessInfo> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("business_info")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!data) return FALLBACK;
    return { ...FALLBACK, ...data };
  } catch {
    return FALLBACK;
  }
});

export type BusinessHours = Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  { open: string; close: string } | null
>;

export type LandmarkCategory = "mall" | "shop" | "landmark" | "transit";

export type Landmark = {
  name_mn: string;
  name_en: string;
  category: LandmarkCategory;
  latitude: number;
  longitude: number;
};

export type StoreLocation = Omit<Tables<"store_location">, "hours" | "landmarks"> & {
  hours: BusinessHours;
  landmarks: Landmark[];
};

const EMPTY_HOURS: BusinessHours = {
  mon: null,
  tue: null,
  wed: null,
  thu: null,
  fri: null,
  sat: null,
  sun: null,
};

function toStoreLocation(row: Tables<"store_location">): StoreLocation {
  return {
    ...row,
    hours: (row.hours as BusinessHours) ?? EMPTY_HOURS,
    landmarks: Array.isArray(row.landmarks) ? (row.landmarks as unknown as Landmark[]) : [],
  };
}

/** All active branches, ordered for display (primary/lowest sort_order first). */
export const getStoreLocations = cache(async (): Promise<StoreLocation[]> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("store_location")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return (data ?? []).map(toStoreLocation);
  } catch {
    return [];
  }
});

export const getStoreLocationBySlug = cache(async (slug: string): Promise<StoreLocation | null> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("store_location")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    return data ? toStoreLocation(data) : null;
  } catch {
    return null;
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
