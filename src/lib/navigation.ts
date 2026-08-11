/**
 * The site map, shared by the header and the footer so the two can't drift.
 */

export interface NavItem {
  name: string;
  href: string;
  /** Extra path prefixes that should also mark this item active. */
  match?: string[];
  /** Which footer column the item belongs to; omitted items are header-only. */
  footerGroup?: "shop" | "company";
}

export const PRIMARY_NAV: NavItem[] = [
  // Home is header-only — the footer's brand lockup already links there.
  { name: "Home", href: "/" },
  // Product detail pages live at /product/[slug], outside the /products prefix.
  { name: "Products", href: "/products", match: ["/product"], footerGroup: "shop" },
  { name: "Categories", href: "/categories", footerGroup: "shop" },
  { name: "Newest", href: "/newest", footerGroup: "shop" },
  { name: "Reviews", href: "/reviews", footerGroup: "company" },
];

export function footerNav(group: NonNullable<NavItem["footerGroup"]>): NavItem[] {
  return PRIMARY_NAV.filter((item) => item.footerGroup === group);
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Prefix matching, so `/product/essence-mascara` still lights up "Products".
 * "/" is the only exact match — every path starts with it.
 */
export function isActivePath(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (matchesPrefix(pathname, item.href)) return true;
  return item.match?.some((prefix) => matchesPrefix(pathname, prefix)) ?? false;
}

export const DEFAULT_REDIRECT = "/";

/**
 * Sanitizes a `?callbackUrl=` before it reaches `signIn({ redirectTo })`.
 *
 * Anything that isn't a single-slash-rooted path is discarded, which rejects
 * absolute URLs (`https://evil.test`), scheme-relative ones (`//evil.test`),
 * and backslash variants that some parsers normalize into `//`. Without this,
 * the sign-in page is an open redirect that any link can aim wherever it likes.
 */
export function safeCallbackUrl(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_REDIRECT;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return DEFAULT_REDIRECT;
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return DEFAULT_REDIRECT;
  return trimmed;
}
