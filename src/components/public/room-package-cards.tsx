import Link from "next/link";
import { BedDouble, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROOM_OPTIONS } from "@/lib/content/seo-landings/constants";
import { StayPackage } from "@/lib/pricing/stay-packages";

const ICONS = {
  [StayPackage.MAIN_BEDROOM]: BedDouble,
  [StayPackage.TWO_BEDROOMS]: Home,
} as const;

export function RoomPackageCards() {
  return (
    <section className="bg-sage-50/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            Stay packages
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
            Main bedroom or full cottage
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Book the private main bedroom alone, or reserve both bedrooms for your group — clear
            nightly rates with two guests included.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ROOM_OPTIONS.map((option) => {
            const Icon = ICONS[option.id];
            const isMain = option.id === StayPackage.MAIN_BEDROOM;

            return (
              <article
                key={option.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm ${
                  isMain ? "border-sage-300 ring-1 ring-sage-200" : "border-stone-200"
                }`}
              >
                {isMain && (
                  <span className="absolute -top-3 left-6 rounded-full bg-sage-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                  <Icon className="h-5 w-5" strokeWidth={1.25} />
                </span>
                <h3 className="mt-5 font-serif text-xl font-light text-stone-900">
                  {option.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{option.description}</p>
                <p className="mt-4 text-sm font-semibold text-sage-800">{option.rateLine}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/book" size="sm">
                    Request dates
                  </Button>
                  <Link
                    href={option.href}
                    className="inline-flex items-center text-sm font-medium text-stone-600 underline-offset-2 hover:text-sage-800 hover:underline"
                  >
                    View room photos →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
