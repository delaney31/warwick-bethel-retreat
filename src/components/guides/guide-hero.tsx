import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { GuideTheme } from "./guide-layout";

interface GuideHeroProps {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  heroImage?: string;
  heroImageAlt?: string;
  theme?: GuideTheme;
}

function formatGuideDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function GuideHero({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  heroImage,
  heroImageAlt,
  theme = "luxury",
}: GuideHeroProps) {
  const isRetreat = theme === "retreat";

  return (
    <header className="mb-12">
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.25em]",
          isRetreat ? "text-sage-600" : "text-gold-600",
        )}
      >
        Guide
      </p>
      <h1
        className={cn(
          "mt-3 text-4xl font-bold tracking-tight md:text-5xl",
          isRetreat ? "font-serif font-light text-stone-900" : "text-midnight-950",
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-4 max-w-2xl text-lg leading-relaxed",
          isRetreat ? "text-stone-600" : "text-midnight-600",
        )}
      >
        {description}
      </p>
      <p className="mt-4 text-sm text-midnight-500">
        <span className={isRetreat ? "text-stone-500" : undefined}>
          By {author}
        </span>
        <span className="mx-2 text-midnight-300">·</span>
        Published {formatGuideDate(publishedAt)}
        {updatedAt !== publishedAt && (
          <>
            <span className="mx-2 text-midnight-300">·</span>
            Updated {formatGuideDate(updatedAt)}
          </>
        )}
      </p>

      {heroImage && (
        <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl bg-midnight-100">
          <Image
            src={heroImage}
            alt={heroImageAlt ?? title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
          />
        </div>
      )}
    </header>
  );
}
