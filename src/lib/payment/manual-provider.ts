import type { PaymentProvider, PaymentIntent } from "./types";

/**
 * Manual/offline payment: cash or bank transfer on pickup/delivery. No
 * gateway integration — the order is created as PENDING_PAYMENT and staff
 * confirm payment by hand in the admin panel (Order > Confirm Payment).
 */
export class ManualPaymentProvider implements PaymentProvider {
  code = "manual";

  async createCheckoutSession(): Promise<PaymentIntent> {
    return {
      reference: null,
      autoConfirmed: false,
      instructionsMn:
        "Таны захиалгыг хүлээн авлаа. Бид тантай удахгүй холбогдож төлбөрийг баталгаажуулна.",
      instructionsEn: "We've received your order. We'll contact you shortly to confirm payment.",
    };
  }

  async verifyPayment(): Promise<{ paid: boolean }> {
    // Manual payments are confirmed by staff in the admin panel, not verified programmatically.
    return { paid: false };
  }

  async handleWebhook(): Promise<null> {
    return null;
  }
}
