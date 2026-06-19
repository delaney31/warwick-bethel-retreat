import { formatStayPackageRateLine, StayPackage } from "@/lib/pricing/stay-packages";

/** Shared facts used across SEO landing pages — keep aligned with property copy. */
export const RETREAT_LOCATION = {
  area: "Tuxedo Park · Warwick, New York",
  distanceToBethel: "approximately 15 minutes by car",
  driveNote:
    "Most visitors reach Warwick Bethel from the cottage in about fifteen minutes, depending on traffic and time of day.",
} as const;

export const RETREAT_PROPERTY = {
  bedrooms: 2,
  bathrooms: "1.5",
  sleepsIncluded: 2,
  maxGuests: 6,
  parking:
    "On-property parking is available. Your host shares arrival, parking, and entry details after your stay is approved.",
  entrance:
    "Tuxedo Retreat is a private residential cottage — not a hotel. You receive calm, personal check-in guidance once your reservation is confirmed.",
  bathroomsDetail:
    "The cottage includes 1.5 bathrooms shared between the living areas and two bedrooms. Layout photos are on our Rooms page.",
  deck: "A private wooded deck with Adirondack seating — ideal for quiet mornings before Bethel.",
  wifi: "High-speed Wi‑Fi throughout the cottage.",
  laundry:
    "Washer and dryer available on request — mention it when booking or contact your host before arrival.",
  kitchenette:
    "Light meal prep only — microwave, mini fridge, and coffee station (not a full kitchen).",
} as const;

export const BOOKING_STEPS = [
  {
    title: "Request your dates",
    body: "Choose your stay package, guest count, and notes on our reservation form. There is no charge while we review.",
  },
  {
    title: "Host review",
    body: "Your host personally reviews each request — usually within a few hours on business days.",
  },
  {
    title: "Secure payment",
    body: "After approval, you receive a Stripe checkout link (card or Apple Pay where available). Dates are confirmed when payment completes.",
  },
  {
    title: "Arrive rested",
    body: "Check-in details, parking, and entry instructions are shared before you arrive — so your first evening can be peaceful.",
  },
] as const;

export const ROOM_OPTIONS = [
  {
    id: StayPackage.MAIN_BEDROOM,
    title: "Main bedroom",
    description:
      "A private master suite with premium bedding, natural light, and access to shared living spaces — well suited for couples or two guests.",
    rateLine: formatStayPackageRateLine(StayPackage.MAIN_BEDROOM),
    href: "/rooms",
  },
  {
    id: StayPackage.TWO_BEDROOMS,
    title: "Two bedrooms (full cottage)",
    description:
      "Both bedrooms plus shared living, kitchenette, and deck — ideal for families or small groups visiting Bethel together.",
    rateLine: formatStayPackageRateLine(StayPackage.TWO_BEDROOMS),
    href: "/rooms",
  },
] as const;

export const CORE_SITE_LINKS = [
  { href: "/rooms", label: "Rooms & amenities" },
  { href: "/availability", label: "Availability" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "Request your stay" },
] as const;
