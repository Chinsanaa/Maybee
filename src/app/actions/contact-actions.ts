"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  message: z.string().min(5),
});

export type ContactState = { error?: string; success?: boolean } | undefined;

export async function submitContactAction(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_inquiry").insert(parsed.data);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("[contact] submitContactAction failed", err);
    return { error: "Could not send your message. Please try again or call us directly." };
  }
}
