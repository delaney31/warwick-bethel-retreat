import Link from "next/link";
import { getConfiguredOffSiteListings } from "@/lib/content/off-site-listings";

type OffSiteListingsProps = {
  heading?: string;
  intro?: string;
  className?: string;
};

export function OffSiteListings({
  heading = "Find Tuxedo Retreat elsewhere",
  intro = "Prefer to book on a marketplace or find us on Google Maps? Use the links below when your profile is live — direct booking at tuxedoretreat.com is always welcome for Bethel visitors.",
  className = "",
}: OffSiteListingsProps) {
  const listings = getConfiguredOffSiteListings();

  if (listings.length === 0) {
    return (
      <aside className={className}>
        <h2 className="font-serif text-xl font-light text-stone-900">{heading}</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{intro}</p>
        <p className="mt-3 text-sm text-stone-500">
          Google Business Profile, Airbnb, and Vrbo links appear here once configured in
          Vercel — see SEO-GROWTH.md in the repo for setup steps.
        </p>
      </aside>
    );
  }

  return (
    <aside className={className}>
      <h2 className="font-serif text-xl font-light text-stone-900">{heading}</h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{intro}</p>
      <ul className="mt-4 space-y-3">
        {listings.map((listing) => (
          <li key={listing.id}>
            <Link
              href={listing.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-stone-200 bg-white px-4 py-3 transition hover:border-sage-300"
            >
              <span className="text-sm font-medium text-stone-900">{listing.label}</span>
              <span className="mt-1 block text-xs text-stone-500">{listing.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
