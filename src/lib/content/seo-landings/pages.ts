import type { SeoLandingPage } from "./types";
import { RETREAT_LOCATION, RETREAT_PROPERTY } from "./constants";

export const SEO_LANDING_PAGES: Record<string, SeoLandingPage> = {
  "lodging-near-warwick-bethel": {
    slug: "lodging-near-warwick-bethel",
    metaTitle: "Lodging Near Warwick Bethel",
    metaDescription:
      "Peaceful lodging near Warwick Bethel — two-bedroom cottage in Tuxedo Park with host-reviewed bookings, wooded quiet, and a 15-minute drive to headquarters.",
    h1: "Lodging Near Warwick Bethel",
    eyebrow: "Tuxedo Retreat · Warwick, New York",
    intro: [
      "If you are planning time at Warwick Bethel, thoughtful lodging nearby can make the week gentler — a place to rest, reflect, and sleep well after full days.",
      "Tuxedo Retreat is a small, host-managed cottage in the Tuxedo Park area: two bedrooms, a wooded deck, and an atmosphere chosen for calm rather than crowds.",
      "We welcome Bethel visitors who appreciate a personal reservation process — request your dates, receive a host review, and pay only after approval.",
    ],
    bethelDistance: {
      headline: "Distance to Warwick Bethel",
      paragraphs: [
        `The retreat is ${RETREAT_LOCATION.distanceToBethel} from Warwick Bethel — close enough for devotion to your schedule, far enough for genuine quiet in the evenings.`,
        RETREAT_LOCATION.driveNote,
      ],
    },
    pricing: {
      headline: "Nightly rates, explained simply",
      paragraphs: [
        "Main bedroom stays begin at $150 per night for two guests. The full two-bedroom cottage begins at $200 per night for two guests.",
        "Each additional guest is $25 per person, per night. Your total is calculated on the reservation form and confirmed before you pay.",
      ],
    },
    booking: {
      headline: "How booking works",
      intro:
        "We protect the calendar and our guests with a short, clear process — no instant anonymous bookings.",
    },
    propertyDetails: {
      headline: "Practical details",
      items: [
        { title: "Bedrooms & baths", body: `${RETREAT_PROPERTY.bedrooms} bedrooms · ${RETREAT_PROPERTY.bathrooms} bathrooms. See layout on our Rooms page.` },
        { title: "Parking", body: RETREAT_PROPERTY.parking },
        { title: "Entry", body: RETREAT_PROPERTY.entrance },
        { title: "Outdoor space", body: RETREAT_PROPERTY.deck },
        { title: "Wi‑Fi", body: RETREAT_PROPERTY.wifi },
        { title: "Laundry", body: RETREAT_PROPERTY.laundry },
        { title: "Kitchenette", body: RETREAT_PROPERTY.kitchenette },
      ],
    },
    faqs: [
      {
        id: "lodging-distance",
        question: "How far is Tuxedo Retreat from Warwick Bethel?",
        answer:
          "About 15 minutes by car under typical conditions. Many convention visitors prefer the short drive over staying in busier areas farther away.",
      },
      {
        id: "lodging-approval",
        question: "Why is my stay reviewed before payment?",
        answer:
          "Each reservation is personally approved so the calendar stays accurate and every guest receives clear check-in guidance. Payment is invited only after approval.",
      },
      {
        id: "lodging-families",
        question: "Can families stay here?",
        answer:
          "Yes. With two bedrooms and space for up to six guests, the cottage suits couples, families, and small groups who want shared space and quiet surroundings.",
      },
      {
        id: "lodging-laundry",
        question: "Is a washer and dryer available?",
        answer: RETREAT_PROPERTY.laundry,
      },
    ],
    cta: {
      heading: "Request lodging near Bethel",
      body: "When your dates are settled, share them on our reservation form. We will respond personally.",
    },
    relatedLinks: [
      { href: "/stay-near-warwick-bethel", label: "Stay near Warwick Bethel" },
      { href: "/warwick-bethel-visitor-stay", label: "Visitor stay guide" },
      { href: "/directions-to-warwick-bethel", label: "Directions" },
    ],
    includeLodgingSchema: true,
  },

  "stay-near-warwick-bethel": {
    slug: "stay-near-warwick-bethel",
    metaTitle: "Stay Near Warwick Bethel",
    metaDescription:
      "Tuxedo Retreat offers a peaceful nightly stay near Warwick Bethel with private rooms, wooded surroundings, host-reviewed bookings, and secure payment after approval.",
    h1: "A Peaceful Stay Near Warwick Bethel",
    eyebrow: "Nightly stay · Tuxedo Park",
    intro: [
      "A Bethel week is full — spiritually rich, socially full, and physically demanding. A good stay nearby gives you room to breathe.",
      "Tuxedo Retreat offers nightly accommodations in a wooded cottage setting: premium bedding, soft light, and space designed for unhurried evenings.",
      "You are welcomed as a guest, not a transaction number. Our host reviews each request and confirms details before inviting payment.",
    ],
    bethelDistance: {
      headline: "Close to Bethel, apart from the bustle",
      paragraphs: [
        `Warwick Bethel is ${RETREAT_LOCATION.distanceToBethel} away — a straightforward drive that keeps you near headquarters without staying on campus.`,
        "Guests often describe the cottage as a gentle contrast: birdsong and deck quiet instead of late-night traffic.",
      ],
    },
    pricing: {
      headline: "What your stay costs",
      paragraphs: [
        "Choose the main bedroom only, or reserve both bedrooms for your group. Rates start at $150/night (main) or $200/night (full cottage) for two included guests.",
        "Additional guests are $25 per person per night. View live availability before you request.",
      ],
    },
    booking: {
      headline: "Reservation process",
      intro: "Four calm steps — request, review, pay, arrive.",
    },
    propertyDetails: {
      headline: "Your stay includes",
      items: [
        { title: "Two room options", body: "Main bedroom only, or the full cottage with both bedrooms and shared living spaces." },
        { title: "Bathrooms", body: RETREAT_PROPERTY.bathroomsDetail },
        { title: "Kitchenette", body: "Mini fridge, microwave, and a Keurig coffee station for unhurried mornings." },
        { title: "Parking & arrival", body: `${RETREAT_PROPERTY.parking} ${RETREAT_PROPERTY.entrance}` },
      ],
    },
    faqs: [
      {
        id: "stay-minimum",
        question: "Is there a minimum number of nights?",
        answer:
          "Minimum stays may vary by season and calendar. Submit your preferred dates — we confirm what is possible in our reply.",
      },
      {
        id: "stay-checkin",
        question: "Can I arrive late after Bethel sessions?",
        answer:
          "Add timing notes to your request. We do our best to accommodate reasonable arrival windows when the calendar allows.",
      },
      {
        id: "stay-payment",
        question: "When am I charged?",
        answer:
          "Only after your host approves the stay. You then receive a secure checkout link; dates are firm once payment completes.",
      },
    ],
    cta: {
      heading: "Request your stay",
      body: "Check availability, then send a reservation request when you are ready. No payment until approval.",
    },
    relatedLinks: [
      { href: "/rooms", label: "Rooms & rates" },
      { href: "/availability", label: "Availability" },
      { href: "/faq", label: "FAQ" },
      { href: "/book", label: "Request your stay" },
      { href: "/lodging-near-warwick-bethel", label: "Lodging near Bethel" },
    ],
    includeLodgingSchema: true,
  },

  "warwick-bethel-visitor-stay": {
    slug: "warwick-bethel-visitor-stay",
    metaTitle: "Warwick Bethel Visitor Stay",
    metaDescription:
      "Planning a Warwick Bethel visit? Tuxedo Retreat offers a respectful, peaceful visitor stay — two bedrooms, 15 minutes from headquarters, host-reviewed booking.",
    h1: "A Visitor Stay for Warwick Bethel Guests",
    eyebrow: "Welcoming Bethel visitors",
    intro: [
      "Visitors to Warwick Bethel come for worship, convention, and fellowship — and often travel from far away. Restful lodging nearby honors the effort you have made to be here.",
      "Tuxedo Retreat is intentionally small: a private cottage where you can decompress, prepare for the next day, and enjoy woodland quiet.",
      "We speak with guests personally, answer questions before you book, and never rush you into payment before your dates are confirmed.",
    ],
    bethelDistance: {
      headline: "From the cottage to headquarters",
      paragraphs: [
        `Expect ${RETREAT_LOCATION.distanceToBethel} to Warwick Bethel by car — enough separation for sleep, close enough for morning sessions.`,
        "If you are new to the area, our Directions page offers general guidance; exact arrival details are shared after approval.",
      ],
    },
    pricing: {
      headline: "Rates for visitor stays",
      paragraphs: [
        "Main bedroom: from $150/night for two guests. Two bedrooms: from $200/night for two guests. Extra guests: $25 per person per night.",
        "Rates are listed clearly on the reservation form before checkout.",
      ],
    },
    booking: {
      headline: "Booking as a visitor",
      intro:
        "The same thoughtful process for every guest — whether you visit for a weekend or a full convention.",
    },
    propertyDetails: {
      headline: "Comforts that matter after long Bethel days",
      items: [
        { title: "Sleep", body: "Premium bedding, soft lighting, and bedrooms arranged for rest — not just a place to store luggage." },
        { title: "Quiet", body: "Wooded surroundings and a private deck when you want fresh air without noise." },
        { title: "Space for two or six", body: `Up to ${RETREAT_PROPERTY.maxGuests} guests when reserving both bedrooms — ask if your group size is larger.` },
        { title: "Arrival", body: RETREAT_PROPERTY.entrance },
      ],
    },
    faqs: [
      {
        id: "visitor-couples",
        question: "Is this suitable for couples visiting Bethel?",
        answer:
          "Yes. The main bedroom package is popular with couples who want privacy and a simple, peaceful base near headquarters.",
      },
      {
        id: "visitor-groups",
        question: "Can a small group stay together?",
        answer:
          "Reserve the two-bedroom package for shared living space, kitchenette access, and the deck. Maximum occupancy is six guests.",
      },
      {
        id: "visitor-contact",
        question: "May I ask questions before requesting?",
        answer:
          "Of course. Use our contact form if you would like to discuss dates, accessibility, or travel plans before submitting a reservation.",
      },
    ],
    cta: {
      heading: "Begin your visitor stay request",
      body: "We are glad to help you plan. Start with availability, then request your dates when ready.",
    },
    relatedLinks: [
      { href: "/bethel-visitor-guide", label: "Bethel visitor guide" },
      { href: "/private-room-near-warwick-ny", label: "Private room option" },
      { href: "/contact", label: "Contact host" },
    ],
    includeLodgingSchema: true,
  },

  "private-room-near-warwick-ny": {
    slug: "private-room-near-warwick-ny",
    metaTitle: "Private Room Near Warwick, NY",
    metaDescription:
      "Private main-bedroom stay near Warwick, NY — peaceful Bethel-adjacent lodging at Tuxedo Retreat from $150/night. Host-reviewed, two-guest base rate.",
    h1: "Private Room Stay Near Warwick, New York",
    eyebrow: "Main bedroom · Private suite",
    intro: [
      "Not every traveler needs an entire house. Our main bedroom package offers a private suite with access to shared living areas — ideal when you want simplicity and quiet near Warwick.",
      "Tuxedo Retreat sits in the Tuxedo Park area, a short drive from Warwick Bethel and the surrounding Hudson Valley countryside.",
      "You still receive personal host communication, clear pricing, and the same unhurried approval process as full-cottage guests.",
    ],
    bethelDistance: {
      headline: "Warwick & Bethel access",
      paragraphs: [
        `Warwick Bethel is ${RETREAT_LOCATION.distanceToBethel} by car. Warwick village and local services are within easy reach for supplies and errands.`,
        "The main bedroom is chosen most often by couples and two-guest visits.",
      ],
    },
    roomOptionsIntro:
      "This page highlights the main bedroom package. Families or groups may prefer the two-bedroom option on our Rooms page.",
    pricing: {
      headline: "Main bedroom pricing",
      paragraphs: [
        "From $150 per night for two included guests. Each additional guest is $25 per person per night.",
        "If your group needs both bedrooms, select the two-bedroom package from $200/night for two guests.",
      ],
    },
    booking: {
      headline: "Reserve the main bedroom",
      intro: "Select “Main bedroom” on the reservation form when you request your stay.",
    },
    propertyDetails: {
      headline: "Room & cottage details",
      items: [
        { title: "Private master suite", body: "Premium bedding, natural light, and a calm atmosphere — with shared access to living areas and deck." },
        { title: "Bathrooms", body: RETREAT_PROPERTY.bathroomsDetail },
        { title: "Parking", body: RETREAT_PROPERTY.parking },
        { title: "Not a hotel room", body: "A residential cottage with a personal host — quiet, respectful, and suited to longer Bethel weeks." },
      ],
    },
    faqs: [
      {
        id: "private-shared",
        question: "Will I share the cottage with strangers?",
        answer:
          "We do not book multiple unrelated parties at once. When you reserve the main bedroom, the cottage is reserved for your party within the package you choose.",
      },
      {
        id: "private-amenities",
        question: "What shared spaces are included?",
        answer:
          "Guests have access to the studio living area, kitchenette, coffee station, and wooded deck according to your booked package.",
      },
      {
        id: "private-upgrade",
        question: "Can I upgrade to both bedrooms later?",
        answer:
          "If the calendar allows, contact us before your stay. Availability for the full cottage depends on existing reservations.",
      },
    ],
    cta: {
      heading: "Request the main bedroom",
      body: "Share your dates and guest count. We will confirm availability and next steps personally.",
    },
    relatedLinks: [
      { href: "/rooms", label: "Compare room options" },
      { href: "/warwick-ny-nightly-stay", label: "Warwick nightly stay" },
      { href: "/book", label: "Reservation form" },
    ],
    includeLodgingSchema: true,
  },

  "tuxedo-ny-retreat": {
    slug: "tuxedo-ny-retreat",
    metaTitle: "Tuxedo, NY Retreat — Stay Near Warwick Bethel",
    metaDescription:
      "A quiet Tuxedo, NY retreat with two bedrooms, wooded deck, and host-managed stays — 15 minutes from Warwick Bethel. Request dates at Tuxedo Retreat.",
    h1: "A Quiet Retreat in Tuxedo, New York",
    eyebrow: "Tuxedo · Hudson Valley",
    intro: [
      "Tuxedo and the surrounding Warwick area offer something rare so close to New York City: trees, stillness, and room to breathe.",
      "Tuxedo Retreat is a small luxury cottage here — chosen by Bethel visitors and weekend travelers who want comfort without a commercial hotel feel.",
      "Two bedrooms, vaulted light, hardwood floors, and a deck overlooking woodland — with a host who knows the property and the rhythm of local visits.",
    ],
    bethelDistance: {
      headline: "Tuxedo to Warwick Bethel",
      paragraphs: [
        `From the cottage, Warwick Bethel is ${RETREAT_LOCATION.distanceToBethel} — a practical base for convention weeks and midweek visits.`,
        "Many guests enjoy the drive itself: winding roads, green hills, and a clear mental shift from travel to rest.",
      ],
    },
    pricing: {
      headline: "Retreat rates",
      paragraphs: [
        "Nightly stays from $150 (main bedroom, two guests) or $200 (both bedrooms, two guests). Additional guests: $25 per person per night.",
        "See the reservation form for a total based on your exact dates.",
      ],
    },
    booking: {
      headline: "Stay at the retreat",
      intro: "We keep the calendar intentional — each stay is invited and confirmed with care.",
    },
    propertyDetails: {
      headline: "The cottage",
      items: [
        { title: "Setting", body: "Wooded, residential quiet — designed for reflection and rest." },
        { title: "Indoors", body: `Vaulted ceilings, premium bedding, ${RETREAT_PROPERTY.kitchenette.toLowerCase()}` },
        { title: "Outdoors", body: RETREAT_PROPERTY.deck },
        { title: "Arrival", body: `${RETREAT_PROPERTY.parking} ${RETREAT_PROPERTY.entrance}` },
      ],
    },
    faqs: [
      {
        id: "tuxedo-season",
        question: "What season is best for a Tuxedo stay?",
        answer:
          "Each season has its character — spring green, summer deck evenings, autumn color, winter stillness. Convention dates often fill early; request ahead when possible.",
      },
      {
        id: "tuxedo-bethel",
        question: "Is this mainly for Bethel visitors?",
        answer:
          "Many guests visit Warwick Bethel, but anyone seeking a peaceful Hudson Valley nightly stay is welcome to inquire.",
      },
      {
        id: "tuxedo-gallery",
        question: "Can I see photos before booking?",
        answer:
          "Yes — browse our Gallery and Rooms pages for interior, bedroom, and deck imagery.",
      },
    ],
    cta: {
      heading: "Request dates at Tuxedo Retreat",
      body: "When the cottage fits your plans, we would be glad to hear from you.",
    },
    relatedLinks: [
      { href: "/tuxedo-park-ny-stay", label: "Tuxedo Park stay" },
      { href: "/gallery", label: "Photo gallery" },
      { href: "/lodging-near-warwick-bethel", label: "Lodging near Bethel" },
    ],
    includeLodgingSchema: true,
  },

  "tuxedo-park-ny-stay": {
    slug: "tuxedo-park-ny-stay",
    metaTitle: "Tuxedo Park, NY Stay Near Warwick Bethel",
    metaDescription:
      "Overnight stay in the Tuxedo Park, NY area — peaceful cottage lodging at Tuxedo Retreat, minutes from Warwick Bethel. Two bedrooms, host-reviewed booking.",
    h1: "Overnight Stay in the Tuxedo Park Area",
    eyebrow: "Tuxedo Park · Private cottage",
    intro: [
      "Tuxedo Park is known for woodland privacy and a slower pace — a fitting setting when your days at Warwick Bethel are full.",
      "Our cottage offers an overnight stay in this atmosphere: not a resort, not a dormitory — a home-like space with a gracious host.",
      "Reserve the main bedroom for an intimate trip, or both bedrooms when family or friends travel with you.",
    ],
    bethelDistance: {
      headline: "Bethel access from Tuxedo Park",
      paragraphs: [
        `Warwick Bethel is ${RETREAT_LOCATION.distanceToBethel} from the property under normal driving conditions.`,
        "Guests appreciate returning to a residential neighborhood rather than a busy highway strip.",
      ],
    },
    pricing: {
      headline: "Overnight pricing",
      paragraphs: [
        "Main bedroom from $150/night (2 guests). Full cottage from $200/night (2 guests). Extra guests $25/person/night.",
        "Your quote appears on the booking form once dates and guest count are entered.",
      ],
    },
    booking: {
      headline: "How to book your overnight stay",
      intro: "Start with the calendar, then submit a request — we reply personally.",
    },
    propertyDetails: {
      headline: "Good to know before you arrive",
      items: [
        { title: "Bedrooms", body: "Two serene bedrooms with flexible sleeping options — see Rooms for photos." },
        { title: "Bathrooms", body: RETREAT_PROPERTY.bathroomsDetail },
        { title: "Deck & quiet", body: RETREAT_PROPERTY.deck },
        { title: "Parking", body: RETREAT_PROPERTY.parking },
      ],
    },
    faqs: [
      {
        id: "park-two-night",
        question: "Do you accept single-night stays?",
        answer:
          "Availability varies. Submit your dates — we will confirm whether a one-night stay is possible on the calendar.",
      },
      {
        id: "park-entrance",
        question: "How do I enter the property?",
        answer:
          "You receive personal arrival instructions after your reservation is approved and paid — including parking and entry guidance.",
      },
      {
        id: "park-compare",
        question: "How is this different from a hotel in Warwick?",
        answer:
          "Hotels offer scale; we offer a single cared-for cottage, direct host contact, and a residential wooded setting minutes from Bethel.",
      },
    ],
    cta: {
      heading: "Plan your Tuxedo Park stay",
      body: "Check availability and send a request when your travel dates are firm.",
    },
    relatedLinks: [
      { href: "/tuxedo-ny-retreat", label: "Tuxedo, NY retreat" },
      { href: "/availability", label: "Live calendar" },
      { href: "/faq", label: "Common questions" },
    ],
    includeLodgingSchema: true,
  },

  "warwick-ny-nightly-stay": {
    slug: "warwick-ny-nightly-stay",
    metaTitle: "Warwick, NY Nightly Stay Near Bethel",
    metaDescription:
      "Nightly stay in Warwick, NY area at Tuxedo Retreat — peaceful cottage near Warwick Bethel from $150/night. Two bedrooms, wooded deck, host approval.",
    h1: "Nightly Stay in the Warwick, New York Area",
    eyebrow: "Warwick · Orange County",
    intro: [
      "Warwick draws visitors for Bethel, countryside, and a gentler pace than the city. A nightly stay nearby should feel restful — not like another appointment.",
      "Tuxedo Retreat provides short-term lodging in the Warwick / Tuxedo Park area: clear rates, a visible calendar, and communication with a real host.",
      "Whether you are here for a convention week or a brief visit, you can request dates without pressure and pay only after approval.",
    ],
    bethelDistance: {
      headline: "Warwick Bethel proximity",
      paragraphs: [
        `Headquarters is ${RETREAT_LOCATION.distanceToBethel} away — practical for daily sessions while sleeping in a quieter residential setting.`,
        "Local Warwick amenities are accessible for groceries, fuel, and errands between Bethel activities.",
      ],
    },
    pricing: {
      headline: "Nightly rates",
      paragraphs: [
        "$150/night main bedroom · $200/night two bedrooms — both base rates include two guests.",
        "Additional guests: $25 per person per night. Multi-night totals are shown before checkout.",
      ],
    },
    booking: {
      headline: "Reserve your nights",
      intro: "Select package, dates, and guests on our form — we handle the rest with you.",
    },
    propertyDetails: {
      headline: "Cottage amenities",
      items: [
        { title: "Sleeps 2–6", body: `${RETREAT_PROPERTY.sleepsIncluded} guests included in base rate; up to ${RETREAT_PROPERTY.maxGuests} with both bedrooms.` },
        { title: "1.5 baths", body: RETREAT_PROPERTY.bathroomsDetail },
        { title: "Coffee & kitchenette", body: RETREAT_PROPERTY.kitchenette },
        { title: "Laundry", body: RETREAT_PROPERTY.laundry },
        { title: "Parking", body: RETREAT_PROPERTY.parking },
      ],
    },
    faqs: [
      {
        id: "warwick-calendar",
        question: "How do I know which nights are open?",
        answer:
          "Our availability calendar shows open, pending, and booked dates in real time. You can also submit a request and we will confirm.",
      },
      {
        id: "warwick-cancel",
        question: "What if my Bethel plans change?",
        answer:
          "Contact us as soon as you know. Cancellation terms are shared upon approval — we aim to be fair and clear.",
      },
      {
        id: "warwick-length",
        question: "Can I stay a full convention week?",
        answer:
          "Yes, when the calendar allows. Longer stays are welcome — request your full date range on the booking form.",
      },
    ],
    cta: {
      heading: "Request your Warwick-area nights",
      body: "We are honored to host Bethel visitors and peaceful travelers alike.",
    },
    relatedLinks: [
      { href: "/private-room-near-warwick-ny", label: "Private room option" },
      { href: "/book", label: "Book" },
      { href: "/directions-to-warwick-bethel", label: "Directions to Bethel" },
    ],
    includeLodgingSchema: true,
  },

  "bethel-visitor-guide": {
    slug: "bethel-visitor-guide",
    metaTitle: "Warwick Bethel Visitor Guide — Lodging & Planning",
    metaDescription:
      "A gentle planning guide for Warwick Bethel visitors — lodging near headquarters, rest between sessions, and how Tuxedo Retreat welcomes guests.",
    h1: "A Gentle Guide for Warwick Bethel Visitors",
    eyebrow: "Planning your visit",
    intro: [
      "Traveling to Warwick Bethel is a privilege — and it can also be tiring. Good planning is not about luxury for its own sake; it is about stewardship of your energy for worship, learning, and fellowship.",
      "This guide shares practical thoughts: how far lodging should be, what to look for in a stay, and how Tuxedo Retreat welcomes visitors who want peace between sessions.",
      "We write respectfully, knowing your primary purpose is spiritual — lodging simply supports that purpose.",
    ],
    bethelDistance: {
      headline: "How close should lodging be?",
      paragraphs: [
        "Many visitors prefer to stay within fifteen to twenty minutes of headquarters — close enough for a morning drive, far enough to decompress at night.",
        `Tuxedo Retreat is ${RETREAT_LOCATION.distanceToBethel} from Warwick Bethel, in a wooded residential area of the Tuxedo Park / Warwick community.`,
        "Some guests carpool; others drive individually. Either way, a short, predictable commute helps on early mornings.",
      ],
    },
    pricing: {
      headline: "Budgeting for your stay",
      paragraphs: [
        "Hotel rates in the region can spike during busy convention periods. A small cottage rental may offer more space and quiet per dollar — especially for couples or families.",
        "At Tuxedo Retreat, main bedroom stays start at $150/night for two guests; the full cottage starts at $200/night. Extra guests are $25 per person per night.",
      ],
    },
    booking: {
      headline: "Booking thoughtfully",
      intro:
        "We recommend requesting lodging as soon as your Bethel dates are firm. Popular weeks fill in advance.",
    },
    propertyDetails: {
      headline: "What many Bethel visitors appreciate",
      items: [
        { title: "Quiet", body: "A place to pray, read, and sleep without hallway noise." },
        { title: "Space", body: "A deck, living area, and second bedroom when family travels together." },
        { title: "Clarity", body: "Known rates, host-reviewed approval, and check-in instructions before arrival." },
        { title: "Respect", body: "We welcome guests who treat the cottage and neighbors with care." },
      ],
    },
    faqs: [
      {
        id: "guide-first",
        question: "Is this your first time hosting Bethel visitors?",
        answer:
          "We regularly welcome convention guests, couples, and families. Our FAQ and contact form are here for any question before you book.",
      },
      {
        id: "guide-alone",
        question: "May I stay alone?",
        answer:
          "Yes. Solo guests often choose the main bedroom package for simplicity and quiet.",
      },
      {
        id: "guide-faith",
        question: "Do I need to be a Bethel visitor to stay?",
        answer:
          "Many guests visit Bethel, but anyone seeking a peaceful nightly stay in the Warwick area may request dates subject to approval.",
      },
    ],
    cta: {
      heading: "When you are ready to reserve",
      body: "Browse rooms and availability, then submit a request. There is no obligation until you choose to pay after approval.",
    },
    relatedLinks: [
      { href: "/warwick-bethel-visitor-stay", label: "Visitor stay overview" },
      { href: "/lodging-near-warwick-bethel", label: "Lodging near Bethel" },
      { href: "/directions-to-warwick-bethel", label: "Directions" },
    ],
    includeLodgingSchema: false,
  },

  "directions-to-warwick-bethel": {
    slug: "directions-to-warwick-bethel",
    metaTitle: "Directions to Warwick Bethel from Tuxedo Retreat",
    metaDescription:
      "Driving from Tuxedo Retreat to Warwick Bethel — about 15 minutes. General area guidance for Bethel visitors staying at our cottage near headquarters.",
    h1: "Directions to Warwick Bethel",
    eyebrow: "From Tuxedo Retreat · ~15 minutes",
    intro: [
      "If you are staying at Tuxedo Retreat, Warwick Bethel is a short drive away — typically about fifteen minutes under normal conditions.",
      "Exact routing depends on your starting point, traffic, and which Bethel entrance you use. We recommend a maps app once your travel dates are set.",
      "After your stay is approved, your host can answer practical questions about morning departures and local roads.",
    ],
    bethelDistance: {
      headline: "Distance & drive time",
      paragraphs: [
        `Plan for ${RETREAT_LOCATION.distanceToBethel} between the cottage and Warwick Bethel headquarters.`,
        "Convention weeks may add traffic at peak hours — many guests leave a little earlier on session mornings.",
        "The retreat is in the Tuxedo Park / Warwick area of Orange County, New York — wooded, residential, and calm at night.",
      ],
    },
    pricing: {
      headline: "Staying nearby",
      paragraphs: [
        "If you have not yet booked lodging, our nightly stays begin at $150 for the main bedroom (two guests).",
        "See availability and request dates when you are ready — payment comes only after host approval.",
      ],
    },
    booking: {
      headline: "Book lodging before you travel",
      intro: "Secure your cottage nights first, then finalize driving plans.",
    },
    propertyDetails: {
      headline: "Arrival at Tuxedo Retreat",
      items: [
        { title: "Before you drive to Bethel", body: "Complete your reservation and receive check-in details from your host." },
        { title: "Parking", body: RETREAT_PROPERTY.parking },
        { title: "Entry", body: RETREAT_PROPERTY.entrance },
        { title: "Questions", body: "Use our contact form for timing or accessibility questions before travel day." },
      ],
    },
    faqs: [
      {
        id: "dir-gps",
        question: "Should I rely on GPS?",
        answer:
          "Yes — use a current maps application for turn-by-turn directions to Warwick Bethel and to the cottage. Road names and entrances are easiest to follow live.",
      },
      {
        id: "dir-rideshare",
        question: "Can I use rideshare to Bethel?",
        answer:
          "Some guests do for individual trips. Availability varies in suburban Orange County — many visitors prefer having their own car for the week.",
      },
      {
        id: "dir-address",
        question: "When do I receive the cottage address?",
        answer:
          "Arrival details are shared after your reservation is approved and confirmed with payment — along with parking and entry guidance.",
      },
    ],
    cta: {
      heading: "Reserve lodging near Bethel",
      body: "If Tuxedo Retreat fits your visit, we would be glad to host you. Check availability and request your stay.",
    },
    relatedLinks: [
      { href: "/bethel-visitor-guide", label: "Visitor guide" },
      { href: "/stay-near-warwick-bethel", label: "Stay near Bethel" },
      { href: "/contact", label: "Ask the host" },
    ],
    includeLodgingSchema: false,
  },
};

export const SEO_LANDING_SLUGS = Object.keys(SEO_LANDING_PAGES);

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES[slug];
}

export function isSeoLandingSlug(slug: string): boolean {
  return slug in SEO_LANDING_PAGES;
}
