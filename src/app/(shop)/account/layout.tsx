import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import type { ReactNode } from "react";
import { User, Package, MapPin } from "lucide-react";

const sidebarLinks = [
  { label: "Overview", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
];

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <PageContainer>
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar */}
        <aside className="mb-8 lg:mb-0 lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 px-2">
              <p className="font-semibold text-foreground truncate">{session.user.name ?? "Account"}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </PageContainer>
  );
}
