import type { Guide } from "../types";

const PUBLISHED = "2026-05-01";
const UPDATED = "2026-05-24";

export const planningVisitGuide: Guide = {
  slug: "planning-a-visit-to-warwick-bethel",
  title: "Planning a Visit to Warwick Bethel",
  description:
    "A calm checklist for Bethel visitors — travel timing, lodging, weekends at headquarters, and how to book a peaceful stay at Tuxedo Retreat.",
  publishedAt: PUBLISHED,
  updatedAt: UPDATED,
  author: "Tuxedo Retreat",
  sections: [
    {
      id: "start-early",
      heading: "Start with your Bethel dates",
      paragraphs: [
        "Convention weeks and special events fill lodging quickly in Orange County. Once your Bethel schedule is firm, reserve lodging soon after — especially if you need two bedrooms or a full week.",
        "Tuxedo Retreat uses a simple flow: check [availability](/availability), submit a [request](/book), receive host approval, then pay securely online.",
      ],
    },
    {
      id: "travel",
      heading: "Getting to Warwick",
      paragraphs: [
        "Most visitors fly into Newark, LaGuardia, or Stewart and drive. GPS will be your friend for the final miles — share any timing questions with us on the [contact](/contact) form before travel day.",
        "See our [directions guide](/directions-to-warwick-bethel) for how the cottage relates to headquarters — arrival details are sent after your stay is confirmed.",
      ],
    },
    {
      id: "daily-rhythm",
      heading: "Building a sustainable daily rhythm",
      paragraphs: [
        "Bethel days are full. Plan realistic departure times in the morning, and give yourself margin at night — a quiet deck, coffee station, and real sleep make the week gentler.",
        "If you are traveling with family who are not attending every session, the cottage gives them a peaceful base while you are at headquarters.",
      ],
    },
    {
      id: "packing",
      heading: "What to pack for a cottage stay",
      paragraphs: [
        "Pack as you would for a calm weekend in the Hudson Valley — layers, comfortable shoes, and anything personal you prefer for rest. We provide premium bedding and a curated coffee station; bring groceries if you like to snack in.",
        "Add early check-in or late check-out notes to your reservation if timing matters — we confirm based on the calendar.",
      ],
    },
    {
      id: "respect",
      heading: "A respectful stay",
      paragraphs: [
        "Tuxedo Retreat is in a residential, wooded neighborhood. We welcome guests who treat the cottage and neighbors with care — quiet evenings, no parties, and the same spirit of peace you bring to Bethel.",
        "Questions before you book? Read the [FAQ](/faq) or email through our contact page — we are glad to help you plan.",
      ],
    },
  ],
  faqs: [
    {
      id: "plan-week",
      question: "Can I book a full convention week?",
      answer:
        "Yes, when dates are available. Submit your full range on the reservation form and we confirm in our reply.",
    },
    {
      id: "plan-payment",
      question: "When do I pay?",
      answer:
        "Only after your host approves the stay. You then receive a secure checkout link; dates are firm once payment completes.",
    },
    {
      id: "plan-cancel",
      question: "What if my Bethel plans change?",
      answer:
        "Contact us as soon as you know. Cancellation terms are shared upon approval — we aim to be fair and clear.",
    },
  ],
  relatedLinks: [
    { href: "/lodging-near-warwick-bethel", label: "Lodging near Bethel" },
    { href: "/stay-near-warwick-bethel", label: "Stay near Bethel" },
    { href: "/gallery", label: "Photo gallery" },
  ],
  relatedGuideSlugs: ["where-to-stay-near-warwick-bethel", "tuxedo-ny-vs-warwick-ny-bethel-visitors"],
  cta: {
    heading: "Ready to plan your stay?",
    body: "Check open dates and send a reservation request when your travel is confirmed.",
    primaryLabel: "Request Your Stay",
    primaryHref: "/book",
    secondaryLabel: "Visitor guide",
    secondaryHref: "/bethel-visitor-guide",
  },
};
