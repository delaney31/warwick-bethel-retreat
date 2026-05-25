import { HeroSection } from "@/components/public/hero-section";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/ui/property-image";
import { AMENITIES, PROPERTY_IMAGES } from "@/lib/content/property";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">The experience</p>
              <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
                Calm elegance for your Bethel visit
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                Not a generic rental — a boutique countryside retreat with vaulted ceilings,
                large windows, hardwood floors, and a wooded deck wrapped in quiet luxury.
              </p>
              <ul className="mt-8 space-y-2 text-sm text-stone-700">
                {AMENITIES.slice(0, 5).map((a) => (
                  <li key={a} className="flex gap-2"><span className="text-amber-500">◆</span>{a}</li>
                ))}
              </ul>
              <Button href="/rooms" className="mt-8">Explore Rooms</Button>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <PropertyImage src={PROPERTY_IMAGES.living} alt="Vaulted living space" imageKey="living" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-950 py-20 text-white md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">Proximity</p>
          <h2 className="mt-4 font-serif text-3xl font-light md:text-4xl">Fifteen minutes from Warwick Bethel</h2>
          <p className="mt-6 text-sm leading-relaxed text-white/70">
            Purpose-built for convention visitors who value peace after full days at headquarters —
            couples, families, and friends welcomed with personal host review before confirmation.
          </p>
          <Button href="/book" className="mt-10">Check Availability</Button>
        </div>
      </section>
    </>
  );
}
