import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateBusinessInfoAction, updateDeliverySettingsAction } from "@/app/actions/admin-settings-actions";

const DAYS = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"],
  ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
] as const;

const inputCls = "mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: business }, { data: delivery }] = await Promise.all([
    supabase.from("business_info").select("*").eq("id", 1).maybeSingle(),
    supabase.from("delivery_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const hours = (business?.hours as Record<string, { open: string; close: string } | null>) ?? {};

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Site Settings</h1>

      <section className="rounded-card border border-brand-gray-light bg-white p-6">
        <h2 className="font-semibold text-brand-ink">Business Info</h2>
        <form action={updateBusinessInfoAction} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Name
              <input name="name" defaultValue={business?.name} className={inputCls} />
            </label>
            <label className="block text-sm">
              Phone
              <input name="phone" defaultValue={business?.phone} className={inputCls} />
            </label>
          </div>
          <label className="block text-sm">
            Address
            <input name="address" defaultValue={business?.address} className={inputCls} />
          </label>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Google Maps embed URL
              <input name="google_maps_embed_url" defaultValue={business?.google_maps_embed_url} className={inputCls} />
            </label>
            <label className="block text-sm">
              Google Review URL
              <input name="google_review_url" defaultValue={business?.google_review_url} className={inputCls} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Latitude
              <input name="latitude" type="number" step="any" defaultValue={business?.latitude ?? ""} className={inputCls} />
            </label>
            <label className="block text-sm">
              Longitude
              <input name="longitude" type="number" step="any" defaultValue={business?.longitude ?? ""} className={inputCls} />
            </label>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-brand-ink">Opening hours</legend>
            <div className="mt-2 space-y-2">
              {DAYS.map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-24 text-sm text-brand-gray">{label}</span>
                  <input
                    type="time"
                    name={`hours_${key}_open`}
                    defaultValue={hours[key]?.open ?? ""}
                    className="rounded-lg border border-brand-gray-light px-2 py-1 text-sm"
                  />
                  <span>–</span>
                  <input
                    type="time"
                    name={`hours_${key}_close`}
                    defaultValue={hours[key]?.close ?? ""}
                    className="rounded-lg border border-brand-gray-light px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark">
            Save business info
          </button>
        </form>
      </section>

      <section className="rounded-card border border-brand-gray-light bg-white p-6">
        <h2 className="font-semibold text-brand-ink">Delivery Settings</h2>
        <form action={updateDeliverySettingsAction} className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="pickup_enabled" defaultChecked={delivery?.pickup_enabled} />
              Store pickup enabled
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="delivery_enabled" defaultChecked={delivery?.delivery_enabled} />
              Delivery enabled
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="same_day_enabled" defaultChecked={delivery?.same_day_enabled} />
              Same-day delivery
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Base delivery fee (₮)
              <input type="number" name="base_fee" defaultValue={delivery?.base_fee ?? 0} className={inputCls} />
            </label>
            <label className="block text-sm">
              Free delivery threshold (₮)
              <input type="number" name="free_threshold" defaultValue={delivery?.free_threshold ?? ""} className={inputCls} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Estimated time (MN)
              <input name="estimated_time_mn" defaultValue={delivery?.estimated_time_mn} className={inputCls} />
            </label>
            <label className="block text-sm">
              Estimated time (EN)
              <input name="estimated_time_en" defaultValue={delivery?.estimated_time_en} className={inputCls} />
            </label>
          </div>
          <button type="submit" className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark">
            Save delivery settings
          </button>
        </form>
      </section>
    </div>
  );
}
