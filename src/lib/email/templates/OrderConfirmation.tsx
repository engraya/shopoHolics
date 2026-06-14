import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  to: string;
  customerName?: string;
  orderId: string;
  totalCents: number;
  items: { name: string; quantity: number; priceCents: number }[];
}

function fmt(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}

export function OrderConfirmation({ customerName, orderId, totalCents, items }: Props) {
  const shortId = orderId.slice(-8).toUpperCase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://shopoholics.com";

  return (
    <Html>
      <Head />
      <Preview>Your order #{shortId} is confirmed!</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", border: "1px solid #e5e7eb" }}>
          <Heading style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
            Order Confirmed!
          </Heading>
          <Text style={{ color: "#6b7280", margin: "0 0 24px" }}>
            {customerName ? `Hi ${customerName}, your` : "Your"} order{" "}
            <strong>#{shortId}</strong> has been placed and is being processed.
          </Text>

          <Section style={{ backgroundColor: "#f3f4f6", borderRadius: "6px", padding: "16px 20px", marginBottom: "24px" }}>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: i < items.length - 1 ? "12px" : "0" }}>
                <Column>
                  <Text style={{ margin: 0, fontSize: "14px", color: "#111827" }}>
                    {item.name} × {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={{ margin: 0, fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                    {fmt(item.priceCents * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 16px" }} />

          <Row style={{ marginBottom: "24px" }}>
            <Column>
              <Text style={{ margin: 0, fontWeight: "700", color: "#111827" }}>Total</Text>
            </Column>
            <Column align="right">
              <Text style={{ margin: 0, fontWeight: "700", color: "#111827" }}>{fmt(totalCents)}</Text>
            </Column>
          </Row>

          <Link
            href={`${baseUrl}/account/orders/${orderId}`}
            style={{ display: "inline-block", backgroundColor: "#0f172a", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
          >
            View Order
          </Link>

          <Hr style={{ borderColor: "#e5e7eb", margin: "32px 0 16px" }} />
          <Text style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>
            Questions? Reply to this email or contact us at{" "}
            <Link href="mailto:support@shopoholics.com" style={{ color: "#6b7280" }}>
              support@shopoholics.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
