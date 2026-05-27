import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type GuideTheme = "luxury" | "retreat";

interface GuideLayoutProps {
  children: ReactNode;
  theme?: GuideTheme;
}

export function GuideLayout({ children, theme = "luxury" }: GuideLayoutProps) {
  return (
    <article
      className={cn(
        "min-h-screen pt-24 pb-20",
        theme === "luxury" ? "bg-white" : "bg-stone-50",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">{children}</div>
      </div>
    </article>
  );
}

export function GuideMain({ children, theme = "luxury" }: GuideLayoutProps) {
  return (
    <div
      className={cn(
        "lg:col-span-8",
        theme === "luxury"
          ? "prose-headings:text-midnight-950"
          : "prose-headings:font-serif prose-headings:font-light",
      )}
    >
      {children}
    </div>
  );
}

export function GuideAside({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-12 lg:col-span-4 lg:mt-0">
      <div className="lg:sticky lg:top-28">{children}</div>
    </aside>
  );
}
