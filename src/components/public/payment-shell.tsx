import Link from "next/link";
import { SITE_NAME } from "@/lib/content/brand";

export function PaymentShell({
  eyebrow,
  title,
  subtitle,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "min-h-dvh bg-stone-950 text-white" : "min-h-dvh bg-gradient-to-b from-stone-100 to-stone-50"}>
      <div
        className={
          dark
            ? "px-4 py-20 text-center md:py-28"
            : "border-b border-stone-200/60 bg-stone-950 px-4 py-16 text-center text-white md:py-20"
        }
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-400">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-3xl font-light md:text-4xl">{title}</h1>
        {subtitle && (
          <p className={`mx-auto mt-4 max-w-lg text-sm ${dark ? "text-white/70" : "text-white/60"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {!dark && <div className="mx-auto max-w-lg px-4 py-12">{children}</div>}
      {dark && <div className="px-4 py-8">{children}</div>}
      <p className="pb-10 text-center">
        <Link
          href="/"
          className="text-sm text-sage-700 underline-offset-4 hover:underline dark:text-amber-400"
        >
          Return to {SITE_NAME}
        </Link>
      </p>
    </div>
  );
}
