"use client";

import { motion, useSpring } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function ScrollProgress() {
  const progress = useScrollProgress();
  const scaleX = useSpring(progress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-gold"
      style={{ scaleX }}
    />
  );
}
