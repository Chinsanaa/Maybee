import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { getCart, clearCart } from "@/lib/cart";
import { getDeliverySettings } from "@/lib/business-info";
import { getPaymentProvider } from "@/lib/payment";
import type { Database } from "@/lib/database.types";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: Database["public"]["Enums"]["delivery_method"];
  address?: string;
  district?: string;
  khoroo?: string;
  addressDetails?: string;
  paymentMethod: string;
  customerNotes?: string;
};

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `MB-${year}-${rand}`;
}

export async function createOrder(input: CreateOrderInput) {
  const { id: cartId, items } = await getCart();
  if (items.length === 0) {
    throw new Error("Cart is empty");
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = await getDeliverySettings();
  const deliveryFee =
    input.deliveryMethod === "DELIVERY"
      ? delivery.free_threshold && subtotal >= delivery.free_threshold
        ? 0
        : delivery.base_fee
      : 0;
  const discount = 0;
  const total = subtotal - discount + deliveryFee;

  const supabase = createAdminClient();
  const orderNumber = generateOrderNumber();

  const { data: order, error } = await supabase
    .from("order")
    .insert({
      order_number: orderNumber,
      status: "PENDING_PAYMENT",
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail || null,
      delivery_method: input.deliveryMethod,
      address: input.address || null,
      district: input.district || null,
      khoroo: input.khoroo || null,
      address_details: input.addressDetails || null,
      payment_method: input.paymentMethod,
      subtotal,
      discount,
      delivery_fee: deliveryFee,
      total,
      customer_notes: input.customerNotes || null,
    })
    .select("id, order_number")
    .single();

  if (error || !order) {
    throw new Error(`Could not create order: ${error?.message}`);
  }

  await supabase.from("order_item").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name_mn: i.nameMn,
      product_name_en: i.nameEn,
      sku: i.sku,
      unit_price: i.price,
      quantity: i.quantity,
      line_total: i.price * i.quantity,
    }))
  );

  await supabase.from("order_status_history").insert({
    order_id: order.id,
    status: "PENDING_PAYMENT",
    note: "Order placed by customer",
  });

  const provider = getPaymentProvider(input.paymentMethod);
  const intent = await provider.createCheckoutSession({
    orderId: order.id,
    orderNumber: order.order_number,
    amount: total,
    currencyCode: "MNT",
  });

  if (cartId) await clearCart(cartId);

  return { orderNumber: order.order_number, intent };
}

export async function getOrderByNumber(orderNumber: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("order")
    .select("*, order_item(*)")
    .eq("order_number", orderNumber)
    .maybeSingle();
  return data;
}
