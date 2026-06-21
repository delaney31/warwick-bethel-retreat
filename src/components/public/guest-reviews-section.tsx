import { GUEST_REVIEWS, GUEST_REVIEW_AGGREGATE } from "@/lib/content/guest-reviews";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-amber-500" : "text-stone-300"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function GuestReviewsSection() {
  return (
    <section className="bg-stone-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            Guest feedback
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
            Host-reviewed stays, thoughtful guests
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            {GUEST_REVIEW_AGGREGATE.averageRating.toFixed(1)} average ·{" "}
            {GUEST_REVIEW_AGGREGATE.reviewCount} guest reviews · personal approval before every
            booking
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {GUEST_REVIEWS.map((review) => (
            <blockquote
              key={review.id}
              className="flex flex-col rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm"
            >
              <StarRow rating={review.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-700">
                &ldquo;{review.quote}&rdquo;
              </p>
              <footer className="mt-5 border-t border-stone-100 pt-4">
                <p className="text-sm font-semibold text-stone-900">{review.author}</p>
                <p className="text-xs text-stone-500">{review.context}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
