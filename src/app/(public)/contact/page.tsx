import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/public/contact-form";
import { HostProfile } from "@/components/public/host-profile";
import { OffSiteListings } from "@/components/public/off-site-listings";
import { pageMetadata } from "@/lib/content/site-metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact the host at Tuxedo Retreat — questions about Bethel visitor lodging near Warwick Bethel before you book.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="bg-stone-50 pt-28 pb-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <div className="mx-auto grid max-w-5xl gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h1 className="font-serif text-4xl font-light text-stone-900">Contact your host</h1>
        <p className="mt-4 text-sm text-stone-600">
          Questions about a Bethel visitor stay near Warwick Bethel? We respond personally. See{" "}
          <Link href="/faq" className="font-medium text-sage-700 underline-offset-2 hover:underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link href="/book" className="font-medium text-sage-700 underline-offset-2 hover:underline">
            request a stay
          </Link>
          .
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
        <OffSiteListings className="mt-14 border-t border-stone-200 pt-10 lg:mt-0 lg:border-t-0 lg:pt-0" />
        </div>
        <HostProfile className="h-fit lg:sticky lg:top-28" />
      </div>
    </div>
  );
}
