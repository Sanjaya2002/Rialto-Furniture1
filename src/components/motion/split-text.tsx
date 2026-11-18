"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./easing";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface SplitTextProps {
  /** Plain text. Use "\n" to force a line break. Wrap words in *asterisks* to italicise them. */
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view (for above-the-fold headings). */
  immediate?: boolean;
}

/**
 * Masked word-by-word reveal. Each word rises out of its own clipping box,
 * which reads like a line reveal without measuring layout.
 */
export function SplitText({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: SplitTextProps) {
  const Component = motion[as];
  const lines = text.split("\n");
  let index = 0;
  let inItalic = false;
  /** Supports multi-word *italic phrases*. */
  const italicState = (word: string) => {
    const opens = word.startsWith("*");
    const closes = word.endsWith("*") && (word.length > 1 || !opens);
    const italic = inItalic || opens;
    if (opens) inItalic = true;
    if (closes) inItalic = false;
    return italic;
  };

  const trigger = immediate
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Component className={className} aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")} {...trigger}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block" aria-hidden>
          {line
            .split(" ")
            .filter(Boolean)
            .map((word, wordIndex) => {
              const italic = italicState(word);
              const clean = word.replace(/\*/g, "");
              const i = index++;
              return (
                <Fragment key={wordIndex}>
                  <span
                    className={cn(
                      "inline-block overflow-hidden pb-[0.08em] align-bottom",
                      italic && "-mr-[0.08em] pr-[0.08em]",
                    )}
                  >
                    <motion.span
                      className={cn("inline-block", italic && "italic text-accent-deep")}
                      variants={{
                        hidden: { y: "105%" },
                        visible: {
                          y: "0%",
                          transition: { duration: 1.1, ease: EASE_OUT, delay: delay + i * stagger },
                        },
                      }}
                    >
                      {clean}
                    </motion.span>
                  </span>{" "}
                </Fragment>
              );
            })}
        </span>
      ))}
    </Component>
  );
}
