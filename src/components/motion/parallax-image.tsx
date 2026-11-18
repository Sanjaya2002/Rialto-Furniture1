"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";
import { EASE_IN_OUT } from "./easing";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Travel as a percentage of the frame height. */
  strength?: number;
  /** Wipe the frame open the first time it enters the viewport. */
  reveal?: boolean;
}

/** Image that drifts inside its frame while scrolling, with an optional curtain reveal. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
  strength = 12,
  reveal = true,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden bg-bone", className)}
      initial={reveal ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
      whileInView={reveal ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.4, ease: EASE_IN_OUT }}
    >
      <motion.div className="absolute inset-x-0" style={{ y, top: `-${strength}%`, bottom: `-${strength}%` }}>
        <SmartImage src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
