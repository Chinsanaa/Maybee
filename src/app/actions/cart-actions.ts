"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId"));
  const quantity = Number(formData.get("quantity") ?? 1);
  await addToCart(productId, Math.max(1, quantity));
  revalidatePath("/", "layout");
}

export async function buyNowAction(formData: FormData) {
  const productId = String(formData.get("productId"));
  const quantity = Number(formData.get("quantity") ?? 1);
  const locale = String(formData.get("locale") ?? "mn");
  await addToCart(productId, Math.max(1, quantity));
  revalidatePath("/", "layout");
  redirect(`/${locale}/checkout`);
}

export async function updateCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  const quantity = Number(formData.get("quantity"));
  await updateCartItemQuantity(itemId, quantity);
  revalidatePath("/", "layout");
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("itemId"));
  await removeCartItem(itemId);
  revalidatePath("/", "layout");
}
