import Link from "next/link";
import { WHY_STAY_POINTS } from "@/lib/content/homepage";
import { Button } from "@/components/ui/button";

export function HomepageWhyStay() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            Why stay here
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 md:text-4xl">
            Warwick Bethel accommodation that feels like a retreat
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Tuxedo Retreat is Bethel visitor lodging in the truest sense — peaceful,
            respectful, and personally hosted in the Warwick, NY area, fifteen minutes from headquarters.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {WHY_STAY_POINTS.map((point) => (
            <li
              key={point.title}
              className="border-t border-stone-200 pt-8 text-center md:text-left"
            >
              <h3 className="font-serif text-xl font-light text-stone-900">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{point.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/lodging-near-warwick-bethel" variant="secondary">
            Lodging near Bethel
          </Button>
          <Link
            href="/warwick-bethel-visitor-stay"
            className="text-sm font-medium text-sage-700 underline-offset-2 hover:underline"
          >
            Visitor stay overview →
          </Link>
        </div>
      </div>
    </section>
  );
}
