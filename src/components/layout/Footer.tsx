import Link from "next/link";
import { Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Newest Arrivals", href: "/newest" },
  ],
  company: [
    { name: "Reviews", href: "/reviews" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="font-bold text-lg tracking-tight text-foreground">
              <span className="text-primary">S</span>hopoholics
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium products, fast checkout, and a shopping experience you&apos;ll love.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Shopoholics™. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js &amp; Sanity
          </p>
        </div>
      </div>
    </footer>
  );
}
