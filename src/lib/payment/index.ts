import type { PaymentProvider, PaymentMethodCode } from "./types";
import { ManualPaymentProvider } from "./manual-provider";

const providers: Record<PaymentMethodCode, PaymentProvider> = {
  manual: new ManualPaymentProvider(),
  // QPay (or another Mongolian gateway) plugs in here once credentials exist:
  //   qpay: new QPayProvider({ clientId: env.QPAY_CLIENT_ID, clientSecret: env.QPAY_CLIENT_SECRET }),
  // Implement `QPayProvider` against the same `PaymentProvider` interface in
  // `./qpay-provider.ts`, register it above, and add "qpay" to
  // `delivery_settings.payment_methods` in the admin panel — no other
  // checkout code needs to change.
};

export function getPaymentProvider(code: PaymentMethodCode): PaymentProvider {
  return providers[code] ?? providers.manual;
}

export * from "./types";
