import { Button } from "@/components/ui/button";
import type { GuideCta } from "@/lib/content/guides/types";
import { cn } from "@/lib/utils/cn";
import type { GuideTheme } from "./guide-layout";

interface GuideCtaSectionProps {
  cta: GuideCta;
  theme?: GuideTheme;
}

export function GuideCtaSection({ cta, theme = "luxury" }: GuideCtaSectionProps) {
  const isRetreat = theme === "retreat";

  return (
    <section
      className={cn(
        "mt-16 rounded-2xl px-6 py-12 text-center md:px-10",
        isRetreat ? "bg-stone-900 text-white" : "bg-midnight-950 text-white",
      )}
    >
      <h2
        className={cn(
          "text-2xl font-bold tracking-tight md:text-3xl",
          isRetreat && "font-serif font-light",
        )}
      >
        {cta.heading}
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60">
        {cta.body}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href={cta.primaryHref} size="lg">
          {cta.primaryLabel}
        </Button>
        {cta.secondaryLabel && cta.secondaryHref && (
          <Button
            href={cta.secondaryHref}
            variant="secondary"
            size="lg"
            className={isRetreat ? "border-white/20 bg-transparent text-white hover:bg-white/10" : undefined}
          >
            {cta.secondaryLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
