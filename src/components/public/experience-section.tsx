import { PropertyImage } from "@/components/ui/property-image";
import { PROPERTY_IMAGES } from "@/lib/content/property";
import { SITE_NAME } from "@/lib/content/brand";
import { Button } from "@/components/ui/button";

const MOMENTS = [
  {
    title: "Woodland quiet",
    body: "Step onto your private deck and let the trees hold the silence. Mornings here begin with birdsong, not alarms — the kind of stillness that makes Bethel weeks feel sustainable.",
  },
  {
    title: "Rest that restores",
    body: "After long days at Warwick, return to vaulted light, soft linens, and rooms arranged for unhurried evenings. This is not a pass-through rental — it is a place to exhale.",
  },
  {
    title: "Coffee, then convenience",
    body: "A curated coffee station waits when you rise. Fifteen minutes down the road, Warwick Bethel — close enough for devotion to your schedule, far enough for true privacy.",
  },
] as const;

export function ExperienceSection() {
  return (
    <section className="bg-stone-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
              The experience
            </p>
            <h2 className="mt-4 font-serif text-3xl font-light leading-snug text-stone-900 md:text-4xl">
              A retreat shaped for Bethel visitors who value peace
            </h2>
            <p className="mt-6 text-base leading-relaxed text-stone-600">
              {SITE_NAME} was imagined for guests who carry full schedules and deserve
              a home that feels considered — warm hardwood underfoot, generous windows onto the
              woods, and hosting that is personal, not automated.
            </p>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              Whether you arrive as a couple, with family, or alongside friends, you will find
              privacy without isolation: two bedrooms, a half bath for guests, and common spaces
              designed for conversation that does not compete with the forest outside.
            </p>
            <Button href="/gallery" variant="secondary" className="mt-10">
              View the gallery
            </Button>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-stone-900/10 lg:col-span-7">
            <PropertyImage
              src={PROPERTY_IMAGES.living}
              alt="Vaulted living area with garden views"
              imageKey="living"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 to-transparent" />
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3 md:gap-10">
          {MOMENTS.map((m) => (
            <article
              key={m.title}
              className="border-t border-stone-200 pt-8"
            >
              <h3 className="font-serif text-xl font-light text-stone-900">{m.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{m.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
            <PropertyImage
              src={PROPERTY_IMAGES.deck}
              alt="Wooded deck with Adirondack seating"
              imageKey="deck"
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
            <PropertyImage
              src={PROPERTY_IMAGES.mainBedroomWide}
              alt="Main bedroom with queen bed and deck access"
              imageKey="mainBedroomWide"
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
