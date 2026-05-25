"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyImage } from "@/components/ui/property-image";
import { GALLERY_IMAGES } from "@/lib/content/property";
import { cn } from "@/lib/utils/cn";

export function ImageGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-200 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <PropertyImage
              src={GALLERY_IMAGES[active].src}
              alt={GALLERY_IMAGES[active].alt}
              imageKey={GALLERY_IMAGES[active].key}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
        {GALLERY_IMAGES.map((img, i) => (
          <button
            key={img.alt}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg",
              active === i && "ring-2 ring-sage-600 ring-offset-2",
            )}
          >
            <PropertyImage src={img.src} alt={img.alt} imageKey={img.key} fill sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  );
}
