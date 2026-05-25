import Link from "next/link";
import { PropertyImage } from "@/components/ui/property-image";
import { GALLERY_IMAGES } from "@/lib/content/property";

/** Curated editorial set for the homepage */
const PREVIEW = [
  { ...GALLERY_IMAGES[1], span: "lg:col-span-8 lg:row-span-2", aspect: "aspect-[4/3] lg:aspect-auto lg:min-h-[420px]" },
  { ...GALLERY_IMAGES[11], span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { ...GALLERY_IMAGES[3], span: "lg:col-span-4", aspect: "aspect-[4/3]" },
  { ...GALLERY_IMAGES[4], span: "lg:col-span-6", aspect: "aspect-[16/10]" },
  { ...GALLERY_IMAGES[10], span: "lg:col-span-6", aspect: "aspect-[16/10]" },
] as const;

export function GalleryPreviewSection() {
  return (
    <section className="bg-stone-100 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
              Inside the retreat
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
              Light, wood, and unhurried rooms
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-medium text-sage-800 underline-offset-4 transition hover:text-sage-950 hover:underline"
          >
            Full gallery →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
          {PREVIEW.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className={`group relative overflow-hidden rounded-xl bg-stone-200 ${img.span} ${img.aspect}`}
            >
              <PropertyImage
                src={img.src}
                alt={img.alt}
                imageKey={img.key}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="transition duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-stone-950/0 transition group-hover:bg-stone-950/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
