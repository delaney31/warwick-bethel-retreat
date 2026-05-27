"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/content/faq";
import { cn } from "@/lib/utils/cn";

export interface FaqAccordionItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items?: FaqAccordionItem[];
}

export function FaqAccordion({ items = FAQ_ITEMS }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white/80">
      {items.map((item, i) => (
        <div key={item.question}>
          <button
            type="button"
            className="flex w-full items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium text-stone-900">{item.question}</span>
            <span className="text-stone-400">{open === i ? "−" : "+"}</span>
          </button>
          <div className={cn("overflow-hidden px-6 transition-all", open === i ? "max-h-96 pb-5" : "max-h-0")}>
            <p className="text-sm leading-relaxed text-stone-600">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
