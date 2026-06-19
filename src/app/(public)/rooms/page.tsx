import type { Metadata } from "next";
import { PropertyImage } from "@/components/ui/property-image";
import { AMENITIES, KITCHENETTE_NOTE, LAUNDRY_NOTE, PROPERTY_IMAGES } from "@/lib/content/property";
import { pageMetadata } from "@/lib/content/site-metadata";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, roomOffersSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Rooms & Amenities",
  description:
    "Two bedrooms, 1.5 baths, wooded deck, kitchenette, Wi‑Fi, washer/dryer on request — luxury cottage at Tuxedo Retreat near Warwick Bethel.",
  path: "/rooms",
});

export default function RoomsPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Rooms", path: "/rooms" },
          ]),
          roomOffersSchema(),
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">Accommodations</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-900 md:text-5xl">Rooms & Amenities</h1>
        <p className="mt-4 max-w-2xl text-stone-600">
          Two serene bedrooms with premium bedding, a cozy daybed nook, and an outdoor deck
          immersed in wooded quiet — designed for rest between Bethel days.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { src: PROPERTY_IMAGES.living, key: "living" as const, title: "Studio Living", desc: "Vaulted ceilings, hardwood floors, and garden views through the arched deck door." },
            { src: PROPERTY_IMAGES.bedroom, key: "bedroom" as const, title: "Bedrooms", desc: "Premium bedding, soft lighting, and flexible sleeping for families or groups." },
            { src: PROPERTY_IMAGES.deck, key: "deck" as const, title: "Wooded Deck", desc: "Private deck with Adirondack seating — morning coffee, evening calm." },
            { src: PROPERTY_IMAGES.daybed, key: "daybed" as const, title: "Cozy Daybed", desc: "Reading nook with natural light — perfect for quiet reflection." },
            { src: PROPERTY_IMAGES.kitchen, key: "kitchen" as const, title: "Kitchenette", desc: KITCHENETTE_NOTE },
            { src: PROPERTY_IMAGES.windows, key: "windows" as const, title: "Master Suite", desc: "Spacious room with deck access, workspace, and woodland views." },
          ].map((room) => (
            <article key={room.title} className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="relative aspect-[4/3]">
                <PropertyImage src={room.src} alt={room.title} imageKey={room.key} fill sizes="50vw" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-light text-stone-900">{room.title}</h2>
                <p className="mt-2 text-sm text-stone-600">{room.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="text-lg font-medium text-stone-900">Rates</h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            <li>
              <strong className="text-stone-900">Main bedroom:</strong> $150/night for 2 guests · +$25/night
              per extra guest
            </li>
            <li>
              <strong className="text-stone-900">Two bedrooms:</strong> $200/night for 2 guests · +$25/night
              per extra guest
            </li>
          </ul>
          <h2 className="mt-8 text-lg font-medium text-stone-900">Full amenity list</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {AMENITIES.map((a) => (
              <li key={a} className="text-sm text-stone-600">· {a}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-stone-600">{LAUNDRY_NOTE}</p>
          <Button href="/book" className="mt-8">Reserve Your Stay</Button>
        </div>
      </div>
    </div>
  );
}
