"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

function hoursFromForm(formData: FormData) {
  const hours: Record<string, { open: string; close: string } | null> = {};
  for (const d of DAYS) {
    const open = String(formData.get(`hours_${d}_open`) ?? "");
    const close = String(formData.get(`hours_${d}_close`) ?? "");
    hours[d] = open && close ? { open, close } : null;
  }
  return hours;
}

export async function createLocationAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const nameMn = String(formData.get("name_mn") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(nameEn || nameMn);

  const { error } = await supabase.from("store_location").insert({
    slug,
    name_mn: nameMn,
    name_en: nameEn,
    address: String(formData.get("address") ?? ""),
    address_mn: String(formData.get("address_mn") ?? ""),
    district: String(formData.get("district") ?? ""),
    city: String(formData.get("city") ?? "Улаанбаатар"),
    phone: String(formData.get("phone") ?? "") || null,
    google_maps_embed_url: String(formData.get("google_maps_embed_url") ?? ""),
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    hours: hoursFromForm(formData),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings/locations");
  revalidatePath("/", "layout");
}

export async function updateLocationAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));

  await supabase
    .from("store_location")
    .update({
      name_mn: String(formData.get("name_mn") ?? "").trim(),
      name_en: String(formData.get("name_en") ?? "").trim(),
      address: String(formData.get("address") ?? ""),
      address_mn: String(formData.get("address_mn") ?? ""),
      district: String(formData.get("district") ?? ""),
      city: String(formData.get("city") ?? "Улаанбаатар"),
      phone: String(formData.get("phone") ?? "") || null,
      google_maps_embed_url: String(formData.get("google_maps_embed_url") ?? ""),
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      hours: hoursFromForm(formData),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") === "on",
      is_primary: formData.get("is_primary") === "on",
    })
    .eq("id", id);

  revalidatePath("/admin/settings/locations");
  revalidatePath("/", "layout");
}

export async function deleteLocationAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  await supabase.from("store_location").delete().eq("id", id);
  revalidatePath("/admin/settings/locations");
  revalidatePath("/", "layout");
}

export async function addLandmarkAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const locationId = String(formData.get("location_id"));

  const { data: location } = await supabase
    .from("store_location")
    .select("landmarks")
    .eq("id", locationId)
    .maybeSingle();
  if (!location) return;

  const landmarks = Array.isArray(location.landmarks) ? location.landmarks : [];
  const landmark = {
    name_mn: String(formData.get("name_mn") ?? "").trim(),
    name_en: String(formData.get("name_en") ?? "").trim(),
    category: String(formData.get("category") ?? "landmark"),
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
  };
  if (!landmark.name_mn || Number.isNaN(landmark.latitude) || Number.isNaN(landmark.longitude)) return;

  await supabase
    .from("store_location")
    .update({ landmarks: [...landmarks, landmark] })
    .eq("id", locationId);

  revalidatePath("/admin/settings/locations");
  revalidatePath("/", "layout");
}

export async function removeLandmarkAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const locationId = String(formData.get("location_id"));
  const index = Number(formData.get("index"));

  const { data: location } = await supabase
    .from("store_location")
    .select("landmarks")
    .eq("id", locationId)
    .maybeSingle();
  if (!location) return;

  const landmarks = Array.isArray(location.landmarks) ? location.landmarks : [];
  await supabase
    .from("store_location")
    .update({ landmarks: landmarks.filter((_, i) => i !== index) })
    .eq("id", locationId);

  revalidatePath("/admin/settings/locations");
  revalidatePath("/", "layout");
}
