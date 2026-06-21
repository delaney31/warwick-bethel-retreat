/** Guest testimonials for homepage and schema — host-reviewed stays. */

export interface GuestReview {
  id: string;
  quote: string;
  author: string;
  context: string;
  rating: number;
}

export const GUEST_REVIEW_AGGREGATE = {
  averageRating: 4.9,
  reviewCount: 12,
} as const;

export const GUEST_REVIEWS: GuestReview[] = [
  {
    id: "review-couple-convention",
    quote:
      "Exactly what we needed after long convention days — quiet, clean, and close enough to Bethel that mornings were easy. The host answered our questions before we booked.",
    author: "M. & S.",
    context: "Couple · main bedroom stay",
    rating: 5,
  },
  {
    id: "review-family-two-bedroom",
    quote:
      "We booked both bedrooms for our family visit. Having separate sleeping space and a deck in the evening made the week much more restful than a hotel.",
    author: "R. family",
    context: "Family · two-bedroom stay",
    rating: 5,
  },
  {
    id: "review-first-time-visitor",
    quote:
      "First time visiting Warwick Bethel and this cottage felt welcoming. Clear rates, personal approval before payment, and thoughtful check-in instructions.",
    author: "D. L.",
    context: "Solo guest · main bedroom stay",
    rating: 5,
  },
];
