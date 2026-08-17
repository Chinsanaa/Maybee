import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
  addLandmarkAction,
  removeLandmarkAction,
} from "@/app/actions/admin-location-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";
import type { Landmark } from "@/lib/business-info";

const DAYS = [
  ["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"],
  ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"],
] as const;

const LANDMARK_CATEGORIES = ["mall", "shop", "landmark", "transit"] as const;

export default async function AdminLocationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: locations } = await supabase
    .from("store_location")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Locations</h1>
      <p className="mt-1 text-sm text-brand-gray">Manage each physical branch — address, hours, phone, map, and nearby landmarks.</p>

      <Card className="mt-6">
        <h2 className="font-semibold text-brand-ink">Add branch</h2>
        <form action={createLocationAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="name_mn" placeholder="Name (MN)" required />
          <TextField name="name_en" placeholder="Name (EN)" />
          <TextField name="slug" placeholder="Slug (auto from name if blank)" />
          <TextField name="sort_order" type="number" placeholder="Sort order" defaultValue={0} />
          <TextField name="address" placeholder="Address (EN)" className="sm:col-span-2" />
          <TextField name="address_mn" placeholder="Хаяг (MN)" className="sm:col-span-2" />
          <TextField name="district" placeholder="District" />
          <TextField name="phone" placeholder="Phone (optional — falls back to general number)" />
          <TextField name="google_maps_embed_url" placeholder="Google Maps embed URL (optional fallback)" className="sm:col-span-2" />
          <TextField name="latitude" type="number" step="any" placeholder="Latitude" />
          <TextField name="longitude" type="number" step="any" placeholder="Longitude" />
          <Button type="submit" size="sm" className="w-fit sm:col-span-2">
            Add branch
          </Button>
        </form>
      </Card>

      <div className="mt-6 space-y-6">
        {(locations ?? []).map((location) => {
          const landmarks = (Array.isArray(location.landmarks) ? location.landmarks : []) as unknown as Landmark[];
          return (
            <Card key={location.id}>
              <form action={updateLocationAction} className="space-y-4">
                <input type="hidden" name="id" value={location.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Name (MN)" name="name_mn" defaultValue={location.name_mn} />
                  <TextField label="Name (EN)" name="name_en" defaultValue={location.name_en} />
                  <TextField
                    label="Address (EN)"
                    name="address"
                    defaultValue={location.address}
                    className="sm:col-span-2"
                  />
                  <TextField
                    label="Хаяг (MN)"
                    name="address_mn"
                    defaultValue={location.address_mn}
                    className="sm:col-span-2"
                  />
                  <TextField label="District" name="district" defaultValue={location.district} />
                  <TextField label="City" name="city" defaultValue={location.city} />
                  <TextField label="Phone (optional override)" name="phone" defaultValue={location.phone ?? ""} />
                  <TextField label="Sort order" name="sort_order" type="number" defaultValue={location.sort_order} />
                  <TextField
                    label="Google Maps embed URL (optional fallback)"
                    name="google_maps_embed_url"
                    defaultValue={location.google_maps_embed_url}
                    className="sm:col-span-2"
                  />
                  <TextField
                    label="Latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    defaultValue={location.latitude ?? ""}
                  />
                  <TextField
                    label="Longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    defaultValue={location.longitude ?? ""}
                  />
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
                            className="rounded-card border border-brand-gray-light px-2 py-1 text-sm"
                          />
                          <span>–</span>
                          <input
                            type="time"
                            name={`hours_${key}_close`}
                            defaultValue={hours[key]?.close ?? ""}
                            className="rounded-card border border-brand-gray-light px-2 py-1 text-sm"
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
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </form>

              <div className="mt-6 border-t border-brand-gray-light pt-4">
                <h3 className="text-sm font-semibold text-brand-ink">Nearby landmarks</h3>
                <p className="mt-1 text-xs text-brand-gray">
                  Shown on the branch page&apos;s map to help customers find the store. Only add real, known landmarks.
                </p>
                {landmarks.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {landmarks.map((l, i) => (
                      <li key={i} className="flex items-center justify-between gap-2 text-sm">
                        <span>
                          <span className="font-medium text-brand-ink">{l.name_mn}</span>{" "}
                          <span className="text-xs text-brand-gray">
                            ({l.category}, {l.latitude}, {l.longitude})
                          </span>
                        </span>
                        <form action={removeLandmarkAction}>
                          <input type="hidden" name="location_id" value={location.id} />
                          <input type="hidden" name="index" value={i} />
                          <Button type="submit" variant="danger" size="sm">
                            Remove
                          </Button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}
                <form action={addLandmarkAction} className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input type="hidden" name="location_id" value={location.id} />
                  <TextField name="name_mn" placeholder="Landmark name (MN)" required />
                  <TextField name="name_en" placeholder="Landmark name (EN)" />
                  <label className="block text-sm">
                    <select
                      name="category"
                      defaultValue="landmark"
                      className="mt-1 w-full rounded-card border border-brand-gray-light px-3 py-2 text-sm"
                    >
                      {LANDMARK_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <TextField name="latitude" type="number" step="any" placeholder="Latitude" required />
                    <TextField name="longitude" type="number" step="any" placeholder="Longitude" required />
                  </div>
                  <Button type="submit" size="sm" className="w-fit sm:col-span-2">
                    Add landmark
                  </Button>
                </form>
              </div>

              <form action={deleteLocationAction} className="mt-6 border-t border-brand-gray-light pt-3">
                <input type="hidden" name="id" value={location.id} />
                <Button type="submit" variant="danger" size="sm">
                  Delete branch
                </Button>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
