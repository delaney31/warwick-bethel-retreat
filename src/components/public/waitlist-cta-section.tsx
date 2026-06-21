import { Button } from "@/components/ui/button";

export function WaitlistCtaSection() {
  return (
    <section className="bg-amber-50/60 py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-800/80">
          Convention weeks fill quickly
        </p>
        <h2 className="mt-3 font-serif text-2xl font-light text-stone-900 md:text-3xl">
          Dates not open? Join the waitlist
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          If your Bethel dates are already booked or under review, send a note with your preferred
          nights. Your host will reach out if dates open or a nearby week works for your schedule.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" size="lg">
            Contact your host
          </Button>
          <Button href="/availability" variant="secondary" size="lg">
            Recheck calendar
          </Button>
        </div>
      </div>
    </section>
  );
}
