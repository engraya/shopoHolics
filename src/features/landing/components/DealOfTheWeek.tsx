import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";
import Reveal from "./Reveal";
import type { ProductSummary } from "@/types";

const DISCOUNT = 0.4;
const CLAIMED = 37;
const STOCK = 60;

export default function DealOfTheWeek({ product }: { product?: ProductSummary }) {
  if (!product) return null;

  const salePrice = product.price * (1 - DISCOUNT);
  const claimedPct = Math.round((CLAIMED / STOCK) * 100);

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 shadow-2xl sm:px-10 sm:py-14 lg:px-14">
          {/* backdrop */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--brand-from)/0.45)] blur-3xl animate-drift" />
            <div className="absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-[hsl(var(--brand-to)/0.35)] blur-3xl animate-drift [animation-delay:-9s]" />
            <div className="absolute inset-0 bg-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_70%_at_30%_50%,black,transparent)]" />
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                Deal of the week
              </span>

              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {product.name}
              </h2>
              <p className="mt-3 max-w-md text-white/70">
                One product, one week, one unbeatable price. When the timer hits
                zero, the price goes back up.
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-lg text-white/50 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                  Save {Math.round(DISCOUNT * 100)}%
                </span>
              </div>

              {/* Stock progress */}
              <div className="mt-6 max-w-sm">
                <div className="flex justify-between text-xs text-white/60">
                  <span>
                    <span className="font-semibold text-white">{CLAIMED}</span>{" "}
                    claimed
                  </span>
                  <span>Only {STOCK - CLAIMED} left</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${claimedPct}%` }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 -left-full w-1/2 bg-white/40 animate-shine"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <CountdownTimer />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="group bg-white text-slate-950 hover:bg-white/90"
                >
                  <Link href={`/product/${product.slug}`}>
                    Grab the deal
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/products">See more offers</Link>
                </Button>
              </div>
            </div>

            {/* Product visual */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div className="relative aspect-square">
                <div
                  aria-hidden
                  className="absolute inset-4 rounded-full bg-[conic-gradient(from_0deg,hsl(var(--brand-from)),hsl(var(--brand-via)),hsl(var(--brand-to)),hsl(var(--brand-from)))] opacity-40 blur-2xl animate-spin-slow"
                />
                <div className="absolute inset-6 overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur animate-float">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 80vw, 32vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -right-1 top-2 flex h-20 w-20 rotate-6 animate-float-slow flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-center shadow-xl [animation-delay:-3s]">
                  <span className="text-xl font-extrabold leading-none text-white">
                    -{Math.round(DISCOUNT * 100)}%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-white/90">
                    Today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
