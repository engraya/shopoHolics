import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import CountUp from "./CountUp";
import type { ProductSummary } from "@/types";

const AVATARS = [
  { initials: "AK", from: "from-cyan-500", to: "to-sky-400" },
  { initials: "MJ", from: "from-sky-500", to: "to-teal-400" },
  { initials: "RS", from: "from-amber-500", to: "to-orange-500" },
  { initials: "TL", from: "from-teal-500", to: "to-emerald-400" },
];

const STATS = [
  { value: 194, suffix: "+", decimals: 0, label: "Products" },
  { value: 24, suffix: "K", decimals: 0, label: "Happy shoppers" },
  { value: 4.9, suffix: "", decimals: 1, label: "Average rating" },
];

export default function Hero({ products }: { products: ProductSummary[] }) {
  const [first, second, third] = products;

  return (
    // The header is `sticky h-16`, so it occupies 4rem of normal flow and
    // nothing else adds a spacer — -mt-16 is the exact amount that pulls the
    // section box up to y=0, putting the glow behind the bar rather than
    // below it. Any more and the copy slides under the header.
    // The gap the reader actually sees is pt-28/lg:pt-36 minus that 4rem.
    <section className="relative isolate -mt-16 overflow-hidden">
      {/* Ambient backdrop: drifting brand glows over a faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -left-32 -top-40 h-[38rem] w-[38rem] rounded-full bg-[hsl(var(--brand-from)/0.25)] blur-3xl animate-drift" />
        <div className="absolute -right-40 -top-24 h-[32rem] w-[32rem] rounded-full bg-[hsl(var(--brand-to)/0.2)] blur-3xl animate-drift [animation-delay:-7s]" />
        <div className="absolute -bottom-56 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[hsl(var(--brand-via)/0.16)] blur-3xl animate-drift [animation-delay:-13s]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-36">
        {/* ---------- Copy ---------- */}
        <div className="text-center lg:text-left">
          <Link
            href="/newest"
            className="group inline-flex animate-fade-up items-center gap-2 rounded-full border border-border/70 glass px-3 py-1.5 text-sm shadow-sm transition-colors hover:border-primary/50"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-muted-foreground">New arrivals just dropped</span>
            <span className="flex items-center gap-0.5 font-medium text-primary">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <h1 className="mt-6 animate-fade-up text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground [animation-delay:100ms] sm:text-6xl lg:text-[4.25rem]">
            Everything you love,{" "}
            <span className="text-gradient-brand">delivered fast.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg text-muted-foreground [animation-delay:200ms] lg:mx-0">
            Thousands of hand-picked products from the brands you trust — with
            free shipping, painless returns and a checkout that takes seconds.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:300ms] sm:flex-row sm:justify-center lg:justify-start">
            <Button
              size="lg"
              asChild
              className="group relative w-full overflow-hidden shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.99] sm:w-auto"
            >
              <Link href="/products">
                <span className="relative z-10 flex items-center gap-2">
                  Start shopping
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                {/* light sweep */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-full w-1/2 bg-white/25 animate-shine"
                />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full glass transition-colors hover:border-primary/50 sm:w-auto"
            >
              <Link href="/categories">Browse categories</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:400ms] sm:flex-row sm:justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <span
                  key={a.initials}
                  aria-hidden
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.from} ${a.to} text-[11px] font-semibold text-white ring-2 ring-background`}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center justify-center gap-0.5 sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1.5 font-semibold text-foreground">4.9</span>
              </div>
              <p className="text-muted-foreground">from 12,480+ verified reviews</p>
            </div>
          </div>

          {/* Stats */}
          <dl className="mt-10 grid animate-fade-up grid-cols-3 gap-4 border-t border-border/70 pt-6 [animation-delay:500ms]">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  <CountUp
                    end={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </dd>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Floating product collage ---------- */}
        <div className="relative mx-auto w-full max-w-[26rem] animate-fade-in-scale [animation-delay:250ms] lg:max-w-none">
          <div className="relative aspect-square w-full">
            {/* halo behind the tiles */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl"
            />

            {first && (
              <figure className="absolute left-0 top-[8%] h-[64%] w-[56%] animate-float overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
                <Image
                  src={first.imageUrl}
                  alt={first.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 24vw"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-2 bottom-2 rounded-2xl glass p-3 text-left shadow-lg">
                  <p className="line-clamp-1 text-xs font-medium text-foreground">
                    {first.name}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-primary">
                    {formatPrice(first.price)}
                  </p>
                </figcaption>
              </figure>
            )}

            {second && (
              <figure className="absolute right-0 top-0 h-[40%] w-[40%] animate-float-slow overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl [animation-delay:-2s]">
                <Image
                  src={second.imageUrl}
                  alt={second.name}
                  fill
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  className="object-cover"
                />
              </figure>
            )}

            {third && (
              <figure className="absolute bottom-[4%] right-[3%] h-[46%] w-[50%] animate-float overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl [animation-delay:-4s]">
                <Image
                  src={third.imageUrl}
                  alt={third.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="object-cover"
                />
              </figure>
            )}

            {/* Floating chips */}
            <div className="absolute -left-2 top-[2%] flex animate-float-slow items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium shadow-lg ring-1 ring-border/60 [animation-delay:-5s]">
              <Truck className="h-3.5 w-3.5 text-primary" />
              Free 2-day shipping
            </div>

            <div className="absolute -right-1 top-[46%] flex animate-float items-center gap-2 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-lg [animation-delay:-1.5s]">
              <Sparkles className="h-3.5 w-3.5" />
              Up to 40% off
            </div>

            <div className="absolute bottom-[2%] left-[2%] flex animate-float-slow items-center gap-2 rounded-2xl glass px-3 py-2 text-xs shadow-lg ring-1 ring-border/60 [animation-delay:-3.5s]">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>
                <span className="block font-semibold text-foreground">
                  Buyer protection
                </span>
                <span className="text-muted-foreground">on every order</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
