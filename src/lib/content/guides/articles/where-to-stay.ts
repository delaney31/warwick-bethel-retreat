import type { Guide } from "../types";
import { PROPERTY_IMAGES } from "@/lib/content/property";

const PUBLISHED = "2026-05-01";
const UPDATED = "2026-05-24";

export const whereToStayGuide: Guide = {
  slug: "where-to-stay-near-warwick-bethel",
  title: "Where to Stay Near Warwick Bethel",
  description:
    "A practical overview of lodging near Warwick Bethel — distances, what to look for, and how Tuxedo Retreat welcomes Bethel visitors in Tuxedo Park.",
  publishedAt: PUBLISHED,
  updatedAt: UPDATED,
  author: "Tuxedo Retreat",
  heroImage: PROPERTY_IMAGES.hero,
  heroImageAlt: "Tuxedo Retreat — peaceful lodging near Warwick Bethel",
  sections: [
    {
      id: "why-nearby",
      heading: "Why stay near headquarters instead of far away",
      paragraphs: [
        "Warwick Bethel visitors often travel from out of state or abroad. After long days of sessions, fellowship, and travel, the last thing you need is another hour on the road.",
        "Staying within about fifteen minutes of headquarters keeps mornings simpler and evenings restful. [Tuxedo Retreat](/lodging-near-warwick-bethel) is in the Tuxedo Park / Warwick area — wooded, residential, and intentionally quiet.",
      ],
    },
    {
      id: "options",
      heading: "Types of accommodation visitors consider",
      paragraphs: [
        "Hotels in the region vary widely in age, noise, and distance. Some groups share large houses; others prefer a private cottage with a host they can actually reach by phone.",
        "A boutique nightly stay offers space — deck, kitchenette, two bedrooms — that hotel rooms rarely match at similar price points, especially for families.",
      ],
      bullets: [
        "Hotels: convenient booking, variable quality during busy convention weeks",
        "Shared rentals: more space, less predictable standards",
        "Host-managed cottage: personal approval, clear rates, Bethel-focused hosting",
      ],
    },
    {
      id: "tuxedo-retreat",
      heading: "What Tuxedo Retreat offers",
      paragraphs: [
        "We are a small cottage operation, not a hotel chain. Main bedroom stays start at $150/night for two guests; both bedrooms from $200/night. Each additional guest is $25 per person per night.",
        "Every reservation is [host-reviewed](/book) — you request dates, we confirm availability, then invite secure payment. Check-in details arrive before you travel.",
      ],
    },
    {
      id: "choosing",
      heading: "How to choose the right setup",
      paragraphs: [
        "Couples often choose the [main bedroom package](/private-room-near-warwick-ny). Families or small groups typically reserve [both bedrooms](/rooms) for shared living space and the deck.",
        "Browse [availability](/availability) before you request, and read our [visitor stay overview](/warwick-bethel-visitor-stay) if this is your first Bethel trip.",
      ],
    },
  ],
  faqs: [
    {
      id: "where-distance",
      question: "How far is Tuxedo Retreat from Warwick Bethel?",
      answer:
        "Approximately fifteen minutes by car under normal conditions — close enough for daily sessions, far enough for quiet evenings.",
    },
    {
      id: "where-book",
      question: "How do I check if my dates are open?",
      answer:
        "Use our live availability calendar, then submit a reservation request. We confirm personally before inviting payment.",
    },
    {
      id: "where-family",
      question: "Can families stay together?",
      answer:
        "Yes — the two-bedroom option accommodates up to six guests when the calendar allows. Submit your guest count on the booking form.",
    },
  ],
  relatedLinks: [
    { href: "/book", label: "Request your stay" },
    { href: "/rooms", label: "Rooms & amenities" },
    { href: "/bethel-visitor-guide", label: "Visitor guide" },
    { href: "/faq", label: "FAQ" },
  ],
  relatedGuideSlugs: ["planning-a-visit-to-warwick-bethel", "tuxedo-ny-vs-warwick-ny-bethel-visitors"],
  cta: {
    heading: "Request lodging near Bethel",
    body: "When your dates are set, send a reservation request — we respond personally and guide you through approval and payment.",
    primaryLabel: "Request Your Stay",
    primaryHref: "/book",
    secondaryLabel: "Check availability",
    secondaryHref: "/availability",
  },
};
