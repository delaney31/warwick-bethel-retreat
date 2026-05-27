import Link from "next/link";
import { CORE_SITE_LINKS, HOMEPAGE_SEO_LINKS } from "@/lib/content/homepage";

export function HomepageExploreLinks() {
  return (
    <section className="bg-stone-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-600">
            Plan your visit
          </p>
          <h2 className="mt-3 font-serif text-2xl font-light text-stone-900 md:text-3xl">
            Everything you need before you request
          </h2>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {CORE_SITE_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:border-sage-300 hover:text-sage-800"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <nav
          aria-label="Bethel visitor guides"
          className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2"
        >
          {HOMEPAGE_SEO_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 text-xs text-stone-500 underline-offset-2 hover:text-sage-700 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
