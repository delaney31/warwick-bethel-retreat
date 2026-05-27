import type { Guide } from "./types";
import { whereToStayGuide } from "./articles/where-to-stay";
import { planningVisitGuide } from "./articles/planning-visit";
import { tuxedoVsWarwickGuide } from "./articles/tuxedo-vs-warwick";

export const GUIDES: Guide[] = [
  whereToStayGuide,
  planningVisitGuide,
  tuxedoVsWarwickGuide,
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function isGuideSlug(slug: string): boolean {
  return GUIDE_SLUGS.includes(slug);
}
