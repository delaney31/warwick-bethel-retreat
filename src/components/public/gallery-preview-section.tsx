import Link from "next/link";
import { PropertyImage } from "@/components/ui/property-image";
import { getPhotoById, getPhotoFallbackKey } from "@/lib/content/property";

/** Curated editorial set for the homepage — includes both bedrooms with clear context. */
const PREVIEW_IDS = [
  { id: "living-vaulted", span: "lg:col-span-8 lg:row-span-2", aspect: "aspect-[4/3] lg:aspect-auto lg:min-h-[420px]" },
  { id: "outdoor-deck", span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { id: "main-bedroom-pink", span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { id: "second-bedroom-both-beds", span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { id: "main-bedroom-wide", span: "lg:col-span-6", aspect: "aspect-[16/10]" },
  { id: "coffee-station", span: "lg:col-span-6", aspect: "aspect-[16/10]" },
] as const;

export function GalleryPreviewSection() {
  const previews = PREVIEW_IDS.map((item) => ({
    ...item,
    photo: getPhotoById(item.id),
  })).filter((item) => item.photo);

  return (
    <section id="photos" className="scroll-mt-28 bg-stone-100 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
              Inside the retreat
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
              Main bedroom, second bedroom, and exterior
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
              Book the main bedroom alone, or reserve both bedrooms for your group. Photos are
              labeled by room so you know exactly what is included in each package.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-sage-700 bg-sage-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sage-800"
          >
            View full gallery
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
          {previews.map(({ photo, span, aspect }, i) => {
            if (!photo) return null;
            const label =
              photo.room === "main-bedroom"
                ? "Main bedroom"
                : photo.room === "second-bedroom"
                  ? "Second bedroom"
                  : photo.room === "shared"
                    ? "Shared space"
                    : "Exterior";

            return (
              <Link
                key={`${photo.id}-${i}`}
                href="/gallery"
                className={`group relative block overflow-hidden rounded-xl bg-stone-200 ${span} ${aspect}`}
              >
                <PropertyImage
                  src={photo.src}
                  alt={photo.alt}
                  imageKey={getPhotoFallbackKey(photo)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute left-3 top-3 rounded-full bg-stone-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {label}
                </div>
                <div className="absolute inset-0 bg-stone-950/0 transition group-hover:bg-stone-950/15" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
