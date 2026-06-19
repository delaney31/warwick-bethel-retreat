import { getCanonicalSiteUrl, SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/content/brand";
import { PROPERTY_IMAGES } from "@/lib/content/property";

type JsonLd = Record<string, unknown>;

function siteUrl(): string {
  return getCanonicalSiteUrl();
}

function absoluteUrl(path: string): string {
  const base = siteUrl();
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildJsonLdGraph(...nodes: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function lodgingBusinessSchema(): JsonLd {
  return {
    "@type": "LodgingBusiness",
    "@id": `${siteUrl()}/#lodging`,
    name: SITE_NAME,
    url: siteUrl(),
    description:
      "Luxury nightly stay near Warwick Bethel with two bedrooms, wooded views, and host-reviewed bookings.",
    image: absoluteUrl(PROPERTY_IMAGES.hero),
    telephone: "+18134937008",
    email: SITE_CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tuxedo Park",
      addressRegion: "NY",
      addressCountry: "US",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Two bedrooms", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wooded deck", value: true },
      { "@type": "LocationFeatureSpecification", name: "High-speed Wi-Fi", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name: "Washer and dryer",
        value: true,
        description: "Available on request",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Kitchenette",
        value: true,
        description: "Microwave, mini fridge, and coffee station",
      },
    ],
  };
}

export function webSiteSchema(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl()}/#website`,
    url: siteUrl(),
    name: SITE_NAME,
    publisher: { "@id": `${siteUrl()}/#lodging` },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(
  items: Array<{ question: string; answer: string }>,
): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface StayOfferInput {
  name: string;
  description: string;
  price: number;
  url: string;
  eligibleQuantity?: number;
}

export function stayOfferSchema(offer: StayOfferInput): JsonLd {
  return {
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    url: absoluteUrl(offer.url),
    priceCurrency: "USD",
    price: offer.price,
    priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31)
      .toISOString()
      .slice(0, 10),
    availability: "https://schema.org/InStock",
    offeredBy: { "@id": `${siteUrl()}/#lodging` },
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      value: offer.eligibleQuantity ?? 2,
      unitText: "guests",
    },
  };
}

export function roomOffersSchema(): JsonLd {
  return {
    "@type": "ItemList",
    name: "Tuxedo Retreat nightly rates",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: stayOfferSchema({
          name: "Main bedroom stay",
          description: "$150/night for 2 guests · +$25/night per extra guest",
          price: 150,
          url: "/book",
          eligibleQuantity: 2,
        }),
      },
      {
        "@type": "ListItem",
        position: 2,
        item: stayOfferSchema({
          name: "Two-bedroom stay",
          description: "$200/night for 2 guests · +$25/night per extra guest",
          price: 200,
          url: "/book",
          eligibleQuantity: 2,
        }),
      },
    ],
  };
}
