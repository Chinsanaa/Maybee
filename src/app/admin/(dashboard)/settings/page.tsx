import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateBusinessInfoAction } from "@/app/actions/admin-settings-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField, TextAreaField } from "@/components/ui/form-field";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: business } = await supabase.from("business_info").select("*").eq("id", 1).maybeSingle();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Site Settings</h1>

      <Card>
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
            <TextField label="Name" name="name" defaultValue={business?.name} />
            <TextField label="General phone" name="phone" defaultValue={business?.phone} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextAreaField label="Description (MN)" name="description_mn" defaultValue={business?.description_mn} rows={2} />
            <TextAreaField label="Description (EN)" name="description_en" defaultValue={business?.description_en} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Instagram URL" name="instagram_url" defaultValue={business?.instagram_url} />
            <TextField label="Facebook URL" name="facebook_url" defaultValue={business?.facebook_url} />
          </div>
          <TextField label="Google Review URL" name="google_review_url" defaultValue={business?.google_review_url} />

          <div className="border-t border-brand-gray-light pt-4">
            <h2 className="font-semibold text-brand-ink">Product Showcase</h2>
            <p className="mt-1 text-xs text-brand-gray">
              When off, Shop/Product/Gift Finder/Search links and homepage catalog sections are hidden from
              navigation. Direct links to those pages still work — nothing is blocked, just not advertised.
              Turn this on once your catalog is ready to feature.
            </p>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" name="showcase_enabled" defaultChecked={business?.showcase_enabled ?? false} />
              Show product catalog on the storefront
            </label>
          </div>

          <div className="border-t border-brand-gray-light pt-4">
            <h2 className="font-semibold text-brand-ink">About Page</h2>
            <p className="mt-1 text-xs text-brand-gray">
              Shown on the /about page (and as an excerpt on the homepage when the showcase is off). Separate
              paragraphs with a blank line.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <TextAreaField
                label="About story (MN)"
                name="about_story_mn"
                defaultValue={business?.about_story_mn}
                rows={8}
              />
              <TextAreaField
                label="About story (EN)"
                name="about_story_en"
                defaultValue={business?.about_story_en}
                rows={8}
              />
            </div>
          </div>

          <Button type="submit">Save business info</Button>
        </form>
      </Card>
    </div>
  );
}
