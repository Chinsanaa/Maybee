import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateProductAction } from "@/app/actions/admin-product-actions";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("product").select("*, product_image(*)").eq("id", id).maybeSingle(),
    supabase.from("category").select("id, name_mn").order("sort_order"),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);
  const primaryImage =
    product.product_image.find((i) => i.is_primary) ?? product.product_image[0];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">Edit Product</h1>
      <div className="mt-6 max-w-3xl rounded-card border border-brand-gray-light bg-white p-6">
        <ProductForm
          action={boundAction}
          categories={categories ?? []}
          initial={{ ...product, primaryImageUrl: primaryImage?.url }}
        />
      </div>
    </div>
  );
}
