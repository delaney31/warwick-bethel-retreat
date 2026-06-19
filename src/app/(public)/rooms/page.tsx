import type { Metadata } from "next";
import { PropertyImage } from "@/components/ui/property-image";
import {
  AMENITIES,
  LAUNDRY_NOTE,
  PHOTO_ROOM_META,
  getPhotoFallbackKey,
  getPhotosByRoom,
} from "@/lib/content/property";
import { pageMetadata } from "@/lib/content/site-metadata";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, roomOffersSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Rooms & Amenities",
  description:
    "Main bedroom and second bedroom photos, rates, and amenities — two-bedroom cottage at Tuxedo Retreat near Warwick Bethel.",
  path: "/rooms",
});

function RoomPhotoGrid({ room }: { room: "main-bedroom" | "second-bedroom" | "shared" | "exterior" }) {
  const photos = getPhotosByRoom(room);
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {photos.map((photo) => (
        <figure key={photo.id} className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="relative aspect-[4/3]">
            <PropertyImage
              src={photo.src}
              alt={photo.alt}
              imageKey={getPhotoFallbackKey(photo)}
              fill
              sizes="50vw"
            />
          </div>
          <figcaption className="border-t border-stone-100 px-4 py-3 text-xs text-stone-600">
            {photo.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

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
          Two distinct bedrooms with their own living areas. Photos below are grouped so you can see
          exactly what is included in the main-bedroom package versus the full two-bedroom cottage.
        </p>

        <section className="mt-16 rounded-2xl border border-sage-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sage-700">
            {PHOTO_ROOM_META["main-bedroom"].title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-900">Main bedroom · $150/night</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
            {PHOTO_ROOM_META["main-bedroom"].description} Queen bed with coral bedding, private desk,
            reading chair, vaulted living, studio dining, and direct access to the wooded deck.
          </p>
          <RoomPhotoGrid room="main-bedroom" />
        </section>

        <section className="mt-12 rounded-2xl border border-amber-200/80 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-800">
            {PHOTO_ROOM_META["second-bedroom"].title}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-stone-900">
            Second bedroom · with two-bedroom booking
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
            {PHOTO_ROOM_META["second-bedroom"].description} This room is not sold separately — it
            is included when you reserve both bedrooms for $200/night (2 guests included).
          </p>
          <RoomPhotoGrid room="second-bedroom" />
        </section>

        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500">
            {PHOTO_ROOM_META.exterior.title}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light text-stone-900">Property approach & deck</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
            {PHOTO_ROOM_META.exterior.description} The deck connects to the main-bedroom living area.
          </p>
          <RoomPhotoGrid room="exterior" />
        </section>

        <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="text-lg font-medium text-stone-900">Rates</h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            <li>
              <strong className="text-stone-900">Main bedroom:</strong> $150/night for 2 guests · +$25/night
              per extra guest · photos above under “Main bedroom”
            </li>
            <li>
              <strong className="text-stone-900">Two bedrooms:</strong> $200/night for 2 guests · +$25/night
              per extra guest · main + second bedroom photos above
            </li>
          </ul>
          <h2 className="mt-8 text-lg font-medium text-stone-900">Full amenity list</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {AMENITIES.map((a) => (
              <li key={a} className="text-sm text-stone-600">· {a}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-stone-600">{LAUNDRY_NOTE}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/book">Reserve Your Stay</Button>
            <Button href="/gallery" variant="secondary">
              View full gallery
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
