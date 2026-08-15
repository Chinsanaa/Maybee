import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSession = {
  id: string;
  email: string;
  displayName: string;
  role: "OWNER" | "STAFF";
};

/**
 * Resolves the signed-in admin (if any) via the session-bound Supabase
 * client. Relies on the `admin read own row` RLS policy (auth.uid() = id),
 * so this works purely off the customer-facing anon key — no service-role
 * key required for the admin panel to authenticate.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: adminRow } = await supabase
    .from("admin_user")
    .select("id, email, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) return null;

  return {
    id: adminRow.id,
    email: adminRow.email,
    displayName: adminRow.display_name,
    role: adminRow.role,
  };
}
