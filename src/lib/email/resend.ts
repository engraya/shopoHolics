import { Resend } from "resend";
import { OrderConfirmation } from "./templates/OrderConfirmation";
import { WelcomeEmail } from "./templates/WelcomeEmail";

// Instantiated lazily — the Resend constructor throws without an API key,
// which would crash the build when routes importing this module are evaluated.
let client: Resend | null = null;

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set — cannot send email.");
  }
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "orders@shopoholics.com";

interface OrderConfirmationPayload {
  to: string;
  customerName?: string;
  orderId: string;
  totalCents: number;
  items: { name: string; quantity: number; priceCents: number }[];
}

export async function sendOrderConfirmationEmail(payload: OrderConfirmationPayload) {
  return getResend().emails.send({
    from: FROM,
    to: payload.to,
    subject: `Order confirmed — #${payload.orderId.slice(-8).toUpperCase()}`,
    react: OrderConfirmation(payload),
  });
}

export async function sendWelcomeEmail(to: string, name?: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Welcome to Shopoholics!",
    react: WelcomeEmail({ name }),
  });
}
