"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyImage } from "@/components/ui/property-image";
import {
  GALLERY_SECTION_ORDER,
  PHOTO_ROOM_META,
  PROPERTY_PHOTOS,
  getPhotoFallbackKey,
  type PhotoRoom,
  type PropertyPhoto,
} from "@/lib/content/property";
import { cn } from "@/lib/utils/cn";

function roomBadgeClass(room: PhotoRoom): string {
  switch (room) {
    case "main-bedroom":
      return "bg-sage-700 text-white";
    case "second-bedroom":
      return "bg-amber-800 text-white";
    case "shared":
      return "bg-stone-600 text-white";
    default:
      return "bg-stone-800 text-white";
  }
}

export function ImageGallery() {
  const [activeId, setActiveId] = useState(PROPERTY_PHOTOS[0]?.id ?? "hero");

  const active = useMemo(
    () => PROPERTY_PHOTOS.find((photo) => photo.id === activeId) ?? PROPERTY_PHOTOS[0],
    [activeId],
  );

  const sections = useMemo(
    () =>
      GALLERY_SECTION_ORDER.map((room) => ({
        room,
        meta: PHOTO_ROOM_META[room],
        photos: PROPERTY_PHOTOS.filter((photo) => photo.room === room),
      })).filter((section) => section.photos.length > 0),
    [],
  );

  if (!active) return null;

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-200 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <PropertyImage
                src={active.src}
                alt={active.alt}
                imageKey={getPhotoFallbackKey(active)}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
                roomBadgeClass(active.room),
              )}
            >
              {PHOTO_ROOM_META[active.room].title}
            </span>
          </div>
        </div>
        <p className="text-sm text-stone-600">{active.caption}</p>
      </div>

      {sections.map(({ room, meta, photos }) => (
        <section key={room} aria-labelledby={`gallery-${room}`}>
          <div className="mb-4">
            <h2 id={`gallery-${room}`} className="font-serif text-2xl font-light text-stone-900">
              {meta.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
              {meta.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo: PropertyPhoto) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveId(photo.id)}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-lg text-left",
                  active.id === photo.id && "ring-2 ring-sage-600 ring-offset-2",
                )}
              >
                <PropertyImage
                  src={photo.src}
                  alt={photo.alt}
                  imageKey={getPhotoFallbackKey(photo)}
                  fill
                  sizes="200px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-2">
                  <span
                    className={cn(
                      "inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                      roomBadgeClass(photo.room),
                    )}
                  >
                    {photo.room === "main-bedroom"
                      ? "Main"
                      : photo.room === "second-bedroom"
                        ? "2nd"
                        : meta.title.split(" ")[0]}
                  </span>
                  <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-white/90">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
