import type { Metadata } from "next";
import { ExperienceSection } from "@/components/public/experience-section";
import { HeroSection } from "@/components/public/hero-section";
import { TrustStrip } from "@/components/public/trust-strip";
import { HomepageExploreLinks } from "@/components/public/homepage-explore-links";
import { HomepageWhyStay } from "@/components/public/homepage-why-stay";
import { BookingFlowSection } from "@/components/public/booking-flow-section";
import { HomepageFaqPreview } from "@/components/public/homepage-faq-preview";
import { GalleryPreviewSection } from "@/components/public/gallery-preview-section";
import { HomepageDirectionsSection } from "@/components/public/homepage-directions-section";
import { GuestReviewsSection } from "@/components/public/guest-reviews-section";
import { RoomPackageCards } from "@/components/public/room-package-cards";
import { AvailabilityPreviewSection } from "@/components/public/availability-preview-section";
import { WaitlistCtaSection } from "@/components/public/waitlist-cta-section";
import { FinalCtaSection } from "@/components/public/final-cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/content/site-metadata";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { HOMEPAGE_FAQ_PREVIEW_QUESTIONS, HOMEPAGE_META } from "@/lib/content/homepage";
import {
  buildJsonLdGraph,
  faqPageSchema,
  lodgingBusinessSchema,
  webSiteSchema,
} from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: HOMEPAGE_META.title,
  description: HOMEPAGE_META.description,
  path: "/",
  absoluteTitle: true,
});

const faqPreviewForSchema = HOMEPAGE_FAQ_PREVIEW_QUESTIONS.map((question) => {
  const item = FAQ_ITEMS.find((f) => f.question === question)!;
  return { question: item.question, answer: item.answer };
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={buildJsonLdGraph(
          lodgingBusinessSchema(),
          webSiteSchema(),
          faqPageSchema(faqPreviewForSchema),
        )}
      />
      <HeroSection />
      <TrustStrip />
      <GalleryPreviewSection />
      <RoomPackageCards />
      <ExperienceSection />
      <HomepageDirectionsSection />
      <AvailabilityPreviewSection />
      <GuestReviewsSection />
      <HomepageExploreLinks />
      <HomepageWhyStay />
      <BookingFlowSection />
      <WaitlistCtaSection />
      <HomepageFaqPreview />
      <FinalCtaSection />
    </>
  );
}
