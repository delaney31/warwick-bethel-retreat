export interface GuideFaq {
  id: string;
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  level?: 2 | 3;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideLink {
  href: string;
  label: string;
}

export interface GuideCta {
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  heroImage?: string;
  heroImageAlt?: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedLinks: GuideLink[];
  relatedGuideSlugs?: string[];
  cta: GuideCta;
}
