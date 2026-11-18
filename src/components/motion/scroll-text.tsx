"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Paragraph whose words "ink in" as it scrolls through the viewport.
 * Words wrapped in *asterisks* are set in italic.
 */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} aria-label={text.replace(/\*/g, "")}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const italic = children.startsWith("*");
  return (
    <span className="relative mr-[0.25em]" aria-hidden>
      <motion.span style={{ opacity }} className={cn(italic && "italic text-accent-deep")}>
        {children.replace(/\*/g, "")}
      </motion.span>
    </span>
  );
}
