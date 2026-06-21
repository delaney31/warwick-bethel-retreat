import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RETREAT_LOCATION } from "@/lib/content/seo-landings/constants";

export function HomepageDirectionsSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
              Getting to Bethel
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
              About fifteen minutes to Warwick Bethel
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-600 md:text-base">
              Tuxedo Retreat sits in a wooded residential area of the Warwick, NY community — close
              enough for a straightforward morning drive, far enough for quiet evenings on the deck.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-stone-700">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" strokeWidth={1.5} />
                <span>{RETREAT_LOCATION.area}</span>
              </li>
              <li className="flex gap-3">
                <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" strokeWidth={1.5} />
                <span>{RETREAT_LOCATION.driveNote}</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/directions-to-warwick-bethel" size="md">
                Directions &amp; drive tips
              </Button>
              <Button href="/book" variant="secondary" size="md">
                Request your stay
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500">
              Before you travel
            </p>
            <ol className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700">
              <li>
                <span className="font-semibold text-stone-900">1. Request dates</span> — choose main
                bedroom or full cottage on our booking form.
              </li>
              <li>
                <span className="font-semibold text-stone-900">2. Host review</span> — your host
                confirms details before inviting payment.
              </li>
              <li>
                <span className="font-semibold text-stone-900">3. Plan your drive</span> — use our{" "}
                <Link
                  href="/directions-to-warwick-bethel"
                  className="font-medium text-sage-700 underline-offset-2 hover:underline"
                >
                  directions guide
                </Link>{" "}
                and a maps app once dates are set.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
