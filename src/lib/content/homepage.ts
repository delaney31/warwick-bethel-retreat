/** Homepage SEO — primary: lodging near Warwick Bethel */
export const HOMEPAGE_META = {
  title: "Bethel Visitor Lodging Near Warwick Bethel | Tuxedo Retreat",
  description:
    "Bethel visitor lodging near Warwick Bethel — host-reviewed cottage stays at Tuxedo Retreat in the Warwick, NY area. Main bedroom from $150/night, 15 minutes from headquarters.",
} as const;

export const HOMEPAGE_HERO = {
  eyebrow: "Bethel visitor stay · Tuxedo Retreat · Warwick area",
  h1: "Bethel Visitor Lodging Near Warwick Bethel",
  intro:
    "Tuxedo Retreat is a quiet, host-managed cottage for Warwick Bethel visitors — two serene bedrooms, wooded views, and about fifteen minutes to headquarters from the Warwick area (Tuxedo Park neighborhood).",
  subintro:
    "Request your dates personally. There is no payment until your stay is reviewed and approved.",
} as const;

export const CORE_SITE_LINKS = [
  { href: "/gallery", label: "Photo gallery" },
  { href: "/rooms", label: "Rooms & amenities" },
  { href: "/policies", label: "Guest policies" },
  { href: "/availability", label: "Availability" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "Request your stay" },
] as const;

export const HOMEPAGE_SEO_LINKS = [
  { href: "/lodging-near-warwick-bethel", label: "Lodging near Bethel" },
  { href: "/stay-near-warwick-bethel", label: "Stay near Warwick Bethel" },
  { href: "/warwick-bethel-visitor-stay", label: "Bethel visitor stay" },
  { href: "/bethel-visitor-guide", label: "Visitor guide" },
  { href: "/private-room-near-warwick-ny", label: "Private room near Warwick" },
] as const;

/** Match FAQ_ITEMS by question prefix for homepage preview */
export const HOMEPAGE_FAQ_PREVIEW_QUESTIONS = [
  "How far is the retreat from Warwick Bethel?",
  "Is laundry available?",
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
