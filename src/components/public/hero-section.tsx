"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/ui/property-image";
import {
  HERO_EYEBROW,
  HERO_HEADLINE,
  HERO_SUBHEADLINE,
  SITE_NAME,
} from "@/lib/content/brand";
import { PROPERTY_IMAGES } from "@/lib/content/property";

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden bg-stone-950 pb-20 pt-28 md:pb-28">
      <div className="absolute inset-0">
        <PropertyImage
          src={PROPERTY_IMAGES.hero}
          alt={`${SITE_NAME} — luxury home in a quiet wooded setting`}
          imageKey="hero"
          fill
          priority
          className="scale-105 object-cover opacity-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400/95">
          {HERO_EYEBROW}
        </p>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl font-light leading-[1.06] tracking-tight text-white md:text-6xl lg:text-[3.5rem]">
          {HERO_HEADLINE}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/72 md:text-lg md:leading-relaxed">
          {HERO_SUBHEADLINE}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button href="/book" size="lg">
            Request Your Stay
          </Button>
          <Button
            href="/rooms"
            size="lg"
            className="border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
          >
            View Rooms
          </Button>
        </div>
        <p className="mt-8 text-sm text-white/45">
          Personally reviewed by your host · No payment until approved
        </p>
      </motion.div>
    </section>
  );
}
