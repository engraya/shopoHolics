import { CreditCard, Headphones, RefreshCcw, Truck } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const VALUES = [
  {
    icon: Truck,
    title: "Free express shipping",
    body: "Every order over ₦50,000 ships free and lands on your doorstep within two business days.",
  },
  {
    icon: RefreshCcw,
    title: "Returns, no questions",
    body: "Changed your mind? Send it back within 30 days and we refund you the same day it arrives.",
  },
  {
    icon: CreditCard,
    title: "Checkout you can trust",
    body: "Payments are encrypted end to end with full buyer protection. We never touch your card details.",
  },
  {
    icon: Headphones,
    title: "Humans on standby",
    body: "Real people answering real questions, every day of the week, in under five minutes.",
  },
];

export default function ValueProps() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why Shopoholics"
            title="Built around the way you actually shop"
            description="No hidden fees, no cryptic return policies, no waiting on hold. Just a store that behaves the way it should."
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={index * 90} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                {/* hover wash */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-brand-ink shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
