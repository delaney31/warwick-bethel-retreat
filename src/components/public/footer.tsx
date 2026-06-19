import Link from "next/link";
import { SITE_NAME } from "@/lib/content/brand";
import { getConfiguredOffSiteListings } from "@/lib/content/off-site-listings";

export function Footer() {
  const offSiteListings = getConfiguredOffSiteListings();

  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              {SITE_NAME}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Bethel visitor lodging in the Warwick, NY area — a quiet cottage fifteen
              minutes from Warwick Bethel headquarters, with personal host approval.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["/rooms", "Rooms & Amenities"],
                ["/gallery", "Gallery"],
                ["/availability", "Availability"],
                ["/book", "Reserve"],
                ["/guides", "Guides"],
                ["/faq", "FAQ"],
                ["/policies", "Policies"],
                ["/lodging-near-warwick-bethel", "Lodging near Bethel"],
                ["/bethel-visitor-guide", "Visitor guide"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
              Contact
            </p>
            <p className="mt-4 text-sm text-stone-400">
              Warwick area · 15 min from Warwick Bethel headquarters
            </p>
            <Link href="/contact" className="mt-2 inline-block text-sm text-amber-400 hover:text-amber-300">
              Send a message →
            </Link>
            {offSiteListings.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {offSiteListings.map((listing) => (
                  <li key={listing.id}>
                    <a
                      href={listing.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-white transition"
                    >
                      {listing.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <p className="mt-12 border-t border-stone-800 pt-8 text-center text-xs text-stone-600">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
