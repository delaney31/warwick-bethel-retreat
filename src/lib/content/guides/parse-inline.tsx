import type { ReactNode } from "react";
import Link from "next/link";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders paragraphs with optional [text](/path) markdown-style links. */
export function parseInlineLinks(text: string, linkClassName?: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, href] = match;
    parts.push(
      <Link
        key={key++}
        href={href}
        className={
          linkClassName ??
          "font-medium text-gold-700 underline-offset-2 hover:text-gold-600 hover:underline"
        }
      >
        {label}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
