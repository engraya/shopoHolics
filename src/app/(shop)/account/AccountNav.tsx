"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, MapPin, UserRound } from "lucide-react";

const links = [
  { label: "Overview", href: "/account", exact: true, icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", exact: false, icon: Package },
  { label: "Addresses", href: "/account/addresses", exact: false, icon: MapPin },
  { label: "Profile", href: "/account/profile", exact: false, icon: UserRound },
];

/**
 * Client leaf so the server layout can stay a server component — only the
 * active-link highlight needs `usePathname`.
 */
export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="space-y-1 p-3">
      {links.map(({ label, href, exact, icon: Icon }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {label}
            {active && (
              <span aria-hidden className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-brand" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
