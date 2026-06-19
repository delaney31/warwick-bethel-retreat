import Link from "next/link";
import { HOST_PROFILE, SITE_CONTACT_EMAIL } from "@/lib/content/brand";

export function HostProfile({ className = "" }: { className?: string }) {
  return (
    <aside className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sage-700">
        Your host
      </p>
      <h2 className="mt-2 font-serif text-2xl font-light text-stone-900">{HOST_PROFILE.name}</h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">{HOST_PROFILE.bio}</p>
      <ul className="mt-5 space-y-2 text-sm text-stone-700">
        <li>
          <span className="text-stone-500">Email · </span>
          <a
            href={`mailto:${SITE_CONTACT_EMAIL}`}
            className="font-medium text-sage-800 underline-offset-2 hover:underline"
          >
            {SITE_CONTACT_EMAIL}
          </a>
        </li>
        <li>
          <span className="text-stone-500">Phone · </span>
          <a
            href={`tel:${HOST_PROFILE.phoneTel}`}
            className="font-medium text-sage-800 underline-offset-2 hover:underline"
          >
            {HOST_PROFILE.phoneDisplay}
          </a>
        </li>
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        Every reservation is personally reviewed. Questions before you book?{" "}
        <Link href="/contact" className="text-sage-700 underline-offset-2 hover:underline">
          Send a message
        </Link>
        .
      </p>
    </aside>
  );
}
