import { CHECK_IN_OUT_NOTE, CHECK_IN_TIME, CHECK_OUT_TIME } from "@/lib/content/policies";

export const FAQ_ITEMS = [
  {
    question: "What are check-in and check-out times?",
    answer: CHECK_IN_OUT_NOTE,
  },
  {
    question: "How far is the retreat from Warwick Bethel?",
    answer:
      "Tuxedo Retreat is approximately 15 minutes from Warwick Bethel — ideal for convention visitors, couples, and families who want a peaceful nightly stay close to headquarters.",
  },
  {
    question: "How does the reservation process work?",
    answer:
      "Select your dates and guest count, submit a reservation request, and our host will personally review your stay within hours. Once approved, you'll receive a secure Stripe checkout link supporting credit card and Apple Pay. Your dates are confirmed only after payment.",
  },
  {
    question: "What is included in the nightly rate?",
    answer:
      "Main bedroom stays start at $150/night for 2 guests. Two-bedroom stays start at $200/night for 2 guests. Each additional guest is $25 per person per night. Your rate includes premium bedding and linens, high-speed Wi‑Fi, and use of the kitchenette (microwave, mini fridge, and coffee station). All payments are collected upfront at checkout after approval.",
  },
  {
    question: "Is laundry available?",
    answer:
      "Yes. A washer and dryer are available on request. Add a note when you request your stay, or contact us before arrival, and your host will confirm availability for your dates.",
  },
  {
    question: "Is there Wi‑Fi?",
    answer:
      "Yes. High-speed Wi‑Fi is included throughout the cottage — suitable for video calls, streaming, and staying connected during your Bethel visit.",
  },
  {
    question: "Can I request early check-in or late check-out?",
    answer:
      `Standard check-in is after ${CHECK_IN_TIME} and check-out is before ${CHECK_OUT_TIME}. Add any timing preferences in your reservation notes — we'll confirm based on the calendar and prior guests.`,
  },
  {
    question: "Is the property suitable for families?",
    answer:
      "Yes. With two bedrooms and space for up to 6 guests, the retreat works well for couples, small families, and visiting groups seeking calm, wooded surroundings.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Before approval there is no charge. After payment, contact us as soon as plans change — we handle each stay personally and aim to be fair. See the Policies page on this site for full details.",
  },
];
