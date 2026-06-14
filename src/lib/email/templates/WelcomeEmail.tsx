import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  name?: string;
}

export function WelcomeEmail({ name }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://shopoholics.com";

  return (
    <Html>
      <Head />
      <Preview>Welcome to Shopoholics!</Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px", border: "1px solid #e5e7eb" }}>
          <Heading style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
            Welcome{name ? `, ${name}` : ""}!
          </Heading>
          <Text style={{ color: "#6b7280", margin: "0 0 24px" }}>
            Your Shopoholics account is ready. Browse our latest collection and find something you love.
          </Text>
          <Link
            href={`${baseUrl}/products`}
            style={{ display: "inline-block", backgroundColor: "#0f172a", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
          >
            Start Shopping
          </Link>
        </Container>
      </Body>
    </Html>
  );
}
