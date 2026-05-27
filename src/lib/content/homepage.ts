/** Homepage SEO — primary: lodging near Warwick Bethel */
export const HOMEPAGE_META = {
  title: "Lodging Near Warwick Bethel | Tuxedo Retreat",
  description:
    "Peaceful lodging near Warwick Bethel at Tuxedo Retreat — host-reviewed stays, main bedroom from $150/night, two bedrooms from $200/night. Bethel visitor lodging in Tuxedo, NY.",
} as const;

export const HOMEPAGE_HERO = {
  eyebrow: "Tuxedo Retreat · Tuxedo Park, New York",
  h1: "Lodging Near Warwick Bethel",
  intro:
    "Tuxedo Retreat is a quiet, host-managed cottage for Bethel visitors — two serene bedrooms, wooded views, and a gentle fifteen-minute drive to Warwick Bethel headquarters.",
  subintro:
    "Request your dates personally. There is no payment until your stay is reviewed and approved.",
} as const;

export const CORE_SITE_LINKS = [
  { href: "/rooms", label: "Rooms & amenities" },
  { href: "/availability", label: "Availability" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "Request your stay" },
] as const;

export const HOMEPAGE_SEO_LINKS = [
  { href: "/stay-near-warwick-bethel", label: "Stay near Warwick Bethel" },
  { href: "/warwick-bethel-visitor-stay", label: "Bethel visitor stay" },
  { href: "/private-room-near-warwick-ny", label: "Private room near Warwick" },
  { href: "/tuxedo-ny-retreat", label: "Tuxedo, NY retreat" },
  { href: "/bethel-visitor-guide", label: "Visitor guide" },
] as const;

/** Match FAQ_ITEMS by question prefix for homepage preview */
export const HOMEPAGE_FAQ_PREVIEW_QUESTIONS = [
  "How far is the retreat from Warwick Bethel?",
  "How does the reservation process work?",
  "What is included in the nightly rate?",
] as const;

export const WHY_STAY_POINTS = [
  {
    title: "Close, not crowded",
    body: "Warwick Bethel is about fifteen minutes away — near enough for your schedule, far enough for true quiet at night.",
  },
  {
    title: "A home, not a hallway",
    body: "Vaulted light, premium bedding, a private deck, and space for couples or families — designed for rest between full Bethel days.",
  },
  {
    title: "Hosting you can reach",
    body: "Every stay is host-reviewed with clear rates and secure payment only after approval. Questions welcome before you book.",
  },
] as const;
