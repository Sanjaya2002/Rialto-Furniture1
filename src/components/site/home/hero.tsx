"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { IMAGERY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/motion/split-text";
import { EASE_IN_OUT, EASE_OUT } from "@/components/motion/easing";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-paper">
      <motion.div
        className="grain absolute inset-0"
        initial={{ clipPath: "inset(12% 12% 12% 12%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.6, ease: EASE_IN_OUT }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: imageY, scale: imageScale }}
        >
          <Image
            src={IMAGERY.hero}
            alt="A bright boardroom furnished with a long timber table and blush upholstered chairs"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />
      </motion.div>

      <motion.div
        className="container relative flex h-full flex-col justify-end pb-10 pt-28 md:pb-14"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="eyebrow mb-6 text-paper/70 md:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Office · Commercial · Education — Sri Lanka
        </motion.p>

        <SplitText
          as="h1"
          immediate
          delay={0.55}
          text={"Furniture for\nthe way you *work.*"}
          className="max-w-[14ch] text-display-xl [&_.text-accent-deep]:text-accent"
        />

        <div className="mt-10 grid gap-8 border-t border-paper/20 pt-6 md:mt-14 md:grid-cols-12 md:items-end">
          <motion.p
            className="max-w-md text-[0.95rem] leading-relaxed text-paper/75 md:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1, ease: EASE_OUT }}
          >
            Ergonomic seating and considered pieces for offices, receptions and lecture halls — supplied,
            delivered and set up across the island.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 md:col-span-7 md:justify-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 1, ease: EASE_OUT }}
          >
            <Button asChild variant="light" size="lg">
              <Link href="/shop">Explore the collection</Link>
            </Button>
            <Button asChild variant="outline-light" size="lg">
              <Link href="/custom-order">Commission a piece</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute right-5 top-32 hidden items-center gap-3 text-[0.7rem] uppercase tracking-[0.2em] text-paper/60 lg:right-10 xl:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ writingMode: "vertical-rl" }}
          aria-hidden
        >
          <ArrowDownRight className="h-4 w-4 rotate-45" />
          <span>Scroll</span>
          <span className="relative h-14 w-px overflow-hidden bg-paper/20">
            <span className="absolute inset-0 animate-scroll-cue bg-paper" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
