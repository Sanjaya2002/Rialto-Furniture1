"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { IMAGERY } from "@/lib/constants";

const OPTIMIZED_HOSTS = [/^images\.unsplash\.com$/, /^plus\.unsplash\.com$/, /\.supabase\.co$/];

/**
 * next/image only optimises whitelisted hosts. Product images are entered by
 * admins as arbitrary URLs, so anything else is served as-is instead of crashing,
 * and a broken URL falls back to a neutral placeholder photo.
 */
function canOptimize(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const { hostname, protocol } = new URL(src);
    return protocol === "https:" && OPTIMIZED_HOSTS.some((re) => re.test(hostname));
  } catch {
    return false;
  }
}

export function SmartImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  const [failed, setFailed] = useState(false);
  const current = failed ? IMAGERY.productFallback : src;

  return (
    <Image
      src={current}
      alt={alt}
      unoptimized={!canOptimize(current)}
      onError={() => {
        if (!failed && src !== IMAGERY.productFallback) setFailed(true);
      }}
      {...props}
    />
  );
}
