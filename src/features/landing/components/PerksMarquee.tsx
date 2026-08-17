import {
  BadgePercent,
  CreditCard,
  Headphones,
  PackageCheck,
  RefreshCcw,
  Truck,
} from "lucide-react";

const PERKS = [
  { icon: Truck, label: "Free shipping over ₦50,000" },
  { icon: RefreshCcw, label: "30-day easy returns" },
  { icon: CreditCard, label: "Secure encrypted checkout" },
  { icon: Headphones, label: "24/7 customer support" },
  { icon: PackageCheck, label: "Tracked worldwide delivery" },
  { icon: BadgePercent, label: "Members save up to 40%" },
];

function Track({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      data-marquee-track
      aria-hidden={ariaHidden || undefined}
      className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-10 pr-10"
    >
      {PERKS.map((perk) => (
        <li
          key={perk.label}
          className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-muted-foreground"
        >
          <perk.icon className="h-4 w-4 shrink-0 text-primary" />
          <span className="whitespace-nowrap">{perk.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PerksMarquee() {
  return (
    <section
      aria-label="Store benefits"
      className="border-y border-border bg-muted/40"
    >
      <div className="marquee-group mask-fade-x flex overflow-hidden py-4">
        <Track />
        <Track ariaHidden />
      </div>
    </section>
  );
}
