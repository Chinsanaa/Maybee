import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/admin-category-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("category")
    .select("*")
    .order("sort_order", { ascending: true });

  const topLevel = (categories ?? []).filter((c) => !c.parent_id);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Categories</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-brand-ink">Add category</h2>
          <form action={createCategoryAction} className="mt-4 space-y-3">
            <TextField name="name_mn" placeholder="Name (MN)" required />
            <TextField name="name_en" placeholder="Name (EN)" />
            <TextField name="slug" placeholder="Slug (auto from name if blank)" />
            <select name="parent_id" className="w-full rounded-card border border-brand-gray-light px-3 py-2 text-sm">
              <option value="">Top-level category</option>
              {topLevel.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_mn}
                </option>
              ))}
            </select>
            <TextField type="number" name="sort_order" placeholder="Sort order" defaultValue={0} />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-semibold text-brand-ink">All categories</h2>
          <ul className="mt-4 space-y-3">
            {(categories ?? []).map((c) => (
              <li key={c.id} className="rounded-card border border-brand-gray-light p-3">
                <form action={updateCategoryAction} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  {c.parent_id && <span className="text-xs text-brand-gray">↳</span>}
                  <input
                    name="name_mn"
                    defaultValue={c.name_mn}
                    className="w-40 rounded-card border border-brand-gray-light px-2 py-1 text-sm"
                  />
                  <input
                    name="name_en"
                    defaultValue={c.name_en}
                    className="w-40 rounded-card border border-brand-gray-light px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={c.sort_order}
                    className="w-16 rounded-card border border-brand-gray-light px-2 py-1 text-sm"
                  />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" name="is_active" defaultChecked={c.is_active} />
                    Active
                  </label>
                  <Button type="submit" variant="ghost" size="sm">
                    Save
                  </Button>
                </form>
                <form action={deleteCategoryAction} className="mt-1">
                  <input type="hidden" name="id" value={c.id} />
                  <Button type="submit" variant="danger" size="sm" className="!text-brand-gray">
                    Delete
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
