import Link from "next/link";
import { Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/Logo";
import { footerNav } from "@/lib/navigation";

const footerLinks = {
  shop: footerNav("shop"),
  company: footerNav("company"),
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <Link href="/" aria-label="Shopoholics — home" className="self-start rounded-md">
              <Logo markClassName="h-8 w-8" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Premium products, fast checkout, and a shopping experience you&apos;ll love.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com/engraya/shopoHolics"
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
            © {new Date().getFullYear()} Shopoholics™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
