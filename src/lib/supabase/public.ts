import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Anon-key client for public, RLS-governed reads (published products,
 * active categories, business info, delivery settings). Safe to use from
 * any server code — never bypasses RLS, so it can't leak unpublished data.
 * Cart/order/admin writes still go through the service-role client.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.");
  }
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
