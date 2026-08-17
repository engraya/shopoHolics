import { cn } from "@/lib/utils";

/**
 * Shared styling for the desktop header's top-level items, so the plain links
 * and the "Categories" dropdown trigger stay pixel-identical.
 */
export function navItemClass(active: boolean, className?: string) {
  return cn(
    "relative flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    active
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-accent hover:text-foreground",
    className
  );
}
