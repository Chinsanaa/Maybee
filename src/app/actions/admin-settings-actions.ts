"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateBusinessInfoAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  await supabase
    .from("business_info")
    .update({
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      description_mn: String(formData.get("description_mn") ?? ""),
      description_en: String(formData.get("description_en") ?? ""),
      instagram_url: String(formData.get("instagram_url") ?? ""),
      facebook_url: String(formData.get("facebook_url") ?? ""),
      google_review_url: String(formData.get("google_review_url") ?? ""),
      showcase_enabled: formData.get("showcase_enabled") === "on",
      about_story_mn: String(formData.get("about_story_mn") ?? ""),
      about_story_en: String(formData.get("about_story_en") ?? ""),
    })
    .eq("id", 1);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
