"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/ui/property-image";
import { SITE_NAME } from "@/lib/content/brand";
import { HOMEPAGE_HERO, HOMEPAGE_SEO_LINKS } from "@/lib/content/homepage";
import { PROPERTY_IMAGES } from "@/lib/content/property";

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden bg-stone-950 pb-20 pt-28 md:pb-28">
      <div className="absolute inset-0">
        <PropertyImage
          src={PROPERTY_IMAGES.hero}
          alt={`${SITE_NAME} — peaceful lodging near Warwick Bethel in a wooded setting`}
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
          {HOMEPAGE_HERO.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl font-serif text-4xl font-light leading-[1.06] tracking-tight text-white md:text-6xl lg:text-[3.5rem]">
          {HOMEPAGE_HERO.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/72 md:text-lg md:leading-relaxed">
          {HOMEPAGE_HERO.intro}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
          {HOMEPAGE_HERO.subintro}{" "}
          <Link
            href="/lodging-near-warwick-bethel"
            className="font-medium text-amber-300/90 underline-offset-4 hover:text-amber-200"
          >
            Lodging near Warwick Bethel
          </Link>{" "}
          in the Warwick area — a{" "}
          <Link
            href="/warwick-bethel-visitor-stay"
            className="font-medium text-amber-300/90 underline-offset-4 hover:text-amber-200"
          >
            Bethel visitor stay
          </Link>{" "}
          (not a general Tuxedo Park resort). Traveling lightly? See our{" "}
          <Link
            href="/private-room-near-warwick-ny"
            className="font-medium text-amber-300/90 underline-offset-4 hover:text-amber-200"
          >
            private room near Warwick, NY
          </Link>
          .
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Button href="/book" size="lg">
            Request Your Stay
          </Button>
          <Button
            href="/gallery"
            size="lg"
            className="border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
          >
            View Gallery
          </Button>
          <Button
            href="/availability"
            size="lg"
            className="border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
          >
            Check Availability
          </Button>
        </div>

        <nav
          aria-label="Visitor planning links"
          className="mt-8 flex flex-wrap gap-2"
        >
          <Link
            href="/gallery"
            className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1.5 text-[11px] font-medium text-amber-100 transition hover:border-amber-300/50 hover:text-white"
          >
            Photo gallery
          </Link>
          {HOMEPAGE_SEO_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/50 transition hover:border-amber-400/30 hover:text-amber-200/90"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </section>
  );
}
