"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CategorySummary } from "@/lib/types";
import { IMAGERY } from "@/lib/constants";
import { pad } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";
import { SplitText } from "@/components/motion/split-text";

const FALLBACKS = [IMAGERY.workspace, IMAGERY.lounge, IMAGERY.detail, IMAGERY.corridor];

/**
 * Desktop: the section pins and the categories travel horizontally as you scroll.
 * Mobile/tablet: a native swipe rail with scroll-snap.
 */
export function CategoryRail({ categories }: { categories: CategorySummary[] }) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [categories.length]);
  const progress = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  if (categories.length === 0) return null;

  const header = (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow mb-5">02 — Ranges</p>
        <SplitText text={"Shop by *space*"} className="text-display-lg" />
      </div>
      <Link href="/shop" className="link-underline self-start text-sm md:self-auto">
        View all furniture
      </Link>
    </div>
  );

  const card = (category: CategorySummary, i: number, eager = false) => (
    <Link
      key={category.id}
      href={`/shop?category=${category.slug}`}
      className="group relative block h-full overflow-hidden bg-ink text-paper"
    >
      <SmartImage
        src={category.image || FALLBACKS[i % FALLBACKS.length]}
        alt=""
        fill
        sizes="(min-width: 1024px) 34vw, 80vw"
        priority={eager}
        className="object-cover opacity-90 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-ink/35" />
      <div className="absolute inset-x-0 top-0 flex justify-between p-5 text-xs tabular-nums text-paper/80">
        <span>{pad(i + 1)}</span>
        <span>
          {category.productCount} piece{category.productCount === 1 ? "" : "s"}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
        <div>
          <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.6rem)] leading-none">{category.name}</h3>
          {category.description && (
            <p className="mt-3 line-clamp-2 max-w-sm text-sm text-paper/70">{category.description}</p>
          )}
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/40 transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );

  return (
    <section aria-labelledby="ranges" className="bg-bone">
      {/* Mobile & tablet */}
      <div className="py-20 lg:hidden">
        <div className="container mb-10">{header}</div>
        <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:scroll-px-6 sm:px-6">
          {categories.map((c, i) => (
            <div key={c.id} className="aspect-[3/4] w-[78vw] shrink-0 snap-start sm:w-[46vw]">
              {card(c, i)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop pinned */}
      <div
        ref={target}
        className="relative hidden lg:block"
        style={{ height: `${100 + categories.length * 45}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="container mb-12">{header}</div>
          <motion.div
            ref={track}
            style={{ x }}
            className="flex w-max gap-6 pl-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] pr-10 will-change-transform"
          >
            {categories.map((c, i) => (
              <div key={c.id} className="h-[58vh] w-[34vw] max-w-[560px] shrink-0">
                {card(c, i, i < 2)}
              </div>
            ))}
            <div className="flex h-[58vh] w-[24vw] shrink-0 flex-col justify-end border-l border-ink/15 pl-8">
              <p className="font-display text-display-sm">Not sure what fits?</p>
              <Link href="/contact" className="link-underline mt-4 self-start text-sm">
                Ask for a space consultation
              </Link>
            </div>
          </motion.div>
          <div className="container mt-10">
            <div className="h-px w-full bg-ink/10">
              <motion.div className="h-px origin-left bg-ink" style={{ scaleX: progress }} />
            </div>
          </div>
        </div>
      </div>
      <span id="ranges" className="sr-only">
        Shop by space
      </span>
    </section>
  );
}
