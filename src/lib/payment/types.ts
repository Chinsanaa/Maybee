export type PaymentIntent = {
  /** Provider-specific reference (e.g. QPay invoice id). Null for manual/offline. */
  reference: string | null;
  /** Whether the order should be considered confirmed immediately. */
  autoConfirmed: boolean;
  /** Instructions to show the customer on the confirmation page. */
  instructionsMn: string;
  instructionsEn: string;
};

export type PaymentMethodCode = string;

/**
 * Abstraction over how an order's payment is initiated/verified. Phase 1
 * ships only `ManualPaymentProvider` (pay in person / bank transfer, admin
 * confirms manually) since no payment-gateway credentials exist yet. A real
 * gateway (e.g. QPay) implements the same interface — see the stub below —
 * and is selected in `getPaymentProvider()` once credentials are configured.
 */
export interface PaymentProvider {
  code: PaymentMethodCode;
  createCheckoutSession(input: {
    orderId: string;
    orderNumber: string;
    amount: number;
    currencyCode: string;
  }): Promise<PaymentIntent>;
  verifyPayment(reference: string): Promise<{ paid: boolean }>;
  handleWebhook(payload: unknown): Promise<{ orderId: string; paid: boolean } | null>;
}
