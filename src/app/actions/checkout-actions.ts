"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/orders";

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email().optional().or(z.literal("")),
  deliveryMethod: z.enum(["PICKUP", "DELIVERY"]),
  address: z.string().optional(),
  district: z.string().optional(),
  khoroo: z.string().optional(),
  addressDetails: z.string().optional(),
  paymentMethod: z.string().min(1),
  customerNotes: z.string().optional(),
  locale: z.string(),
});

export type CheckoutState = { error?: string } | undefined;

export async function submitCheckoutAction(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { locale, ...input } = parsed.data;

  try {
    const { orderNumber } = await createOrder({
      ...input,
      customerEmail: input.customerEmail || undefined,
    });
    revalidatePath("/", "layout");
    redirect(`/${locale}/order/${orderNumber}`);
  } catch (err) {
    if (err instanceof Error && err.message === "Cart is empty") {
      return { error: locale === "en" ? "Your cart is empty." : "Таны сагс хоосон байна." };
    }
    if (err && typeof err === "object" && "digest" in err) throw err; // Next.js redirect
    return {
      error:
        locale === "en"
          ? "Something went wrong placing your order. Please try again."
          : "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.",
    };
  }
}
