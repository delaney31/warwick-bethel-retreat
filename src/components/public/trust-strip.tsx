const ITEMS = [
  "15 minutes to Warwick Bethel",
  "Main bedroom from $150/night",
  "Two bedrooms from $200/night",
  "Host-reviewed bookings",
  "Secure payment after approval",
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-stone-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 md:gap-x-0 md:justify-between">
          {ITEMS.map((item, i) => (
            <li key={item} className="flex items-center md:flex-1 md:justify-center">
              {i > 0 && (
                <span
                  className="mx-3 hidden h-3 w-px shrink-0 bg-stone-300 md:inline"
                  aria-hidden
                />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
