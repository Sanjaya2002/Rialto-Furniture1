"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "./easing";

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const format = (v: number) => `${Math.round(v).toLocaleString("en-US")}${suffix}`;
    if (reduced) {
      node.textContent = format(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 2,
      ease: EASE_OUT,
      onUpdate: (v) => (node.textContent = format(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, suffix, to]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
