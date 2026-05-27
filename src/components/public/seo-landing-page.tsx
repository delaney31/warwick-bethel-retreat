import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { Button } from "@/components/ui/button";
import type { SeoLandingPage } from "@/lib/content/seo-landings";
import { BOOKING_STEPS, CORE_SITE_LINKS, ROOM_OPTIONS } from "@/lib/content/seo-landings";

interface SeoLandingPageViewProps {
  page: SeoLandingPage;
}

export function SeoLandingPageView({ page }: SeoLandingPageViewProps) {
  const faqItems = page.faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <div className="bg-stone-50">
      <section className="bg-gradient-to-b from-stone-100 via-stone-50 to-stone-50 pb-16 pt-28 md:pb-20 md:pt-36">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            {page.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-stone-900 md:text-5xl">
            {page.h1}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
            {page.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/book" size="lg">
              Request Your Stay
            </Button>
            <Button href="/availability" variant="secondary" size="lg">
              Check Availability
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-serif text-2xl font-light text-stone-900 md:text-3xl">
            {page.bethelDistance.headline}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-600">
            {page.bethelDistance.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-serif text-2xl font-light text-stone-900 md:text-3xl">
            Room options
          </h2>
          {page.roomOptionsIntro && (
            <p className="mt-3 max-w-2xl text-sm text-stone-600">{page.roomOptionsIntro}</p>
          )}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {ROOM_OPTIONS.map((room) => (
              <article
                key={room.id}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-medium text-stone-900">{room.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{room.description}</p>
                <p className="mt-4 text-sm font-medium text-sage-700">{room.rateLine}</p>
                <Link
                  href={room.href}
                  className="mt-4 inline-block text-sm font-medium text-sage-700 underline-offset-2 hover:underline"
                >
                  View on Rooms page →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-serif text-2xl font-light text-stone-900 md:text-3xl">
            {page.pricing.headline}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-600">
            {page.pricing.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-900 py-14 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-serif text-2xl font-light md:text-3xl">{page.booking.headline}</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">{page.booking.intro}</p>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BOOKING_STEPS.map((step, index) => (
              <li key={step.title}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-sm font-medium text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href="/book" size="lg">
              Open reservation form
            </Button>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-serif text-2xl font-light text-stone-900 md:text-3xl">
            {page.propertyDetails.headline}
          </h2>
          <ul className="mt-8 space-y-6">
            {page.propertyDetails.items.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-stone-200 bg-white px-5 py-4"
              >
                <h3 className="text-sm font-medium text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-serif text-2xl font-light text-stone-900 md:text-3xl">
            Questions guests often ask
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            More answers on our{" "}
            <Link href="/faq" className="font-medium text-sage-700 underline-offset-2 hover:underline">
              FAQ page
            </Link>
            .
          </p>
          <div className="mt-8">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-100/60 py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
            Plan your visit
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {CORE_SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-medium text-sage-700 underline-offset-2 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {page.relatedLinks.length > 0 && (
            <>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-widest text-stone-500">
                Related guides
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {page.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-stone-600 underline-offset-2 hover:text-sage-700 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="bg-stone-950 py-20 text-center text-white md:py-24">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          <h2 className="font-serif text-3xl font-light md:text-4xl">{page.cta.heading}</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/60">
            {page.cta.body}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/book" size="lg">
              Request Your Stay
            </Button>
            <Button
              href="/rooms"
              size="lg"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              View Rooms
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
