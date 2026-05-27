export interface SeoLandingFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SeoLandingPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string[];
  bethelDistance: {
    headline: string;
    paragraphs: string[];
  };
  roomOptionsIntro?: string;
  pricing: {
    headline: string;
    paragraphs: string[];
  };
  booking: {
    headline: string;
    intro: string;
  };
  propertyDetails: {
    headline: string;
    items: Array<{ title: string; body: string }>;
  };
  faqs: SeoLandingFaq[];
  cta: {
    heading: string;
    body: string;
  };
  relatedLinks: Array<{ href: string; label: string }>;
  /** Include LodgingBusiness JSON-LD on this page. */
  includeLodgingSchema?: boolean;
}
