import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
} from "@/app/actions/admin-location-actions";

const DAYS = [
  ["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"],
  ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"],
] as const;

const inputCls = "mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm";

export default async function AdminLocationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: locations } = await supabase
    .from("store_location")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Locations</h1>
      <p className="mt-1 text-sm text-brand-gray">Manage each physical branch — address, hours, phone, and map.</p>

      <div className="mt-6 rounded-card border border-brand-gray-light bg-white p-6">
        <h2 className="font-semibold text-brand-ink">Add branch</h2>
        <form action={createLocationAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="name_mn" placeholder="Name (MN)" required className={inputCls} />
          <input name="name_en" placeholder="Name (EN)" className={inputCls} />
          <input name="slug" placeholder="Slug (auto from name if blank)" className={inputCls} />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={0} className={inputCls} />
          <input name="address" placeholder="Address (EN)" className={`sm:col-span-2 ${inputCls}`} />
          <input name="address_mn" placeholder="Хаяг (MN)" className={`sm:col-span-2 ${inputCls}`} />
          <input name="district" placeholder="District" className={inputCls} />
          <input name="phone" placeholder="Phone (optional — falls back to general number)" className={inputCls} />
          <input name="google_maps_embed_url" placeholder="Google Maps embed URL" className={`sm:col-span-2 ${inputCls}`} />
          <input name="latitude" type="number" step="any" placeholder="Latitude" className={inputCls} />
          <input name="longitude" type="number" step="any" placeholder="Longitude" className={inputCls} />
          <button type="submit" className="w-fit rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark sm:col-span-2">
            Add branch
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-6">
        {(locations ?? []).map((location) => (
          <div key={location.id} className="rounded-card border border-brand-gray-light bg-white p-6">
            <form action={updateLocationAction} className="space-y-4">
              <input type="hidden" name="id" value={location.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  Name (MN)
                  <input name="name_mn" defaultValue={location.name_mn} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Name (EN)
                  <input name="name_en" defaultValue={location.name_en} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Address (EN)
                  <input name="address" defaultValue={location.address} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Хаяг (MN)
                  <input name="address_mn" defaultValue={location.address_mn} className={inputCls} />
                </label>
                <label className="block text-sm">
                  District
                  <input name="district" defaultValue={location.district} className={inputCls} />
                </label>
                <label className="block text-sm">
                  City
                  <input name="city" defaultValue={location.city} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Phone (optional override)
                  <input name="phone" defaultValue={location.phone ?? ""} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Sort order
                  <input name="sort_order" type="number" defaultValue={location.sort_order} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Google Maps embed URL
                  <input name="google_maps_embed_url" defaultValue={location.google_maps_embed_url} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Latitude
                  <input name="latitude" type="number" step="any" defaultValue={location.latitude ?? ""} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Longitude
                  <input name="longitude" type="number" step="any" defaultValue={location.longitude ?? ""} className={inputCls} />
                </label>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-brand-ink">Opening hours</legend>
                <div className="mt-2 space-y-1">
                  {DAYS.map(([key, label]) => {
                    const hours = (location.hours as Record<string, { open: string; close: string } | null>) ?? {};
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-10 text-xs text-brand-gray">{label}</span>
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
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={location.is_active} />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_primary" defaultChecked={location.is_primary} />
                  Primary branch
                </label>
                <button type="submit" className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white">
                  Save
                </button>
              </div>
            </form>
            <form action={deleteLocationAction} className="mt-3 border-t border-brand-gray-light pt-3">
              <input type="hidden" name="id" value={location.id} />
              <button type="submit" className="text-xs font-medium text-brand-red hover:underline">
                Delete branch
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
