"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate, pad } from "@/lib/utils";
import { EASE_OUT } from "@/components/motion/easing";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  product?: { name: string } | null;
}

export function Testimonials({ reviews }: { reviews: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (reviews.length === 0) return null;

  const review = reviews[index];
  const go = (delta: number) => setIndex((i) => (i + delta + reviews.length) % reviews.length);

  return (
    <section className="bg-bone py-24 md:py-36" aria-roledescription="carousel" aria-label="Customer reviews">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 lg:col-span-3">
          <p className="eyebrow">07 — In their words</p>
          {reviews.length > 1 && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                aria-label="Previous review"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                aria-label="Next review"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-sm tabular-nums text-ink-muted">
                {pad(index + 1)} / {pad(reviews.length)}
              </span>
            </div>
          )}
        </div>

        <div className="min-h-[18rem] lg:col-span-9" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <div className="mb-6 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < review.rating ? "text-accent" : "text-ink/15"} aria-hidden>
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="font-display text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.15] tracking-[-0.015em]">
                “{review.comment}”
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-medium">{review.name}</span>
                {review.product && <span className="text-ink-muted">on {review.product.name}</span>}
                <span className="text-ink-muted">· {formatDate(review.createdAt)}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
