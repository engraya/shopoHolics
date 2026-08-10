"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogIn, Menu, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggler } from "@/components/providers/ThemeToggler";
import { PRIMARY_NAV, isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 overflow-y-auto p-0">
        <div className="px-6 pb-4 pt-6">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetClose asChild>
            <Link href="/" aria-label="Shopoholics — home" className="inline-flex rounded-md">
              <Logo markClassName="h-8 w-8" />
            </Link>
          </SheetClose>
        </div>

        <nav aria-label="Main" className="flex flex-col gap-1 px-4">
          {PRIMARY_NAV.map((item) => {
            const active = isActivePath(pathname, item);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-base font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        {categories.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="px-4">
              <h3 className="mb-2 px-3 text-sm font-semibold text-foreground">Shop by category</h3>
              <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
                {categories.map((category) => {
                  const href = `/categories/${category._id}`;
                  return (
                    <li key={category._id}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          aria-current={pathname === href ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent",
                            pathname === href
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={category.imageUrl}
                              alt=""
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </span>
                          <span className="truncate font-medium">{category.name}</span>
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}

        {/* Account + theme live down here so they don't crowd the mobile capsule. */}
        <div className="mt-auto border-t border-border px-4 py-4">
          <div className="flex flex-col gap-1">
            {session ? (
              <>
                <SheetClose asChild>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Package className="h-4 w-4" />
                    Orders
                  </Link>
                </SheetClose>
              </>
            ) : (
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              </SheetClose>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between px-3">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggler />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
