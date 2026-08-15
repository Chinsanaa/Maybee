"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadProductImageAction } from "@/app/actions/admin-product-actions";

type Category = { id: string; name_mn: string };

export type ProductFormValues = {
  id?: string;
  sku: string;
  name_mn: string;
  name_en: string;
  slug_mn: string;
  slug_en: string | null;
  brand: string;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_status: string;
  age_min_months: number | null;
  age_max_months: number | null;
  short_desc_mn: string;
  short_desc_en: string;
  description_mn: string;
  description_en: string;
  whats_included_mn: string;
  whats_included_en: string;
  safety_info_mn: string;
  safety_info_en: string;
  tags: string[];
  available_for_pickup: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  is_published: boolean;
  seo_title_mn: string;
  seo_title_en: string;
  seo_desc_mn: string;
  seo_desc_en: string;
  primaryImageUrl?: string | null;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-brand-ink">{label}</span>
      {children}
    </label>
  );
}

const inputCls = "mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm";

export function ProductForm({
  action,
  categories,
  initial,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  initial?: Partial<ProductFormValues>;
}) {
  const [imageUrl, setImageUrl] = useState(initial?.primaryImageUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadProductImageAction(fd);
    setUploading(false);
    if (result.url) setImageUrl(result.url);
    else alert(result.error);
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="image_url" value={imageUrl} />

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="SKU">
          <input name="sku" defaultValue={initial?.sku} required className={inputCls} />
        </Field>
        <Field label="Brand">
          <input name="brand" defaultValue={initial?.brand} className={inputCls} />
        </Field>
        <Field label="Name (MN)">
          <input name="name_mn" defaultValue={initial?.name_mn} required className={inputCls} />
        </Field>
        <Field label="Name (EN)">
          <input name="name_en" defaultValue={initial?.name_en} className={inputCls} />
        </Field>
        <Field label="Slug (MN)">
          <input name="slug_mn" defaultValue={initial?.slug_mn} placeholder="auto from name" className={inputCls} />
        </Field>
        <Field label="Slug (EN)">
          <input name="slug_en" defaultValue={initial?.slug_en ?? ""} placeholder="auto from name" className={inputCls} />
        </Field>
        <Field label="Category">
          <select name="category_id" defaultValue={initial?.category_id ?? ""} className={inputCls}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_mn}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₮)">
          <input type="number" name="price" defaultValue={initial?.price} required min={0} className={inputCls} />
        </Field>
        <Field label="Compare-at price (₮)">
          <input type="number" name="compare_at_price" defaultValue={initial?.compare_at_price ?? ""} min={0} className={inputCls} />
        </Field>
        <Field label="Stock status">
          <select name="stock_status" defaultValue={initial?.stock_status ?? "IN_STOCK"} className={inputCls}>
            <option value="IN_STOCK">In stock</option>
            <option value="LOW_STOCK">Low stock</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
            <option value="PREORDER">Preorder</option>
          </select>
        </Field>
        <Field label="Stock quantity">
          <input type="number" name="stock_quantity" defaultValue={initial?.stock_quantity ?? 0} min={0} className={inputCls} />
        </Field>
        <Field label="Low stock threshold">
          <input type="number" name="low_stock_threshold" defaultValue={initial?.low_stock_threshold ?? 3} min={0} className={inputCls} />
        </Field>
        <Field label="Age min (months)">
          <input type="number" name="age_min_months" defaultValue={initial?.age_min_months ?? ""} min={0} className={inputCls} />
        </Field>
        <Field label="Age max (months)">
          <input type="number" name="age_max_months" defaultValue={initial?.age_max_months ?? ""} min={0} className={inputCls} />
        </Field>
      </section>

      <section>
        <span className="text-sm font-medium text-brand-ink">Primary image</span>
        <div className="mt-1 flex items-center gap-4">
          {imageUrl && (
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-brand-gray-light">
              <Image src={imageUrl} alt="" fill sizes="80px" className="object-cover" unoptimized />
            </div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            {uploading && <p className="text-xs text-brand-gray">Uploading…</p>}
            <input
              type="url"
              placeholder="or paste an image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2 w-72 rounded-lg border border-brand-gray-light px-3 py-1.5 text-xs"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Short description (MN)">
          <textarea name="short_desc_mn" defaultValue={initial?.short_desc_mn} rows={2} className={inputCls} />
        </Field>
        <Field label="Short description (EN)">
          <textarea name="short_desc_en" defaultValue={initial?.short_desc_en} rows={2} className={inputCls} />
        </Field>
        <Field label="Description (MN)">
          <textarea name="description_mn" defaultValue={initial?.description_mn} rows={4} className={inputCls} />
        </Field>
        <Field label="Description (EN)">
          <textarea name="description_en" defaultValue={initial?.description_en} rows={4} className={inputCls} />
        </Field>
        <Field label="What's included (MN)">
          <input name="whats_included_mn" defaultValue={initial?.whats_included_mn} className={inputCls} />
        </Field>
        <Field label="What's included (EN)">
          <input name="whats_included_en" defaultValue={initial?.whats_included_en} className={inputCls} />
        </Field>
        <Field label="Safety info (MN)">
          <input name="safety_info_mn" defaultValue={initial?.safety_info_mn} className={inputCls} />
        </Field>
        <Field label="Safety info (EN)">
          <input name="safety_info_en" defaultValue={initial?.safety_info_en} className={inputCls} />
        </Field>
      </section>

      <Field label="Tags (comma separated)">
        <input name="tags" defaultValue={initial?.tags?.join(", ")} className={inputCls} />
      </Field>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["available_for_pickup", "Available in store"],
          ["is_featured", "Featured"],
          ["is_new_arrival", "New arrival"],
          ["is_best_seller", "Best seller"],
          ["is_on_sale", "On sale"],
          ["is_published", "Published"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={key}
              defaultChecked={Boolean((initial as Record<string, unknown> | undefined)?.[key])}
            />
            {label}
          </label>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="SEO title (MN)">
          <input name="seo_title_mn" defaultValue={initial?.seo_title_mn} className={inputCls} />
        </Field>
        <Field label="SEO title (EN)">
          <input name="seo_title_en" defaultValue={initial?.seo_title_en} className={inputCls} />
        </Field>
        <Field label="SEO description (MN)">
          <textarea name="seo_desc_mn" defaultValue={initial?.seo_desc_mn} rows={2} className={inputCls} />
        </Field>
        <Field label="SEO description (EN)">
          <textarea name="seo_desc_en" defaultValue={initial?.seo_desc_en} rows={2} className={inputCls} />
        </Field>
      </section>

      <button
        type="submit"
        className="rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
      >
        {initial?.id ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
