import { PropertyImage } from "@/components/ui/property-image";
import { PROPERTY_IMAGES } from "@/lib/content/property";
import { SITE_NAME } from "@/lib/content/brand";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-stone-950 py-28 md:py-36">
      <div className="absolute inset-0 opacity-40">
        <PropertyImage
          src={PROPERTY_IMAGES.deck}
          alt=""
          imageKey="deck"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/70" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/90">
          {SITE_NAME}
        </p>
        <h2 className="mt-5 font-serif text-3xl font-light leading-snug text-white md:text-5xl">
          Planning your Bethel visit? Request your dates today.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-white/60">
          Submit a reservation request when you are ready. Your host will review your stay and
          invite you to secure payment only after approval.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/book" size="lg">
            Request Your Stay
          </Button>
          <Button
            href="/availability"
            size="lg"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            Check availability
          </Button>
        </div>
      </div>
    </section>
  );
}
