import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/lib/database.types";

export type Faq = Tables<"faq">;

export const getActiveFaqs = cache(async (): Promise<Faq[]> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("faq")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
});

export function groupFaqsByCategory(faqs: Faq[]): Map<string, Faq[]> {
  const groups = new Map<string, Faq[]>();
  for (const faq of faqs) {
    const list = groups.get(faq.category) ?? [];
    list.push(faq);
    groups.set(faq.category, list);
  }
  return groups;
}
