"use client";

import Image from "next/image";
import { useState } from "react";
import {
  PROPERTY_IMAGE_FALLBACKS,
  type PROPERTY_IMAGES,
} from "@/lib/content/property";
import { cn } from "@/lib/utils/cn";

interface PropertyImageProps {
  src: string;
  alt: string;
  imageKey?: keyof typeof PROPERTY_IMAGES;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function PropertyImage({
  src,
  alt,
  imageKey,
  fill,
  className,
  priority,
  sizes = "100vw",
}: PropertyImageProps) {
  const fallback = imageKey ? PROPERTY_IMAGE_FALLBACKS[imageKey] : undefined;
  const [currentSrc, setCurrentSrc] = useState(src);

  const isExternal = currentSrc.startsWith("http");

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : 1200}
      height={fill ? undefined : 800}
      className={cn("object-cover", className)}
      priority={priority}
      sizes={sizes}
      unoptimized={isExternal}
      onError={() => {
        if (fallback && currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
    />
  );
}
