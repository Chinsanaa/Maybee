import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createProductAction } from "@/app/actions/admin-product-actions";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase.from("category").select("id, name_mn").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">New Product</h1>
      <div className="mt-6 max-w-3xl rounded-card border border-brand-gray-light bg-white p-6">
        <ProductForm action={createProductAction} categories={categories ?? []} />
      </div>
    </div>
  );
}
