import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateBusinessInfoAction } from "@/app/actions/admin-settings-actions";

const inputCls = "mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: business } = await supabase.from("business_info").select("*").eq("id", 1).maybeSingle();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Site Settings</h1>

      <section className="rounded-card border border-brand-gray-light bg-white p-6">
        <h2 className="font-semibold text-brand-ink">Business Info</h2>
        <p className="mt-1 text-xs text-brand-gray">
          Brand-level info only. Per-branch address/hours/map are managed on the{" "}
          <Link href="/admin/settings/locations" className="text-brand-red hover:underline">
            Locations
          </Link>{" "}
          page.
        </p>
        <form action={updateBusinessInfoAction} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Name
              <input name="name" defaultValue={business?.name} className={inputCls} />
            </label>
            <label className="block text-sm">
              General phone
              <input name="phone" defaultValue={business?.phone} className={inputCls} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Description (MN)
              <textarea name="description_mn" defaultValue={business?.description_mn} rows={2} className={inputCls} />
            </label>
            <label className="block text-sm">
              Description (EN)
              <textarea name="description_en" defaultValue={business?.description_en} rows={2} className={inputCls} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Instagram URL
              <input name="instagram_url" defaultValue={business?.instagram_url} className={inputCls} />
            </label>
            <label className="block text-sm">
              Facebook URL
              <input name="facebook_url" defaultValue={business?.facebook_url} className={inputCls} />
            </label>
          </div>
          <label className="block text-sm">
            Google Review URL
            <input name="google_review_url" defaultValue={business?.google_review_url} className={inputCls} />
          </label>

          <button type="submit" className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark">
            Save business info
          </button>
        </form>
      </section>
    </div>
  );
}
