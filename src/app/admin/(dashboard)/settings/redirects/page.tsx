import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createRedirectAction, deleteRedirectAction } from "@/app/actions/admin-seo-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminRedirectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: redirects } = await supabase
    .from("seo_redirect")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">SEO Redirects</h1>
      <p className="mt-1 text-sm text-brand-gray">
        Use this when a product or category URL changes or is discontinued, so old links (and Google) get sent to the right place instead of a 404.
      </p>

      <Card className="mt-6">
        <form action={createRedirectAction} className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            From path
            <input
              name="from_path"
              placeholder="/mn/product/old-slug"
              required
              className="mt-1 block w-64 rounded-card border border-brand-gray-light px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            To path
            <input
              name="to_path"
              placeholder="/mn/product/new-slug"
              required
              className="mt-1 block w-64 rounded-card border border-brand-gray-light px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Status
            <select name="status_code" defaultValue={301} className="mt-1 block rounded-card border border-brand-gray-light px-3 py-2 text-sm">
              <option value={301}>301 (permanent)</option>
              <option value={302}>302 (temporary)</option>
            </select>
          </label>
          <Button type="submit" size="sm">
            Add redirect
          </Button>
        </form>
      </Card>

      <Card padding="p-4" className="mt-6 overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-gray-light bg-brand-cream text-xs uppercase text-brand-gray">
            <tr>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-light">
            {(redirects ?? []).map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs">{r.from_path}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.to_path}</td>
                <td className="px-4 py-3">{r.status_code}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteRedirectAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="text-xs font-medium text-brand-red hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(redirects ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-gray">
                  No redirects configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
