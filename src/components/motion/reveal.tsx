"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { EASE_OUT } from "./easing";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  once?: boolean;
};

/** Fades and lifts content in when it scrolls into view. */
export function Reveal({ delay = 0, y = 28, once = true, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct <RevealItem> children. */
export function RevealGroup({
  stagger = 0.08,
  children,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE_OUT } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
