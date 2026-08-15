"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createRedirectAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  await supabase.from("seo_redirect").insert({
    from_path: String(formData.get("from_path") ?? "").trim(),
    to_path: String(formData.get("to_path") ?? "").trim(),
    status_code: Number(formData.get("status_code") ?? 301),
  });
  revalidatePath("/admin/settings/redirects");
}

export async function deleteRedirectAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  await supabase.from("seo_redirect").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/settings/redirects");
}
