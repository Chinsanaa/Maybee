/**
 * Looks up an admin-configured 301 redirect for a path (edge-safe: plain
 * fetch against PostgREST, no supabase-js client needed in middleware).
 * Backs the "discontinued product -> replacement" and general URL-change
 * redirect system managed from the admin panel's SEO settings.
 */
export async function findRedirect(pathname: string): Promise<{ to: string; status: number } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/seo_redirect?from_path=eq.${encodeURIComponent(pathname)}&select=to_path,status_code&limit=1`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        // Redirect rules change rarely; a short edge cache keeps this cheap.
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { to_path: string; status_code: number }[];
    if (rows.length === 0) return null;
    return { to: rows[0].to_path, status: rows[0].status_code };
  } catch {
    return null;
  }
}
