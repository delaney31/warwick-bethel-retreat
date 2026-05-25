"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/ui/property-image";
import { PROPERTY_IMAGES } from "@/lib/content/property";

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden bg-stone-950 pb-24 pt-28">
      <div className="absolute inset-0">
        <PropertyImage
          src={PROPERTY_IMAGES.hero}
          alt="Warwick Bethel Retreat — luxury wooded cottage"
          imageKey="hero"
          fill
          priority
          className="opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Warwick, New York · 15 minutes from Warwick Bethel
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
          A quiet luxury retreat for your Bethel visit
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          Vaulted ceilings, hardwood floors, a wooded deck, and warm minimal interiors —
          personally hosted nightly stays designed for visitors, couples, and families.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href="/book" size="lg">
            Request Your Stay
          </Button>
          <Button href="/gallery" variant="secondary" size="lg">
            View the Retreat
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
