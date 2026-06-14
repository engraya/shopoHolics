import { RegisterForm } from "@/features/auth/components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Account — Shopoholics" };

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start shopping in seconds
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
