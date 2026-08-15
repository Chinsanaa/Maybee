"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateBusinessInfoAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const hours: Record<string, { open: string; close: string } | null> = {};
  for (const d of days) {
    const open = String(formData.get(`hours_${d}_open`) ?? "");
    const close = String(formData.get(`hours_${d}_close`) ?? "");
    hours[d] = open && close ? { open, close } : null;
  }

  await supabase
    .from("business_info")
    .update({
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      description_mn: String(formData.get("description_mn") ?? ""),
      description_en: String(formData.get("description_en") ?? ""),
      instagram_url: String(formData.get("instagram_url") ?? ""),
      facebook_url: String(formData.get("facebook_url") ?? ""),
      google_maps_embed_url: String(formData.get("google_maps_embed_url") ?? ""),
      google_review_url: String(formData.get("google_review_url") ?? ""),
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      hours,
    })
    .eq("id", 1);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function updateDeliverySettingsAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  await supabase
    .from("delivery_settings")
    .update({
      base_fee: Number(formData.get("base_fee") ?? 0),
      free_threshold: formData.get("free_threshold") ? Number(formData.get("free_threshold")) : null,
      pickup_enabled: formData.get("pickup_enabled") === "on",
      delivery_enabled: formData.get("delivery_enabled") === "on",
      same_day_enabled: formData.get("same_day_enabled") === "on",
      estimated_time_mn: String(formData.get("estimated_time_mn") ?? ""),
      estimated_time_en: String(formData.get("estimated_time_en") ?? ""),
    })
    .eq("id", 1);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
