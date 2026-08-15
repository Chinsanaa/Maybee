import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

const CART_COOKIE = "maybee_cart_token";

/**
 * Cart is server-persisted, keyed by an opaque token stored in a cookie so it
 * survives across sessions without forcing login (guest checkout by default).
 * All cart reads/writes go through the service-role client — the cookie token
 * itself is the capability, so RLS is intentionally not modeled for this table.
 */
async function getOrCreateCartToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const token = randomUUID();
  cookieStore.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
  return token;
}

async function getCartId(token: string): Promise<string> {
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("cart")
    .select("id")
    .eq("token", token)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("cart")
    .insert({ token })
    .select("id")
    .single();
  if (error || !created) throw new Error("Could not create cart");
  return created.id;
}

export type CartLine = {
  id: string;
  productId: string;
  quantity: number;
  nameMn: string;
  nameEn: string;
  slugMn: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  stockQuantity: number;
  stockStatus: string;
};

export async function getCart(): Promise<{ id: string; items: CartLine[] }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value;
  if (!token) return { id: "", items: [] };

  const supabase = createAdminClient();
  const { data: cart } = await supabase.from("cart").select("id").eq("token", token).maybeSingle();
  if (!cart) return { id: "", items: [] };

  const { data: items } = await supabase
    .from("cart_item")
    .select(
      "id, quantity, product:product_id ( id, name_mn, name_en, slug_mn, price, compare_at_price, stock_quantity, stock_status, product_image ( url, is_primary ) )"
    )
    .eq("cart_id", cart.id);

  const lines: CartLine[] = (items ?? [])
    .filter((i) => i.product)
    .map((i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = i.product as any;
      const primaryImage =
        p.product_image?.find((img: { is_primary: boolean }) => img.is_primary) ??
        p.product_image?.[0];
      return {
        id: i.id,
        productId: p.id,
        quantity: i.quantity,
        nameMn: p.name_mn,
        nameEn: p.name_en,
        slugMn: p.slug_mn,
        price: p.price,
        compareAtPrice: p.compare_at_price,
        imageUrl: primaryImage?.url ?? null,
        stockQuantity: p.stock_quantity,
        stockStatus: p.stock_status,
      };
    });

  return { id: cart.id, items: lines };
}

export async function addToCart(productId: string, quantity = 1) {
  const token = await getOrCreateCartToken();
  const cartId = await getCartId(token);
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("cart_item")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_item")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_item").insert({ cart_id: cartId, product_id: productId, quantity });
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = createAdminClient();
  if (quantity <= 0) {
    await supabase.from("cart_item").delete().eq("id", cartItemId);
  } else {
    await supabase.from("cart_item").update({ quantity }).eq("id", cartItemId);
  }
}

export async function removeCartItem(cartItemId: string) {
  const supabase = createAdminClient();
  await supabase.from("cart_item").delete().eq("id", cartItemId);
}

export async function clearCart(cartId: string) {
  const supabase = createAdminClient();
  await supabase.from("cart_item").delete().eq("cart_id", cartId);
}

export async function getCartItemCount(): Promise<number> {
  const { items } = await getCart();
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
