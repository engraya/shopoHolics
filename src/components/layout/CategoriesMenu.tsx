"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { navItemClass } from "./navStyles";

/** Tiles shown in the panel; the rest are reachable via "View all". */
export const MENU_CATEGORY_LIMIT = 8;

export function CategoriesMenu({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const sectionActive = pathname === "/categories" || pathname.startsWith("/categories/");
  const featured = categories.slice(0, MENU_CATEGORY_LIMIT);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navItemClass(sectionActive, "group")}>
        Categories
        <ChevronDown
          aria-hidden
          className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
        {sectionActive && (
          <span
            aria-hidden
            className="absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-gradient-brand"
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={14}
        className="w-[min(38rem,calc(100vw-2rem))] rounded-2xl border-border/70 p-2 shadow-xl"
      >
        <div className="grid grid-cols-2 gap-1">
          {featured.map((category) => {
            const href = `/categories/${category._id}`;
            return (
              <DropdownMenuItem key={category._id} asChild className="cursor-pointer rounded-xl p-2">
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className="flex items-center gap-3"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={category.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span
                    className={cn(
                      "truncate text-sm font-medium",
                      pathname === href && "text-primary"
                    )}
                  >
                    {category.name}
                  </span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer rounded-xl">
          <Link
            href="/categories"
            className="flex items-center justify-between text-sm font-medium text-primary"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
