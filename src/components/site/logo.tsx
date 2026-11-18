import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Brand lockup from the official artwork. `tone="light"` uses the knockout
 * version (paper tile + wordmark, orange kept) for dark backgrounds and photography.
 */
export function Logo({ tone = "color", className }: { tone?: "color" | "light"; className?: string }) {
  return (
    <Image
      src={tone === "light" ? "/brand/logo-light.png" : "/brand/logo.png"}
      alt="Rialto Furniture"
      width={300}
      height={85}
      priority
      className={cn("h-auto w-[132px] md:w-[150px]", className)}
    />
  );
}
