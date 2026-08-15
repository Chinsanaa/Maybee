"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status")) as OrderStatus;
  const note = String(formData.get("note") ?? "");

  const supabase = await createServerSupabaseClient();
  await supabase.from("order").update({ status }).eq("id", orderId);
  await supabase.from("order_status_history").insert({ order_id: orderId, status, note: note || null });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function updateOrderNotesAction(formData: FormData) {
  const orderId = String(formData.get("orderId"));
  const internalNotes = String(formData.get("internal_notes") ?? "");

  const supabase = await createServerSupabaseClient();
  await supabase.from("order").update({ internal_notes: internalNotes }).eq("id", orderId);

  revalidatePath(`/admin/orders/${orderId}`);
}
