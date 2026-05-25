import { HeroSection } from "@/components/public/hero-section";
import { TrustStrip } from "@/components/public/trust-strip";
import { ExperienceSection } from "@/components/public/experience-section";
import { BookingFlowSection } from "@/components/public/booking-flow-section";
import { GalleryPreviewSection } from "@/components/public/gallery-preview-section";
import { FinalCtaSection } from "@/components/public/final-cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ExperienceSection />
      <BookingFlowSection />
      <GalleryPreviewSection />
      <FinalCtaSection />
    </>
  );
}
