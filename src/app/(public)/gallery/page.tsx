import type { Metadata } from "next";
import { ImageGallery } from "@/components/public/image-gallery";
import { pageMetadata } from "@/lib/content/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "Gallery of Tuxedo Retreat — vaulted ceilings, wooded deck, premium interiors near Warwick Bethel.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-600">Gallery</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-stone-900">The retreat, in detail</h1>
        <p className="mt-4 text-stone-600">Vaulted ceilings · large windows · hardwood floors · wooded surroundings</p>
        <div className="mt-12">
          <ImageGallery />
        </div>
      </div>
    </div>
  );
}
