import { Quote, Star } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const REVIEWS = [
  {
    quote:
      "Ordered on a Tuesday night and it was on my desk Thursday morning. The packaging alone made it feel like a gift I bought myself.",
    name: "Amara Okafor",
    role: "Verified buyer",
    initials: "AO",
    gradient: "from-cyan-500 to-sky-500",
    rating: 5,
  },
  {
    quote:
      "I returned a jacket and the refund cleared before the courier even scanned it back in. That is the first time that has ever happened to me.",
    name: "Marcus Feld",
    role: "Verified buyer",
    initials: "MF",
    gradient: "from-sky-500 to-teal-400",
    rating: 5,
  },
  {
    quote:
      "Checkout took about fifteen seconds. No account walls, no surprise fees at the last step. I have been back four times this month.",
    name: "Priya Raman",
    role: "Verified buyer",
    initials: "PR",
    gradient: "from-amber-500 to-orange-500",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Loved by shoppers"
          title="12,480 reviews and counting"
          description="We read every single one of them — here are a few we are especially proud of."
          href="/reviews"
          linkLabel="Read all reviews"
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <Reveal key={review.name} delay={index * 110} className="h-full">
            <figure className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
              <Quote
                aria-hidden
                className="absolute -right-2 -top-2 h-20 w-20 text-primary/[0.07] transition-transform duration-500 group-hover:scale-110"
              />

              <div className="relative flex items-center gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="sr-only">{review.rating} out of 5 stars</span>
              </div>

              <blockquote className="relative mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              <figcaption className="relative mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span
                  aria-hidden
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${review.gradient} text-xs font-semibold text-white`}
                >
                  {review.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {review.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {review.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
