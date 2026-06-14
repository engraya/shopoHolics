import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:pt-20 pb-8">
      <Link href="/" className="mb-8 font-bold text-2xl tracking-tight text-foreground">
        <span className="text-primary">S</span>hopoholics
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
