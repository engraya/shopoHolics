import PageContainer from "@/components/layout/PageContainer"
import { BadgeCheck } from "lucide-react"

function StarRating({ rating, maxRating = 5, size = "sm" }: { rating: number; maxRating?: number; size?: "sm" | "md" }) {
  const sizeClass = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < rating ? "text-amber-400" : "text-muted"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>
      ))}
    </div>
  );
}

const reviews = [
  {
    name: "Micheal Gough",
    date: "November 18 2023",
    rating: 5,
    text: "My old IMAC was from 2013. This replacement was well needed. Very fast, and the colour matches my office set up perfectly. The display is out of this world and I'm very happy with this purchase.",
  },
  {
    name: "Jese Leos",
    date: "November 18 2023",
    rating: 5,
    text: "It's fancy, amazing keyboard, matching accessories. Super fast, batteries last more than usual, everything runs perfect in this computer. Highly recommend!",
  },
  {
    name: "Bonnie Green",
    date: "November 18 2023",
    rating: 5,
    text: "My old IMAC was from 2013. This replacement was well needed. Very fast, and the colour matches my office set up perfectly. The display is out of this world and I'm very happy with this purchase.",
  },
  {
    name: "Roberta Casas",
    date: "November 18 2023",
    rating: 5,
    text: "I have used earlier Mac computers in my university work for a number of years and found them easy to use. The iMac 2021 is no exception. It works straight out of the box giving superb definition from the HD screen.",
  },
  {
    name: "Neil Sims",
    date: "November 18 2023",
    rating: 5,
    text: "I replaced my 11 year old iMac with the new M1 Apple. I wanted to remain with Apple as my old one is still working perfectly and all Apple products are so reliable. Setting up was simple and fast.",
  },
];

const ratingBreakdown = [
  { stars: 5, count: 239, pct: 20 },
  { stars: 4, count: 432, pct: 60 },
  { stars: 3, count: 53, pct: 15 },
  { stars: 2, count: 32, pct: 5 },
  { stars: 1, count: 13, pct: 0 },
];

function ReviewsPage() {
  return (
    <PageContainer>
      <section className="py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Customer Reviews</h1>

          {/* Overall rating + breakdown */}
          <div className="flex flex-col sm:flex-row gap-8 mb-10">
            <div className="flex flex-col items-center justify-center sm:items-start gap-2">
              <span className="text-5xl font-bold text-foreground">4.6</span>
              <StarRating rating={5} size="md" />
              <span className="text-sm text-muted-foreground">Based on 769 reviews</span>
            </div>

            <div className="flex-1 space-y-2">
              {ratingBreakdown.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-2 text-sm font-medium text-foreground">{stars}</span>
                  <svg className="h-4 w-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>
                  <div className="h-2 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
                    <div className="h-2 rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-16 text-sm text-muted-foreground text-right">
                    {count} <span className="hidden sm:inline">reviews</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <div key={review.name} className="gap-6 py-6 sm:flex sm:items-start">
                <div className="flex-shrink-0 space-y-2 sm:w-48 md:w-64">
                  <StarRating rating={review.rating} />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <p className="text-xs font-medium text-foreground">Verified purchase</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

export default ReviewsPage;
