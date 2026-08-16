import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AccountNav } from "./AccountNav";

function initialsOf(name?: string | null, email?: string | null) {
  const source = name?.trim() || email || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { name, email } = session.user;

  return (
    // Own container instead of PageContainer: account pages want a roomier gap
    // below the sticky h-16 navbar than the shared py-6 default provides.
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar */}
        <aside className="mb-8 lg:mb-0">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
            <div className="relative border-b border-border px-5 pb-5 pt-6">
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                  {initialsOf(name, email)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{name ?? "Account"}</p>
                  <p className="truncate text-xs text-muted-foreground">{email}</p>
                </div>
              </div>
            </div>
            <AccountNav />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
