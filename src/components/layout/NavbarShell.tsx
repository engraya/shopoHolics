"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggler } from "@/components/providers/ThemeToggler";
import { CartSheet } from "@/features/cart/components/CartSheet";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Logo } from "@/components/ui/Logo";
import { PRIMARY_NAV, isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { CategoriesMenu } from "./CategoriesMenu";
import { MobileNav } from "./MobileNav";
import { navItemClass } from "./navStyles";

/** The dropdown owns this item, so it isn't rendered as a plain link. */
const CATEGORIES_HREF = "/categories";

export default function NavbarShell({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // correct state when the page loads already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // `sticky` keeps the header in normal flow, so its own h-16 is the only
    // offset the page needs — main must NOT also carry a pt-16 spacer, or the
    // content sits 128px down. Only the inner capsule animates, so this flow
    // height stays constant on scroll.
    <header className="sticky top-0 z-50 h-16">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <nav
        aria-label="Global"
        className={cn(
          "mx-auto mt-1 flex h-14 items-center gap-2 border px-4 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled
            ? "max-w-6xl rounded-full border-border/70 glass shadow-lg shadow-foreground/5"
            : "max-w-7xl border-transparent"
        )}
      >
        {/* Brand lockup */}
        <Link
          href="/"
          aria-label="Shopoholics — home"
          className="mr-2 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Logo markClassName="h-8 w-8" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {PRIMARY_NAV.map((item) => {
            if (item.href === CATEGORIES_HREF) {
              return <CategoriesMenu key={item.href} categories={categories} />;
            }

            const active = isActivePath(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={navItemClass(active)}
              >
                {item.name}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-gradient-brand"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-1">
          <CartSheet />
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <UserMenu />
            <ThemeToggler />
          </div>
          <MobileNav categories={categories} />
        </div>
      </nav>
    </header>
  );
}
