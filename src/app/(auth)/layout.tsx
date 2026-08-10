import type { ReactNode } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:pt-20 pb-8">
      <Link
        href="/"
        aria-label="Shopoholics — home"
        className="mb-8 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground"
      >
        <LogoMark className="h-10 w-10" />
        Shopoholics
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
